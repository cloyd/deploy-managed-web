import { useMemo } from 'react';

import { useWindowSize } from '.';

/*
 * Hook that returns whether or not the current window is a mobile width
 */
export const useIsMobile = () => {
  const { width } = useWindowSize();

  const isMobileWidth = useMemo(() => {
    return width < 992;
  }, [width]);

  return isMobileWidth;
};
