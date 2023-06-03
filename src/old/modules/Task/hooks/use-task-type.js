import startCase from 'lodash/fp/startCase';
import { useMemo } from 'react';

import { TYPE } from '@app/redux/task';

export function useTaskType(task) {
  const type = useMemo(() => {
    return task?.type;
  }, [task]);

  return useMemo(() => {
    return Object.keys(TYPE).reduce((acc, key) => {
      const isKey = `is${startCase(key)}`;
      const value = TYPE[key] === type;

      return { ...acc, [isKey]: value };
    }, {});
  }, [type]);
}
