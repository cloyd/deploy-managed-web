import { useEffect } from 'react';

export const useFetchInterval = ({ isFetch, fetchAction, interval = 3000 }) => {
  return useEffect(() => {
    let fetchInterval;

    if (isFetch) {
      fetchInterval = setInterval(() => {
        if (isFetch) {
          fetchAction();
        }
      }, interval);

      return () => {
        if (fetchInterval) {
          clearInterval(fetchInterval);
        }
      };
    }
  }, [fetchAction, interval, isFetch]);
};
