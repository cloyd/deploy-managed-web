import { useMemo } from 'react';

const paymentStatus = (frontendStatus) => {
  switch (frontendStatus) {
    case 'AWAITING_PAYMENT':
      return {
        text: 'Awaiting Payment',
        color: 'light',
      };
    case 'PROCESSING':
      return {
        text: 'Processing',
        color: 'primary',
      };
    case 'PAID':
      return { text: 'Paid', color: 'success' };
    case 'REFUNDED':
      return { text: 'Refunded', color: 'warning' };
    case 'DEPOSITED':
      return {
        text: 'Deposit Taken',
        color: 'warning',
        style: 'text-white',
      };
    default:
      return {};
  }
};

export const useTaskIsState = ({ frontendStatus, status }) => {
  return useMemo(
    () => ({
      isInvoiced: ['invoiced', 'completed'].includes(status),
      paymentStatus: paymentStatus(frontendStatus),
    }),
    [frontendStatus, status]
  );
};
