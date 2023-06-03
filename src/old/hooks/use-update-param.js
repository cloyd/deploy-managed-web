import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { replaceSearchParams } from '../utils';

/**
 * Hook that updates react-router-dom state
 */
export const useUpdateParam = () => {
  const history = useHistory();
  const location = useLocation();

  /**
   * Updates multiple key-value pairs
   * @param {Object} params - ex. { key1: value1, key2: value2 }
   * @param {boolean} isReplace - whether to update via history.replace or history.push
   */
  const updateMultipleParams = useCallback(
    (params, isReplace = false) =>
      isReplace
        ? replaceParams(history, location, params)
        : pushParams(history, location, params),
    [history, location]
  );

  /**
   * Updates a single key-value pair
   * @param {string} key
   * @param {string} value
   * @param {boolean} isReplace - whether to update via history.replace or history.push
   */
  const updateSingleParam = useCallback(
    (key) =>
      (value, isReplace = false) =>
        isReplace
          ? replaceParams(history, location, { [key]: value })
          : pushParams(history, location, { [key]: value }),
    [history, location]
  );

  return {
    updateMultipleParams,
    updateSingleParam,
  };
};

const pushParams = (history, location, params = {}) =>
  history.push(
    replaceSearchParams({
      params,
      pathname: location.pathname,
      search: location.search,
    })
  );

const replaceParams = (history, location, params = {}) =>
  history.replace(
    replaceSearchParams({
      params,
      pathname: location.pathname,
      search: location.search,
    })
  );
