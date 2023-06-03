import { useEffect, useState } from 'react';

import { useIsChanged } from '../../../hooks';
import { isSameKey } from '../../../utils';

export const useTaskBpayAlert = ({ debtorKey, debtorList }) => {
  const [showAlert, setShowAlert] = useState(false);
  const debtorListChanged = useIsChanged(debtorList);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const debtor = debtorList.find(isSameKey(debtorKey));
    debtor &&
      setShowAlert(
        !debtor.isDefaultMtechAccountSet && debtor.type !== 'Tenant'
      );
  }, [debtorKey, debtorListChanged]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return showAlert;
};
