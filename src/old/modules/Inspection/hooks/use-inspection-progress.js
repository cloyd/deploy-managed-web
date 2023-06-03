import { useMemo } from 'react';

/**
 * Inspection report checked/agreed progress
 * This takes into account Area overall and Area items
 *
 * @param {boolean} isPendingAgency
 * @param {boolean} isPendingTenant
 * @param {Object} itemsCount area.itemsCount
 */
export const useInspectionProgress = ({
  isPendingAgency,
  isPendingTenant,
  itemsCount,
}) =>
  useMemo(() => {
    const {
      overallAgreed = 0,
      overallChecked = 0,
      overallDisagreed = 0,
      total = 0, // Total not including area overall
    } = itemsCount || {};

    if (overallChecked && isPendingAgency) {
      return (overallChecked / (total + 1)) * 100;
    } else if ((overallAgreed || overallDisagreed) && isPendingTenant) {
      return ((overallAgreed + overallDisagreed) / total) * 100;
    } else {
      return 0;
    }
  }, [isPendingAgency, isPendingTenant, itemsCount]);
