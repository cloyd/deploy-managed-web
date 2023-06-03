import { useEffect, useState } from 'react';

import { FILTER_PERIODS } from '../../../redux/report/constants';

/**
 * Hook that wraps state for date period filters
 *
 * @param {string} period param based on FILTER_PERIODS
 * @param {string} startsAt optional param for start date
 * @param {string} endsAt optional param for end date
 *
 * @returns {Date} startsAt
 * @returns {Date} endsAt
 */
export const useDateFilter = ({ period, startsAt, endsAt }) => {
  const [state, setState] = useState({
    startsAt: undefined,
    endsAt: undefined,
  });

  useEffect(() => {
    if (period === 'custom') {
      setState({
        startsAt: new Date(startsAt || null),
        endsAt: new Date(endsAt || null),
      });
    } else if (FILTER_PERIODS[period]) {
      setState({
        startsAt: FILTER_PERIODS[period][0] || new Date(),
        endsAt: FILTER_PERIODS[period][1] || new Date(),
      });
    } else {
      setState({ startsAt: undefined, endsAt: undefined });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [period]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return state;
};
