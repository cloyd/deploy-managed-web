import { useCallback, useState } from 'react';

export const DIRECTION = {
  asc: 'ascending',
  desc: 'descending',
};

export const useSortableData = (
  sortCallback,
  config = {
    key: 'date',
    direction: DIRECTION.desc,
  }
) => {
  const [sortConfig, setSortConfig] = useState(config);

  const requestSort = useCallback(
    (key) => {
      const direction =
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === DIRECTION.asc
          ? DIRECTION.desc
          : DIRECTION.asc;
      setSortConfig({ key, direction });
      sortCallback({ key, direction });
    },
    [sortCallback, sortConfig]
  );

  return { requestSort, sortConfig };
};

export default useSortableData;
