import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { showAlert } from '../../../redux/notifier';
import { httpClient } from '../../../utils';

export const QUERY_KEYS = {
  FETCH_ACCOUNTS: 'fetchAccounts',
  SET_DISBURSEMENT: 'setDisbursment',
  SET_DEFAULT_PAYMENT: 'setDefaultPayment',
  GENERATE_BANK_TOKEN: 'generateBankToken',
  GENERATE_CARD_TOKEN: 'generateCardToken',
  ADD_BANK_ACCOUNT: 'addBankAccount',
  ADD_CREDIT_CARD: 'addCreditCard',
  REMOVE_ACCOUNT: 'removeAccount',
  ENABLE_DISBURSEMENT: 'enableDisbursement',
};

const fetchAccounts = async () => {
  try {
    const response = await httpClient.get('assembly/list-accounts');

    return response?.data || {};
  } catch (error) {
    console.error('error: ', error);
    throw new Error('Something went wrong');
  }
};

const setDisbursementAccount = async ({ callback, ...payload }) => {
  try {
    const response = await httpClient.post(
      'assembly/set-disbursement-account',
      payload
    );

    return { data: response?.data, callback };
  } catch (error) {
    console.log('error', error);
    throw new Error('Something went wrong');
  }
};

const setDefaultPayment = async ({ callback, ...payload }) => {
  try {
    const response = await httpClient.post('assembly/set-default', payload);

    return { data: response?.data, callback };
  } catch (error) {
    console.log('error', error);
    throw new Error('Something went wrong');
  }
};

const createTokenCard = async (params) => {
  try {
    const response = await httpClient.get('assembly/generate-token/card', {
      params,
    });

    return response?.data;
  } catch (error) {
    console.error('error', error);
    throw new Error('Something went wrong');
  }
};

const createTokenBank = async (params) => {
  try {
    const response = await httpClient.get('assembly/generate-token/bank', {
      params,
    });

    return response?.data;
  } catch (error) {
    console.error('error', error);
    throw new Error('Something went wrong');
  }
};

const addBankAccount = async ({ callback, ...payload }) => {
  try {
    const response = await httpClient.post(
      'assembly/add-bank-account',
      payload
    );

    return {
      data: response?.data,
      callback,
    };
  } catch (error) {
    console.error('error', error);
    throw new Error('Something went wrong');
  }
};

/**
 * enableDisbursement
 *
 * @param {Object} params
 * @param {number} params.amountCents
 * @param {string} params.fingerprint
 * @param {string} params.promisepayId
 * @return {*}
 */
const enableDisbursement = async (params) => {
  try {
    const response = await httpClient.post(
      'assembly/add-promisepay-dda',
      params
    );

    return {
      data: response?.data,
    };
  } catch (error) {
    console.error('error', error);
    throw new Error('Something went wrong');
  }
};

const addCreditCard = async ({ callback, ...payload }) => {
  try {
    const response = await httpClient.post('assembly/add-credit-card', payload);

    return {
      data: response?.data,
      callback,
    };
  } catch (error) {
    console.error('error', error);
    throw new Error('Something went wrong');
  }
};

const removeAccount = async ({ type, promisepayId, ...params }) => {
  try {
    const response = await httpClient.delete(
      `assembly/account/${promisepayId}`,
      {
        params,
      }
    );

    return response?.data;
  } catch (error) {
    console.error('error', error);
    throw new Error('Something went wrong');
  }
};

export const useFetchAccounts = () => {
  return useQuery([QUERY_KEYS.FETCH_ACCOUNTS], fetchAccounts, {
    retry: false,
    staleTime: 180000,
    refetchOnMount: 'always',
  });
};

export const useSetDisbursementAccount = () => {
  const dispatch = useDispatch();

  return useMutation(setDisbursementAccount, {
    mutationKey: QUERY_KEYS.SET_DISBURSEMENT,
    onSuccess: async ({ data, callback }) => {
      if (callback) {
        callback();
      }

      dispatch(
        showAlert({
          color: 'success',
          message: 'Successfully set account for withdrawals',
        })
      );

      return data;
    },
  });
};

export const useSetDefaultPaymentAccount = () => {
  const dispatch = useDispatch();

  return useMutation(setDefaultPayment, {
    mutationKey: QUERY_KEYS.SET_DEFAULT_PAYMENT,
    onSuccess: async ({ data, callback }) => {
      if (callback) {
        callback();
      }

      dispatch(
        showAlert({
          color: 'success',
          message: 'Successfully set account for rent and bill payments',
        })
      );

      return data;
    },
  });
};

export const useCreateTokenCard = (query) => {
  return useQuery(
    [QUERY_KEYS.GENERATE_BANK_TOKEN],
    () => createTokenCard(query),
    {
      retry: false,
      enabled: false,
    }
  );
};

export const useCreateTokenBank = (query) => {
  return useQuery(
    [QUERY_KEYS.GENERATE_BANK_TOKEN],
    () => createTokenBank(query),
    {
      retry: false,
      enabled: false,
    }
  );
};

export const useAddBankAccount = () => {
  const dispatch = useDispatch();

  return useMutation(addBankAccount, {
    mutationKey: QUERY_KEYS.ADD_BANK_ACCOUNT,
    onSuccess: ({ data, callback }) => {
      if (callback) {
        callback();
      }

      dispatch(
        showAlert({
          color: 'success',
          message: 'Bank Account added',
        })
      );

      return data;
    },
  });
};

export const useAddCreditCard = () => {
  const dispatch = useDispatch();

  return useMutation(addCreditCard, {
    mutationKey: QUERY_KEYS.ADD_CREDIT_CARD,
    onSuccess: ({ data, callback }) => {
      if (callback) {
        callback();
      }

      dispatch(
        showAlert({
          color: 'success',
          message: 'Credit Card added',
        })
      );

      return data;
    },
  });
};

export const useRemoveAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(removeAccount, {
    mutationKey: QUERY_KEYS.REMOVE_ACCOUNT,
    onMutate: async ({ promisepayId: toDelete, type }) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.FETCH_ACCOUNTS],
      });

      queryClient.setQueryData([QUERY_KEYS.FETCH_ACCOUNTS], (old) => {
        const data = type === 'bank' ? old.bank : old.card;
        const updatedData = data.map(({ promisepayId, ...rest }) => {
          return {
            ...rest,
            promisepayId,
            ...(promisepayId === toDelete && { isDeleting: true }),
          };
        });

        return { ...old, [type]: updatedData };
      });
    },
  });
};

// add-promisepay-dda
export const useEnableDisbursement = () => {
  return useMutation(enableDisbursement, {
    mutationKey: QUERY_KEYS.ENABLE_DISBURSEMENT,
  });
};
