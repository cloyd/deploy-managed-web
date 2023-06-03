import { useCallback, useState } from 'react';

import { httpClient } from '../utils';

/**
 * Async search for postcodes endpoint /api/postcode_geocodes
 */
export const useAsyncPostcodeSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleResetPostcodes = useCallback(() => setData([]), []);

  const handleSearchPostcodes = useCallback(
    (postcode, initialParams = {}) => {
      async function fetchItems() {
        const params = { postcode, ...initialParams };
        const response = await httpClient.get('/postcode_geocodes', { params });

        if (response.status === 200 && response.data) {
          setData(response.data);
        } else {
          setData([]);
        }

        setIsLoading(false);
      }

      if (!isLoading) {
        setIsLoading(true);
        fetchItems();
      }
    },
    [isLoading]
  );

  return [
    handleSearchPostcodes,
    { postcodes: data, handleResetPostcodes, isLoading },
  ];
};
