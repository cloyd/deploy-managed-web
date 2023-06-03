import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { toQueryObject } from '../utils';

/**
 * Hook that returns search params of current location
 * e.g. for managed.com/test?hello_world=123&foo=bar
 * return { helloWorld: '123', foo: 'bar' }
 */
export const useLocationParams = () => {
  const location = useLocation();
  return useMemo(() => toQueryObject(location.search), [location.search]);
};
