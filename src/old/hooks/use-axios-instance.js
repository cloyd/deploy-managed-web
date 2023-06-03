import axios from 'axios';
import { useMemo } from 'react';

import { handleRequest } from '../utils/httpClient';

/**
 * Hook that returns an instance of axios
 *
 * This should be used in async functions where we do not want the
 * response interceptor behaviour that's found in /utils/httpClient -
 * otherwise httpClient should be used instead, because this will not
 * format returned data.
 */
export const useAxiosInstance = () =>
  useMemo(() => {
    const instance = axios.create({ baseURL: '/api' });
    instance.interceptors.request.use(handleRequest);

    return instance;
  }, []);
