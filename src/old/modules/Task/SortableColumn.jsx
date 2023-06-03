import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { memo, useCallback } from 'react';

export const SortableColumn = ({ column, requestSort, sortConfig }) => {
  const handleColumnClick = useCallback(
    () => requestSort(column.id),
    [column.id, requestSort]
  );

  return (
    <a
      type="button"
      data-testid={`sortable-column-${column.id}`}
      onClick={handleColumnClick}
      className={
        sortConfig && sortConfig.key === column.id && sortConfig.direction
          ? 'font-weight-bolder'
          : ''
      }>
      {column.name}
      <span className="ml-2">
        {sortConfig && sortConfig.direction && sortConfig.key === column.id ? (
          sortConfig.direction === 'ascending' ? (
            <FontAwesomeIcon icon={['fad', 'sort-up']} />
          ) : (
            <FontAwesomeIcon icon={['fad', 'sort-down']} />
          )
        ) : (
          <FontAwesomeIcon icon={['far', 'sort']} />
        )}
      </span>
    </a>
  );
};

SortableColumn.propTypes = {
  requestSort: PropTypes.func.isRequired,
  sortConfig: PropTypes.object,
  column: PropTypes.object.isRequired,
};

export default memo(SortableColumn);
