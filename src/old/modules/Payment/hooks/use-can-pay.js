import snakeCase from 'lodash/fp/snakeCase';
import { useMemo } from 'react';

import { USER_TYPES } from '../../../redux/users';
import { useRolesContext } from '../../Profile';

/**
 * Hook that returns whether or not current logged in user can pay a given intention
 *
 * @param {Object} intention
 * @returns {boolean} canPay
 */
export const useCanPay = (intention) => {
  const roles = useRolesContext();

  return useMemo(() => {
    // when an intention is already in processing status
    if (intention.isProcessing) {
      return false;
    }

    switch (snakeCase(intention.debtor)) {
      case 'agency':
        return roles.isCorporateUser || roles.isManager;

      case USER_TYPES.externalCreditor:
        return roles.isExternalCreditor;

      case USER_TYPES.owner:
        return roles.isOwner || roles.isCorporateUser || roles.isManager;

      case USER_TYPES.tenant:
        return (
          roles.isCorporateUser ||
          roles.isManager ||
          roles.isPrincipal ||
          roles.isTenant
        );

      default:
        return false;
    }
  }, [intention.debtor, intention.isProcessing, roles]);
};
