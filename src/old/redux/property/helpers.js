const isStatus = (status) => (p) => p.status === status;

export const isActive = isStatus('active');
export const isCancelled = isStatus('cancelled');
export const isDraft = isStatus('draft');
export const isPendingActivate = isStatus('pending_activate');
export const isPendingClearance = isStatus('pending_clearance');

export const propertyAddressString = ({ street, suburb }) =>
  `${street}, ${suburb}`;
