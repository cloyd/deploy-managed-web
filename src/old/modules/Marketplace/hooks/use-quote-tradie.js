import { useMemo } from 'react';

export const useQuoteTradie = (id, quotes) => {
  return useMemo(() => {
    const quote = quotes?.find((quote) => {
      if (quote.tradie) {
        return quote.tradie.id === id;
      }

      return false;
    });

    return quote || {};
  }, [id, quotes]);
};
