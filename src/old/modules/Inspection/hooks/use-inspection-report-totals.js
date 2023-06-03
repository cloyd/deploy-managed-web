import { useMemo } from 'react';

import { INSPECTION_STATUS } from '../../../redux/inspection';

/**
 * Hook that sums up a report's total checked/agreed/disagreed items
 *
 * @param {*} report inspection report
 * @param {*} areas list of the report's areas
 *
 * @returns {number} remaining
 * @returns {number} reviewed
 * @returns {number} total
 */
export const useInspectionReportTotals = (report = {}, areas = []) =>
  useMemo(() => {
    const totals = {
      remaining: 0,
      reviewed: 0,
      total: 0,
    };

    if (report.status === INSPECTION_STATUS.PENDING_AGENCY) {
      // Sums manager's checked items for list of areas
      areas.forEach((area) => {
        if (area.itemsCount) {
          totals.reviewed += area.itemsCount.overallChecked;
          totals.total += area.itemsCount.total + 1;
        }
      });
    } else if (report.status === INSPECTION_STATUS.PENDING_TENANT) {
      // Sums tenant's agreed/disagreed items for list of areas
      areas.forEach((area) => {
        if (area.itemsCount) {
          totals.reviewed +=
            area.itemsCount.overallAgreed + area.itemsCount.overallDisagreed;
          totals.total += area.itemsCount.total;
        }
      });
    }

    totals.remaining = totals.total - totals.reviewed;

    return totals;
  }, [areas, report.status]);
