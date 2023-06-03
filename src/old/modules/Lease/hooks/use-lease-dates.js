import { useMemo } from 'react';

import { daysBetween, formatDate, isInFuture } from '../../../utils';

export const useLeaseDates = (lease = {}) => {
  const dates = useMemo(
    () => ({
      end: formatDate(lease.endDate),
      inspection: formatDate(lease.inspectionDate),
      leaseStart: formatDate(lease.leaseStartDate),
      review: formatDate(lease.reviewDate),
      start: formatDate(lease.startDate),
      daysToEnd: daysBetween(new Date(lease.endDate)) + 1,
      daysInLease:
        daysBetween(new Date(lease.endDate), new Date(lease.leaseStartDate)) +
        1,
      daysToStart: isInFuture(new Date(lease.leaseStartDate))
        ? daysBetween(new Date(lease.leaseStartDate))
        : 0,
    }),
    [lease]
  );

  const leaseTermString = useMemo(
    () =>
      dates.daysToStart > 0
        ? `(starts in ${dates.daysToStart} days, lasts ${dates.daysInLease} days)`
        : dates.daysToEnd === 1
        ? `(ends today)`
        : dates.daysToEnd === 2
        ? `(ends tomorrow)`
        : dates.daysToEnd > 2
        ? `(ends in ${dates.daysToEnd} days)`
        : null,
    [dates.daysInLease, dates.daysToEnd, dates.daysToStart]
  );

  return [dates, leaseTermString];
};
