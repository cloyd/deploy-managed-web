import orderBy from 'lodash/orderBy';

import { centsToDollar, formatDate, pluralize } from '../../utils';
import { PAYMENT_COMPLETE_STATUSES, PAYMENT_METHODS } from './constants';

// API statuses
// draft
// completed
// pending_tenant
// pending_agency
// pending_owner
// pending_external_creditor
// failed_tenant
// failed_agency
// failed_owner
// failed_external_creditor
// unrecognised_item_state

export const decorateIntention = (intention, property) => {
  const { debtor, floatAmountCents, lease, paymentMethod, status, type } =
    intention;

  const intentionWithBooleans = {
    ...intention,
    isAdjusted: intention.adjustingItems && intention.adjustingItems.length > 0,
    isAdjustable: status === 'draft' && type === 'rent',
    isBpay: paymentMethod === 'bpay',
    isCC: paymentMethod === 'cc',
    isComplete: status === 'completed',
    isExpiredLease: lease && lease.status === 'expired',
    isRefund: status === 'refunded',
    isDD: paymentMethod === 'dd',
    isDeposit: type === 'deposit',
    isDraft: status === 'draft',
    isFailed: /failed/.test(status),
    isPayByPaymentMethod:
      debtor === 'agency' || debtor === 'tenant' || floatAmountCents === 0,
    isPayByWallet: debtor !== 'tenant' && floatAmountCents < 0,
    isPending: /pending/.test(status),
    isSuccess: PAYMENT_COMPLETE_STATUSES.indexOf(status) >= 0,
    isWalletDischarge: type === 'float_discharge' || type === 'loan_discharge',
    isFloatDischarge: type === 'float_discharge',
    isRent: type === 'rent',
    isTask: type === 'task',
  };

  return {
    ...intentionWithBooleans,
    hasBreakdown:
      intentionWithBooleans.isComplete ||
      intentionWithBooleans.isAdjusted ||
      intentionWithBooleans.isRefund,
    formatted: {
      dates: getFormattedDates(intentionWithBooleans),
      debtor: getFormattedDebtor(intentionWithBooleans),
      creditor:
        type === 'float_discharge'
          ? getDisbursementFormattedCreditor(intentionWithBooleans, property)
          : getFormattedCreditor(intentionWithBooleans, property),
    },
    ...(lease && { leaseId: lease.id }),
  };
};

export const getCalculatedTotals = (intention) => {
  const amountCents = Math.abs(intention.amountCents);
  const floatAmountCents = Math.min(intention.floatAmountCents || 0, 0);
  const adjustedAmountCents = amountCents + floatAmountCents;
  const originalAmountCents = Math.abs(intention.originalAmountCents);
  const fees = getDebtorFees(intention, adjustedAmountCents);
  const totalCents = amountCents + fees.amountCents;

  return {
    adjustedAmountCents,
    amountCents,
    fees,
    floatAmountCents,
    originalAmountCents,
    totalCents,
  };
};

export const getDebtorFees = (intention, amount) => {
  const key = intention.isTask ? 'debtorFees' : `${intention.debtor}Fees`;

  // Show debtor fees if present
  const fees = intention[key] || {
    fixed: 0,
    percentage: 0,
    taskBpayOutFixed: 0,
  };

  const percentage = fees.percentage / 100;
  const amountCents =
    amount === 0
      ? 0
      : intention.isPayByWallet
      ? fees.taskBpayOutFixed
      : (amount * percentage) / 100 + fees.fixed;

  return {
    ...fees,
    percentage,
    amountCents,
  };
};

export const getCreditorFees = (intention, amount) => {
  // Show creditor fees if owner is paying rent fees and owner_fees are visible
  // TODO: This to be expanded to all scenarios where we show creditor fees on FE
  const fees =
    intention.isRent && intention['ownerFees']
      ? intention['ownerFees']
      : {
          fixed: 0,
          percentage: 0,
          taskBpayOutFixed: 0,
        };
  const percentage = fees.percentage / 100;
  const amountCents = intention.isPayByWallet
    ? fees.taskBpayOutFixed
    : (amount * percentage) / 100 + fees.fixed;

  return {
    ...fees,
    percentage,
    amountCents,
  };
};

