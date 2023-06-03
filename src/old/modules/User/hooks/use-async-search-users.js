import { useCallback, useState } from 'react';

import { decorateTaskCreditorData } from '../../../redux/task';
import {
  getEndpointType,
  getRansackParamsByUserType,
} from '../../../redux/users';
import { httpClient } from '../../../utils';

/**
 * Async search for users endpoints, e.g. /api/external-creditors
 * Use this when bypassing the redux store - for instance with search filters
 *
 * @param {*} type - endpoint type
 */
export const useAsyncSearchUsers = (type) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleSearchUsers = useCallback(
    (search, initialParams = {}) => {
      async function fetchItems() {
        const params = getRansackParamsByUserType(type, search, initialParams);
        const endpoint = getEndpointType(type);
        const response = await httpClient.get(endpoint, { params: params });
        if (response.status === 200) {
          setData(
            type === 'agency'
              ? response.data.agencies
              : type === 'manager'
              ? response.data
              : decorateTaskCreditorData(response.data)
          );
        }
        setIsLoading(false);
      }

      if (type && !isLoading) {
        setIsLoading(true);
        fetchItems();
      }
    },
    [isLoading, type]
  );

  return [handleSearchUsers, { data, isLoading, setData }];
};
