import mapValues from 'lodash/fp/mapValues';

import {
  centsToDollar,
  formatDate,
  isInPast,
  toYearAmountsCents,
} from '../../utils';

export const decorateLease = (lease) => {
  const {
    annualRentCents,
    bondCents,
    depositCents,
    inspectionDateFrequencyInMonths,
    payFrequencyIsLocked,
    reviewDateFrequencyInMonths,
    status,
    tenant,
    terminationDate,
  } = lease;

  const hasBond = bondCents > 0;
  const hasDeposit = depositCents > 0;
  const hasTenant = tenant !== null;
  const isActivating = status === 'activating';
  const isActive = status === 'active';
  const isCancelled = status === 'cancelled';
  const isDraft = status === 'draft';
  const isExpired = status === 'expired';
  const isPendingActivate = status === 'pending_activate';
  const isPendingClearance = status === 'pending_clearance';
  const isPending = isPendingActivate || isPendingClearance;
  const isTerminating = terminationDate !== null;
  const isTerminated = isTerminating && isInPast(terminationDate);
  const amountCents = toYearAmountsCents(annualRentCents);
  const amountDollars = mapValues(centsToDollar, amountCents);

  return {
    ...lease,
    amountCents,
    amountDollars,
    canRefund: isPendingActivate && hasDeposit,
    canActivate: isPendingActivate && hasTenant,
    canCancel: !isActive && !isExpired && hasTenant,
    canAdjustFrequency: !payFrequencyIsLocked,
    canAdjustRent: isActive && !isTerminating,
    hasBond,
    hasDeposit,
    hasTenant,
    inspectionDateFrequency: inspectionDateFrequencyInMonths,
    isActivating,
    isActive,
    isCancelled,
    isDraft,
    isExpired,
    isPending,
    isPendingActivate,
    isPendingClearance,
    isTerminated,
    isTerminating,
    reviewDateFrequency: reviewDateFrequencyInMonths,
  };
};

export const decorateModification = (modification) => {
  const { annualRentCents, effectiveDate } = modification;

  const amountCents = toYearAmountsCents(annualRentCents);
  const amountDollars = mapValues(centsToDollar, amountCents);

  return {
    ...modification,
    amountCents,
    amountDollars,
    effectiveDateFormatted: formatDate(effectiveDate),
  };
};

export const decorateModifications = (modifications) => {
  return modifications.map(decorateModification);
};
