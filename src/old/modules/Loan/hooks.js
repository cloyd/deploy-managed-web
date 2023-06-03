import addMonths from 'date-fns/addMonths';
import { useCallback, useMemo } from 'react';

import { useFetch } from '../../hooks';
import { httpClient, roundTo } from '../../utils';

function getLoansEndpoint(property, loan, key) {
  if (!property) return;

  let endpoint = `properties/${property.id}/loans`;

  if (loan) {
    endpoint += `/${loan.id}`;

    if (key) {
      endpoint += `/${key}`;
    }
  }

  return endpoint;
}

function getMonths(duration = 12) {
  return [...Array(duration).keys()].map((i) => {
    return addMonths(new Date(), i);
  });
}

function getInstalmentStatuses(instalment) {
  const { intentionStatus, status } = instalment;

  return {
    isDue: intentionStatus === 'draft' && status === 'draft',
    isPaid: intentionStatus === 'completed' || status === 'completed',
    isProcessing: /pending/.test(intentionStatus),
    isFailure: /failed/.test(intentionStatus) || /failed/.test(status),
  };
}

export function useGraphInstalments(instalments, loan) {
  return useMemo(() => {
    if (!instalments || !loan) {
      return [];
    }

    let loanAmountCents = loan.amountCents;

    return instalments
      .filter((instalment) => {
        const { isFailure } = getInstalmentStatuses(instalment);
        return !isFailure;
      })
      .map((instalment) => {
        const amountCents = loanAmountCents;
        loanAmountCents = loanAmountCents - instalment.amountCents;

        return {
          ...instalment,
          amountCents,
        };
      });
  }, [instalments, loan]);
}

export function useInstalmentStatuses(instalment) {
  return useMemo(() => getInstalmentStatuses(instalment), [instalment]);
}

export function useInstalmentsCalculator(loanAmount, interestRate, duration) {
  const monthly = useMemo(() => {
    const ratePerMonth = interestRate / 12;
    const multiplier = roundTo(Math.pow(1 + ratePerMonth, duration), 10);
    return (loanAmount * ratePerMonth * multiplier) / (-1 + multiplier);
  }, [loanAmount, interestRate, duration]);

  const total = useMemo(() => {
    return monthly * duration;
  }, [monthly, duration]);

  const instalments = useMemo(() => {
    return getMonths(duration).map((dueDate, i) => {
      return {
        dueDate,
        amountCents: (total - monthly * i) * 100,
      };
    });
  }, [duration, monthly, total]);

  return {
    instalments,
    repayments: {
      monthly: roundTo(monthly, 2),
      total: roundTo(total, 2),
    },
  };
}

export function useLoanInstalments(property, loan) {
  const endpoint = useMemo(() => {
    if (property && loan) {
      return getLoansEndpoint(property, loan, 'instalments');
    }
  }, [property, loan]);

  return useFetch(endpoint);
}

export function useLoanProviders() {
  return useFetch('loan_providers');
}

export function useLoans(property, key) {
  return useFetch(getLoansEndpoint(property), null, key);
}

export function useLoansEndpoint(property, loan, key) {
  return useMemo(() => {
    return getLoansEndpoint(property, loan, key);
  }, [property, loan, key]);
}

export function useLoansWalletBalanceCents(loans) {
  return useMemo(() => {
    if (loans?.length > 0) {
      return loans
        .filter((loan) => loan.status === 'active')
        .reduce((sum, loan) => sum + loan.walletBalanceCents, 0);
    }

    return 0;
  }, [loans]);
}

export function useLoansHasPending(loans) {
  return useMemo(() => {
    if (loans?.length) {
      return loans.some((loan) => loan.status === 'pending');
    }

    return false;
  }, [loans]);
}

export function useLoanTransfer(endpoint, onComplete) {
  return useCallback(async () => {
    const response = await httpClient.post(endpoint);
    onComplete(response.status === 204);
  }, [endpoint, onComplete]);
}
