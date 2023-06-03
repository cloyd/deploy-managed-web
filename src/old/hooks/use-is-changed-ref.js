import isEqual from 'lodash/fp/isEqual';
import { useMemo, useRef } from 'react';

export const useIsChangedRef = (current) => {
  const storedValue = useRef(current);
  return useMemo(() => !isEqual(storedValue.current, current), [current]);
};
