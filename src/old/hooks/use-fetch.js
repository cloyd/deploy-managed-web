import { useEffect, useState } from 'react';

import { httpClient } from '../utils';

// Returns [data, error]
export const useFetch = (endpoint, params, key) => {
  const [response, setResponse] = useState([undefined, false]);

  useEffect(() => {
    let isFetching = false;

    async function fetchData() {
      if (isFetching) return;

      isFetching = true;

      try {
        const response = await httpClient.get(endpoint, { params });

        if (response.status === 200) {
          setResponse([response.data, false]);
        } else {
          setResponse([response, true]);
        }
      } catch (error) {
        setResponse([error, true]);
      }

      isFetching = false;
    }

    if (endpoint) {
      fetchData();
    }
  }, [endpoint, params, key]);

  return response;
};
