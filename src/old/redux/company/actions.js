import camelCase from 'lodash/fp/camelCase';
import upperFirst from 'lodash/fp/upperFirst';

import { FETCH, UPDATE } from './constants';

// Ensure ownerType is in the correct format for the API.
const formatParams = (params) => {
  return {
    ...params,
    ownerType: upperFirst(camelCase(params.ownerType)),
  };
};

export const fetchCompany = (params) => {
  return {
    type: FETCH,
    payload: {
      params: formatParams(params),
    },
  };
};

export const updateCompany = (params) => {
  return {
    type: UPDATE,
    payload: {
      params: formatParams(params),
    },
  };
};
