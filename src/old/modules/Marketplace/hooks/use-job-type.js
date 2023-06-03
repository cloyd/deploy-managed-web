import { useMemo } from 'react';

export const useJobType = (job) => {
  return useMemo(() => {
    if (job.hasWorkOrder) {
      return 'work order';
    } else {
      return 'quote';
    }
  }, [job]);
};
