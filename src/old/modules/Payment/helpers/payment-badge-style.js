export const paymentBadgeStyle = (status) => {
  if (status === 'refunded') {
    return { text: 'Refunded', color: 'warning' };
  } else if (/pending/.test(status)) {
    return { text: 'Processing', color: 'link text-muted font-weight-normal' };
  } else {
    return { text: 'Paid', color: 'success' };
  }
};
