import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const ICONS = {
  grid: ['far', 'th-large'],
  list: ['far', 'bars'],
};

export const FilterView = ({ onChange, value, values }) => {
  const handleClick = useCallback((key) => () => onChange(key), [onChange]);

  return (
    <Pagination listClassName="m-0">
      {values.map((key) => (
        <PaginationItem key={`key-${key}`}>
          <PaginationLink
            disabled={key === value}
            className={key === value ? 'bg-300' : null}
            onClick={handleClick(key)}>
            <FontAwesomeIcon icon={ICONS[key]} className="text-dark" />
          </PaginationLink>
        </PaginationItem>
      ))}
    </Pagination>
  );
};

FilterView.propTypes = {
  value: PropTypes.string,
  values: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

FilterView.defaultProps = {
  value: 'grid',
  values: ['grid', 'list'],
};
