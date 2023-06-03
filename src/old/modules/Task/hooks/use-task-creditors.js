import uniqBy from 'lodash/fp/uniqBy';
import { useEffect, useState } from 'react';

import { isNotSameKey } from '../../../utils';

export const useTaskCreditors = ({
  creditorList,
  creditorSearchList,
  debtorKey,
  debtorList,
}) => {
  const [creditors, setCreditors] = useState([]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (debtorKey) {
      // Remove the debtor from the list and filter by unique values
      const filteredCreditorList = uniqBy(
        'value',
        creditorList.concat(creditorSearchList).filter(isNotSameKey(debtorKey))
      );

      setCreditors(filteredCreditorList);
    }
  }, [creditorList, creditorSearchList, debtorKey, debtorList]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return creditors;
};
