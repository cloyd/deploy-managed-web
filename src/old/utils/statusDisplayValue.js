export const statusDisplayValue = (status) => {
  if (status === 'expired') {
    return 'Past';
  } else if (status === 'draft') {
    return 'Vacant';
  } else if (status === 'active') {
    return 'Leased';
  } else {
    return status;
  }
};
