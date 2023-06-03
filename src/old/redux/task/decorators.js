import startCase from 'lodash/fp/startCase';

import { centsToDollar, formatDate, fullName, joinKey } from '../../utils';
import { INTENTION_STATUSES, PARTY_TYPES } from './constants';

const decorateArrearDescription = (arrears) => {
  const startDate = formatDate(arrears.startDate, 'shortWithYear');
  const endDate = formatDate(arrears.endDate, 'shortWithYear');

  return `Rent from ${startDate} - ${endDate} for ${centsToDollar(
    arrears.amount
  )}`;
};

export const decorateTask = (task) => {
  const isArrear = task?.taskType?.key === 'arrear';

  // Intention values
  const invoice = task.invoice ? task.invoice : null;
  const isIntentionComplete =
    invoice && invoice.intentionStatus === 'completed';
  const isIntentionDraft = invoice && invoice.intentionStatus === 'draft';
  const isIntentionFailed =
    isIntentionDraft && !!invoice.intentionSupersedingReason;
  const isIntentionPending = invoice && /pending/.test(invoice.intentionStatus);

  // Arrears values
  const description =
    isArrear && task.arrears
      ? decorateArrearDescription(task.arrears)
      : task.description;

  return {
    ...task,
    description,
    isArrear,
    isIntentionComplete,
    isIntentionDraft,
    isIntentionFailed,
    isIntentionPending,
    creatorName: task.creatorName || 'System',
    creatorType: task.creatorType || 'manager',
    isBill: task?.taskType?.key === 'bill',
    isBillable: !!invoice && !!invoice.creditorId && !!invoice.debtorId,
    isIntentionTriggered: invoice && invoice.isIntentionTriggered,
    isMaintenance: task?.taskType?.key === 'maintenance',
    isImprovement: task?.taskType?.key === 'improvement',
    isAdvertising: task?.taskType?.key === 'advertising',
    intentionStatus: isIntentionComplete
      ? INTENTION_STATUSES.complete
      : isIntentionFailed
      ? INTENTION_STATUSES.failed
      : isIntentionPending
      ? INTENTION_STATUSES.processing
      : {},
  };
};

// If creditor has company name, format label as
// <company name> - <first name> <last name>
export const decorateTaskCreditorData = (data) => {
  return data.map((value) => {
    let formattedLabel = `${value.name} - ${
      value.primaryContactEmail || value.primaryContactMobile
    }`;

    if (value.promisepayUserPromisepayCompanyLegalName) {
      formattedLabel = `${value.promisepayUserPromisepayCompanyLegalName} - ${value.name}`;
    } else if (value.email) {
      formattedLabel = `${value.email} - ${value.firstName} ${value.lastName}`;
    }

    return {
      ...value,
      label: formattedLabel,
    };
  });
};

export const decorateTaskParty = (user, partyType) => {
  const {
    billerCode,
    bpayBillerCode,
    bpayOutProvider,
    gstIncluded,
    id,
    isDefaultMtechAccountSet,
    isDefaultPaymentAccountSet,
    isDisbursementAccountSet,
  } = user;

  const { type, label } =
    PARTY_TYPES.find(({ type }) => type === partyType) || {};

  const name = user.name || user.tradingName || fullName(user);
  const nameLabel = partyType === 'ExternalCreditor' ? name : startCase(name);
  const typeLabel = bpayOutProvider ? '' : `(${label})`;

  return {
    billerCode,
    gstIncluded,
    id,
    isDefaultMtechAccountSet,
    isDefaultPaymentAccountSet,
    isDisbursementAccountSet,
    name,
    type,
    typeOf: user.typeOf || label || type,
    isBpaySet: !!bpayBillerCode,
    isBpayOutProvider: user.bpayOutProvider,
    label: `${nameLabel} ${typeLabel}`,
    value: joinKey(id, type),
  };
};
