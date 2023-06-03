import { useMemo } from 'react';

import { percentageOfAmountInCents } from '../../../utils';

/**
 * Hook that calculates fees for a given job
 *
 * @param {Object} job used to calculate whether or not admin fees are to be applied
 * @param {Object} quote used to determine if quote is a work order
 * @param {number} quoteAmount tradie's quote bid amount
 * @param {Object} tradieUser used to determine adminFeeCents and percentageMarketplaceFee
 *
 * @returns {number} adminFee
 * @returns {number} agencyFee - aka service fee
 * @returns {number} marketplaceFee - Managed Marketplace fee
 */
export const useQuoteTradieFee = ({
  job = {},
  quote = {},
  quoteAmount = 0,
  tradieUser = {},
}) =>
  useMemo(() => {
    let adminFee = 0;
    let agencyFee = 0;
    let marketplaceFee = 0;

    if (quoteAmount > 0) {
      if (job?.adminFeeCents) {
        // Show admin fee if agency has not exempted admin fees for this tradie
        adminFee = job?.adminFeeCents || 0;
      }

      if (quote?.requester?.id) {
        // Show agency fee if agency requested quote from tradie
        agencyFee = percentageOfAmountInCents(
          quoteAmount,
          job?.percentageAgencyFee || 0
        );
      } else {
        // Show marketplace fee if tradie found job on the marketplace
        marketplaceFee = percentageOfAmountInCents(
          quoteAmount,
          tradieUser?.percentageMarketplaceFee || 0
        );
      }
    }

    return { adminFee, agencyFee, marketplaceFee };
  }, [job, quote, quoteAmount, tradieUser]);
