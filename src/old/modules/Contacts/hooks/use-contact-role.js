import snakeCase from 'lodash/fp/snakeCase';
import { singular } from 'pluralize';
import { useMemo } from 'react';

import { USER_TYPES } from '../../../redux/users';

export const useContactRole = (type = '') =>
  useMemo(
    () => ({
      isBpay: type === USER_TYPES.bpayBiller,
      isCreditor: type === USER_TYPES.externalCreditor,
      isManager: type === USER_TYPES.manager,
      isOwner: type === USER_TYPES.owner,
      isTenant: type === USER_TYPES.tenant,
    }),
    [type]
  );

/**
 * Formats match.params.type to USER_TYPES
 */
export const formatUserTypeParam = (type = '') =>
  type === 'creditors'
    ? USER_TYPES.externalCreditor
    : snakeCase(singular(type || ''));