export const getFormattedCreditor = (intention, property) => {
  const {
    agencyAmountCents,
    amountCents,
    floatAmountCents,
    isAdjusted,
    isComplete,
    isRefund,
    originalAmountCents,
    ownerAmountCents,
    type,
  } = intention;

  const fees = getCreditorFees(intention, Math.abs(intention.amountCents));
  const formattedFees = {
    amount: centsToDollar(fees.amountCents, true),
    fixed: centsToDollar(fees.fixed, true),
    percentage: `${fees.percentage}%`,
  };

  const addAgencyFees = type !== 'task';
  const addFloatAmount = floatAmountCents > 0;
  const addOwnerFees = fees.amountCents > 0;

  const lineItems = [];
  let removableIntention = '';

  if (isAdjusted) {
    lineItems.push({
      title: 'Original total',
      amount: centsToDollar(originalAmountCents),
      numerator: null,
    });

    // Add any adjustments
    intention.adjustingItems.map((adjustment) => {
      lineItems.push({
        title: `Credit: ${adjustment.rentAdjustmentReason}`,
        amount: centsToDollar(adjustment.amountCents, true),
        numerator: '-',
      });

      removableIntention = `credit: ${adjustment.rentAdjustmentReason}
       (${centsToDollar(adjustment.amountCents, true)})`;
    });

    lineItems.push({ type: 'divider' });

    lineItems.push({
      title: 'Adjusted total',
      amount: centsToDollar(amountCents),
      numerator: null,
    });
  } else {
    lineItems.push({
      title: 'Invoice total',
      amount: centsToDollar(amountCents),
      numerator: null,
    });

    removableIntention = `invoice (${centsToDollar(amountCents)})`;
  }

  if (isComplete || isRefund) {
    // Add the transaction fee
    addOwnerFees &&
      lineItems.push({
        title: intention.isCC
          ? `Transaction fees (${formattedFees.percentage} + ${formattedFees.fixed})`
          : `Transaction fee (${formattedFees.fixed})`,
        amount: centsToDollar(fees.amountCents),
        numerator: '-',
      });

    addAgencyFees &&
      agencyAmountCents !== 0 &&
      lineItems.push({
        title: 'Agency fees',
        amount: centsToDollar(agencyAmountCents),
        numerator: '-',
      });

    addFloatAmount &&
      floatAmountCents !== 0 &&
      lineItems.push({
        title: 'Paid to wallet',
        amount: centsToDollar(floatAmountCents),
        numerator: '+',
      });

    if (ownerAmountCents - floatAmountCents - fees.amountCents !== 0) {
      if (
        !intention.ownerCreditSplits ||
        intention.ownerCreditSplits.length === 0
      ) {
        lineItems.push({
          title: `Paid to ${pluralize('owner', intention.ownerCreditSplits)}`,
          amount: centsToDollar(
            ownerAmountCents - floatAmountCents - fees.amountCents
          ),
          numerator: '+',
        });
      } else {
        // sort by percentage and remove zeros
        const sortedOwnerCreditSplits = orderBy(
          intention.ownerCreditSplits,
          'percentageSplit',
          'desc'
        ).filter((ownerCreditSplit) => ownerCreditSplit.percentageSplit !== 0);
        if (property !== undefined) {
          sortedOwnerCreditSplits.map((ownerCreditSplit) => {
            lineItems.push({
              title: `Paid to ${getOwnerNamesFromProperty(
                property,
                ownerCreditSplit.ownerId
              )}`,
              amount: centsToDollar(
                (ownerAmountCents - floatAmountCents - fees.amountCents) *
                  (ownerCreditSplit.percentageSplit / 10000)
              ),
              numerator: '+',
            });
          });
        }
      }

      lineItems.push({
        title: 'Payment method',
        amount: PAYMENT_METHODS[intention.paymentMethod],
      });
    }
  }

  return {
    amount: centsToDollar(amountCents),
    total: centsToDollar(ownerAmountCents),
    lineItems,
    removableIntention,
  };
};

export const getDisbursementFormattedCreditor = (intention, property) => {
  const { amountCents, floatAmountCents, ownerAmountCents } = intention;
  const lineItems = [];

  if (floatAmountCents !== 0) {
    if (
      !intention.ownerCreditSplits ||
      intention.ownerCreditSplits.length === 0
    ) {
      lineItems.push({
        title: `Paid to ${pluralize('owner', intention.ownerCreditSplits)}`,
        amount: centsToDollar(floatAmountCents),
        numerator: '+',
      });
    } else {
      // sort by percentage and remove zeros
      const sortedOwnerCreditSplits = orderBy(
        intention.ownerCreditSplits,
        'percentageSplit',
        'desc'
      ).filter((ownerCreditSplit) => ownerCreditSplit.percentageSplit !== 0);

      if (property !== undefined) {
        sortedOwnerCreditSplits.map((ownerCreditSplit) => {
          lineItems.push({
            title: `Paid to ${getOwnerNamesFromProperty(
              property,
              ownerCreditSplit.ownerId
            )}`,
            amount: centsToDollar(
              floatAmountCents * (ownerCreditSplit.percentageSplit / 10000)
            ),
            numerator: '+',
          });
        });
      }
    }
  }

  return {
    amount: centsToDollar(amountCents),
    total: centsToDollar(ownerAmountCents),
    lineItems,
    removableIntention: '',
  };
};

