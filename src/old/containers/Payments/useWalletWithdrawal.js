import { useMutation, useQuery } from '@tanstack/react-query';
import { endOfDay } from 'date-fns';
import { useDispatch } from 'react-redux';

import { centsToDollar, httpClient } from '@app/utils';

import { showAlert } from '../../redux/notifier';

export const TRANSACTION_TYPES = {
  WITHDRAWAL: 'PromisepayWithdrawal',
  PROMISE_PAY: 'PromisepayItem',
};

export const QUERY_KEYS = {
  VERIFY: 'verifyWalletBalance',
  DISBURSE: 'disburseWalletBalance',
  TRANSACTIONS: 'fetchCompletedWalletTransactions',
  PENDING_TRANSACTIONS: 'fetchPendingWalletTransactions',
};

const verifyWalletDisburse = async () => {
  try {
    const response = await httpClient.get('intentions/totals', {
      params: {
        'q[statusNotIn]': ['completed', 'in_escrow_tenant', 'refunded'],
        noPagination: true,
      },
    });
    return response?.data || {};
  } catch (error) {
    console.error('error', error);
    throw new Error('Something went wrong');
  }
};

const getWalletTransactions = async ({ id, params }) => {
  try {
    const response = await httpClient.get(`tenants/${id}/wallet/transactions`, {
      params: {
        ...params,
        perPage: 6,
        ...(params['q[createdAtLteq]']
          ? {
              'q[createdAtLteq]': endOfDay(
                new Date(params['q[createdAtLteq]'])
              ),
            }
          : {}),
      },
    });

    return response?.data?.transactions || [];
  } catch (error) {
    console.error('error', error);
    throw new Error('Something went wrong');
  }
};

const disburseWalletBalance = async ({ id, ...payload }) => {
  try {
    const response = await httpClient.post(
      `tenants/${id}/disburse-wallet-balance`,
      payload
    );

    return response?.data;
  } catch (error) {
    console.log('error', error);
    throw new Error('Something went wrong');
  }
};

export const useDisburseWalletBalance = () => {
  const dispatch = useDispatch();

  return useMutation(disburseWalletBalance, {
    mutationKey: QUERY_KEYS.DISBURSE,
    onSuccess: (_data, variables) => {
      dispatch(
        showAlert({
          color: 'info',
          message: `Created a request to withdraw ${centsToDollar(
            variables?.amountInCents
          )}.`,
        })
      );
    },
    onError: (error) => error,
  });
};

export const useVerifyWalletDisburse = () => {
  return useQuery([QUERY_KEYS.VERIFY], verifyWalletDisburse, {
    enabled: false,
    retry: false,
  });
};

export const useFetchWalletTransactions = ({ enabled, ...query }) => {
  return useQuery(
    [QUERY_KEYS.TRANSACTIONS],
    () =>
      getWalletTransactions({
        ...query,
        params: {
          ...query.params,
          ...{ 'q[statusIn]': ['completed', 'successful'] },
        },
      }),
    {
      retry: false,
      enabled: enabled,
    }
  );
};

export const useFetchPendingTransactions = ({ ...query }) => {
  return useQuery(
    [QUERY_KEYS.PENDING_TRANSACTIONS],
    () =>
      getWalletTransactions({
        ...query,
        params: { 'q[statusIn]': ['draft', 'pending'] },
      }),
    {
      retry: false,
    }
  );
};
