import { useMemo } from 'react';

import { toClassName } from '../utils';

/* TODO: Move toClassName here once everything is moved to hooks */
export const useClassName = (defaultClassNames, classNames) => {
  return useMemo(() => {
    return defaultClassNames && toClassName(defaultClassNames, classNames);
  }, [defaultClassNames, classNames]);
};