export const getFormattedDates = (intention) => {
  const {
    autoPayDate,
    dueDate,
    endDate,
    isRent,
    payNoLaterThan,
    startDate,
    paidAt,
  } = intention;

  const dueDateCheck = isRent ? payNoLaterThan : dueDate;

  return {
    autoPay: formatDate(autoPayDate, 'shortNoYear'),
    autoPayWithYear: formatDate(autoPayDate, 'shortWithYear'),
    due: formatDate(dueDateCheck, 'shortNoYear'),
    dueWithYear: formatDate(dueDateCheck, 'shortWithYear'),
    end: formatDate(endDate, 'shortNoYear'),
    endWithYear: formatDate(endDate, 'shortWithYear'),
    start: formatDate(startDate, 'shortNoYear'),
    startWithYear: formatDate(startDate, 'shortWithYear'),
    paidAt: formatDate(paidAt, 'short'),
  };
};

export const getFormattedDebtor = (intention) => {
  const { isAdjusted, isComplete, isRefund } = intention;
  const isFinalised = isComplete || isRefund;

  const {
    adjustedAmountCents,
    amountCents,
    fees,
    floatAmountCents,
    originalAmountCents,
    totalCents,
  } = getCalculatedTotals(intention);

  const formatted = {
    amount: centsToDollar(isFinalised ? totalCents : amountCents),
    total: centsToDollar(isFinalised ? amountCents : totalCents),
    totalAmountCents: isFinalised ? amountCents : totalCents,
    walletBalance: centsToDollar(intention.floatBalanceAmountCents),
    fees: {
      amount: centsToDollar(fees.amountCents, true),
      fixed: centsToDollar(fees.fixed, true),
      percentage: `${fees.percentage}%`,
    },
    payBy: {
      method: PAYMENT_METHODS[intention.paymentMethod],
      amount: centsToDollar(amountCents),
      wallet: centsToDollar(floatAmountCents),
    },
  };

  const lineItems = [];

  if (isAdjusted) {
    lineItems.push({
      title: 'Original total',
      amount: centsToDollar(originalAmountCents),
      numerator: null,
    });

    // Add any adjustments
    intention.adjustingItems.map((adjustment) => {
      lineItems.push({
        title: `Credit: ${adjustment.rentAdjustmentReason}`,
        amount: centsToDollar(adjustment.amountCents),
        numerator: '-',
      });
    });

    lineItems.push({ type: 'divider' });

    lineItems.push({
      title: 'Adjusted total',
      amount: formatted.total,
      numerator: null,
    });
  }

  // Add invoice total
  if (isFinalised) {
    amountCents !== adjustedAmountCents &&
      lineItems.push({
        title: 'Invoice total',
        amount: formatted.amount,
        numerator: null,
      });

    // Add amount paid via wallet
    intention.isPayByWallet &&
      lineItems.push({
        title: 'Paid via wallet',
        amount: formatted.payBy.wallet,
        numerator: '-',
      });

    // Add amount paid via paymentMethod
    intention.isPayByPaymentMethod &&
      lineItems.push({
        title: `Paid via ${formatted.payBy.method}`,
        amount: formatted.payBy.amount,
        numerator: '-',
      });

    // Add the transaction fee
    if (fees.amountCents > 0) {
      lineItems.push({
        title: intention.isCC
          ? `Transaction fees (${formatted.fees.percentage} + ${formatted.fees.fixed})`
          : `Transaction fee (${formatted.fees.fixed})`,
        amount: formatted.fees.amount,
        numerator: '-',
      });

      lineItems.push({
        title: `Amount paid`,
        amount: formatted.amount,
        numerator: '-',
      });
    }
  }

  return { ...formatted, lineItems };
};

export const getOwnerNamesFromProperty = (property, ownerId) => {
  const owners = [property.primaryOwner, ...property.secondaryOwners];
  const owner = owners.find((o) => o.id === ownerId);

  return owner ? `${owner.firstName} ${owner.lastName}` : 'Owner';
};
