import kebabCase from 'lodash/fp/kebabCase';
import snakeCase from 'lodash/fp/snakeCase';
import { plural } from 'pluralize';

import { USER_TYPES } from './constants';

/**
 * Returns input type as an endpoint type, e.g. external_creditor to external-creditors
 */
export const getEndpointType = (type) => kebabCase(plural(type || ''));

/**
 * Returns object of ransack params by user role
 */
export const getRansackParamsByUserType = (
  type,
  search,
  initialParams = {}
) => {
  const params = { ...initialParams };

  if (type && search) {
    const ransackParams = getUsersRansackParams(type);

    Object.keys(ransackParams).map((key) => {
      params[`q[${key}_${ransackParams[key]}]`] = search;
    });
  }

  return params;
};

/**
 * The fields that different user types can be searched against
 */
const getUsersRansackParams = (type) => {
  const parsedType = snakeCase(type);
  let ransackParams = {};

  switch (parsedType) {
    case USER_TYPES.externalCreditor:
      ransackParams = {
        any_name_email_phone: 'cont',
        type_of: 'in',
      };
      break;

    case USER_TYPES.manager:
    case USER_TYPES.owner:
    case USER_TYPES.tenant:
      ransackParams = {
        user_full_name_or_user_email_or_user_phone_number: 'cont',
      };
      break;

    case USER_TYPES.bpayBiller:
      ransackParams = { name: 'cont' };
      break;
  }

  return ransackParams;
};
