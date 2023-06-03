import { camelizeKeys, decamelizeKeys } from 'humps';
import isEmpty from 'lodash/fp/isEmpty';
import queryString from 'query-string';

import { filterEmptyValues } from '.';

export const toQueryObject = (search = '') => {
  const queryObject = camelizeKeys(
    queryString.parse(search, {
      arrayFormat: 'bracket',
    })
  );
  return Object.keys(queryObject).reduce(
    // Filter out empty values
    (result, key) => ({
      ...result,
      ...(queryObject[key] && { [key]: queryObject[key] }),
    }),
    {}
  );
};

export const toQueryString = (params = {}) => {
  const filteredParams = filterEmptyValues(params);
  return !isEmpty(filteredParams)
    ? `?${queryString.stringify(decamelizeKeys(filteredParams), {
        arrayFormat: 'bracket',
      })}`
    : '';
};

export const replaceSearchParams = ({
  params = {},
  pathname = '',
  search = '',
}) => {
  const queryObject = toQueryObject(search);
  const filteredQueryString =
    params || Object.keys(queryObject).length > 0
      ? toQueryString({ ...queryObject, ...params })
      : '';

  return `${pathname}${filteredQueryString}`;
};
