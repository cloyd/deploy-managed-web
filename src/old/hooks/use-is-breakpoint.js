import { useMemo } from 'react';

import { useWindowSize } from '@app/hooks';

// sourced from node_modules/bootstrap/scss/_variables.scss
const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

/**
 * Returns true/false
 * @param {string} key - Bootstrap breakpoint key
 * @param {string} dir - up or down, default up ie: greater than
 */
export const useIsBreakpoint = (key, dir = 'up') => {
  const { width } = useWindowSize();
  const breakpoint = BREAKPOINTS[key];

  return useMemo(() => {
    if (!breakpoint) {
      return false;
    } else if (dir === 'down') {
      return width < breakpoint;
    } else {
      return width > breakpoint;
    }
  }, [breakpoint, dir, width]);
};
