import { useMemo } from 'react';

import { toClassName } from '../utils';

export const useMessageClasses = (isCreator, isActivityMessage) =>
  useMemo(
    () => ({
      inner: toClassName(
        ['w-75 d-flex align-items-center pb-1'],
        isCreator ? '' : 'flex-row-reverse'
      ),
      outer: toClassName(
        ['d-flex flex-column'],
        isCreator ? '' : 'align-items-end'
      ),
      card: toClassName(['border'], isActivityMessage ? 'bg-purple-100' : ''),
    }),
    [isActivityMessage, isCreator]
  );
