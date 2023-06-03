import { useRef } from 'react';

export const useOnce = (fn) => {
  const didOnce = useRef(false);

  if (!didOnce.current) {
    didOnce.current = true;
    fn();
  }
};
