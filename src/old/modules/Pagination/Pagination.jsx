import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import { getPagination } from '../../redux/pagination';
import { toClassName } from '../../utils';
import { usePagination } from './use-pagination';

export const PaginationComponent = (props) => {
  const { history, isReload, location, maxPagesShown, onClick, pagination } =
    props;
  const { page, totalPages } = pagination;

  const paginationItems = usePagination({
    location,
    maxPagesShown,
    pagination,
  });

  const showPagination = useMemo(
    () =>
      page && totalPages && totalPages > 1 && page > 0 && page <= totalPages,
    [page, totalPages]
  );

  const className = useMemo(() => {
    return toClassName(
      ['d-flex', `justify-content-${props.align}`],
      props.className
    );
  }, [props.align, props.className]);

  const handleClick = useCallback(
    (path) => (e) => {
      e.preventDefault();
      onClick(path);
    },
    [onClick]
  );

  const handleClickDefault = useCallback(
    (path) => (e) => {
      e.preventDefault();
      history.push(path);
    },
    [history]
  );

  return showPagination ? (
    <Pagination className={className}>
      {paginationItems.map((page) => (
        <PaginationItem
          key={`page-${page.label}`}
          active={page.isActive}
          disabled={page.isDisabled}>
          {onClick ? (
            <PaginationLink onClick={handleClick(page.href)}>
              {page.label}
            </PaginationLink>
          ) : isReload ? (
            <PaginationLink href={page.href}>{page.label}</PaginationLink>
          ) : (
            <PaginationLink onClick={handleClickDefault(page.href)}>
              {page.label}
            </PaginationLink>
          )}
        </PaginationItem>
      ))}
    </Pagination>
  ) : null;
};

PaginationComponent.propTypes = {
  align: PropTypes.oneOf(['start', 'center', 'end']),
  className: PropTypes.string,
  history: PropTypes.object,
  isReload: PropTypes.bool, // Determines whether or not pagination links should refresh page
  location: PropTypes.object.isRequired,
  maxPagesShown: PropTypes.number,
  pagination: PropTypes.object,
  onClick: PropTypes.func,
};

PaginationComponent.defaultProps = {
  align: 'center',
  isReload: true,
  pagination: {},
  maxPagesShown: 5,
};

const mapStateToProps = ({ pagination }, props) => {
  return {
    pagination: getPagination(pagination, props.name),
  };
};

export const PaginationContainer = compose(
  connect(mapStateToProps),
  withRouter
)(PaginationComponent);
