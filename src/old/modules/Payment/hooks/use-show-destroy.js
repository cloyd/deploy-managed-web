import { useMemo } from 'react';

export const useShowDestroy = ({ account, onDestroy }) =>
  useMemo(() => {
    const { isDefault, isDisbursement, isMtechDefault, isInUse } = account;

    return (
      !!onDestroy &&
      !isDefault &&
      !isDisbursement &&
      !isMtechDefault &&
      !isInUse
    );
  }, [account, onDestroy]);
