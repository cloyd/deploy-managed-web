export const JOB_TYPE = Object.freeze({
  quote: 'quote',
  workOrder: 'work_order',
});

export const JOB_TYPES = [JOB_TYPE.quote, JOB_TYPE.workOrder];

export const QUOTE_STATUSES = Object.freeze({
  quoting: 'quoting',
  awaitingAcceptance: 'awaiting_acceptance',
  awaitingApproval: 'awaiting_approval',
  accepted: 'accepted',
  sendingInvoice: 'sending_invoice',
  invoiced: 'invoiced',
  awaitingPayment: 'awaiting_payment',
  paid: 'paid',
  declined: 'declined',
  canceled: 'canceled',
});

export const QUOTE_ACCEPTED_STATUSES = Object.freeze([
  QUOTE_STATUSES.accepted,
  QUOTE_STATUSES.sendingInvoice,
  QUOTE_STATUSES.invoiced,
  QUOTE_STATUSES.awaitingPayment,
  QUOTE_STATUSES.paid,
]);

export const QUOTE_PENDING_STATUSES = Object.freeze([
  QUOTE_STATUSES.quoting,
  QUOTE_STATUSES.awaitingAcceptance,
  QUOTE_STATUSES.awaitingApproval,
]);

export const MY_QUOTE_ACCEPTED_STATUSES = Object.freeze([
  QUOTE_STATUSES.accepted,
  QUOTE_STATUSES.sendingInvoice,
  QUOTE_STATUSES.invoiced,
  QUOTE_STATUSES.awaitingPayment,
]);

export const MY_QUOTE_COMPLETED_STATUSES = Object.freeze([
  QUOTE_STATUSES.declined,
  QUOTE_STATUSES.canceled,
  QUOTE_STATUSES.paid,
]);

export const MY_QUOTE_PENDING_STATUSES = Object.freeze([
  QUOTE_STATUSES.quoting,
  QUOTE_STATUSES.awaitingAcceptance,
]);
