import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

export const defaultQueryClientOptions = {
  queries: {
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 900000, // default cacheTime is 5 minutes; doesn't make sense for staleTime to exceed cacheTime
  },
  mutations: {
    // onError: , TODO: create global error handling
  },
};

export const QueryProvider = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: defaultQueryClientOptions,
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

QueryProvider.propTypes = {
  children: PropTypes.node,
};

export default QueryProvider;
