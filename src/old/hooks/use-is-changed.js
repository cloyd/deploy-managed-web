import isEqual from 'lodash/fp/isEqual';

import { usePrevious } from '.';

export const useIsChanged = (current) => {
  return !isEqual(current, usePrevious(current));
};
