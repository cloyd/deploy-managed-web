import { snakeCase, startCase } from 'lodash';
import { useMemo } from 'react';

export const useLabelValueOptions = (items) => {
  return useMemo(() => {
    const values = [];

    if (items) {
      items.map((item) => {
        values.push({ label: startCase(item), value: snakeCase(item) });
      });
    }

    return values;
  }, [items]);
};
