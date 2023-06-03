import PropTypes from 'prop-types';
import React from 'react';
import { Badge, Button } from 'reactstrap';

export const PaymentBadge = ({ isActive, onClick, title, ...props }) => {
  const classNames = ['d-flex', 'align-items-start'];
  const className = (
    isActive
      ? classNames.concat('p-1', 'font-weight-normal')
      : classNames.concat('p-0')
  ).join(' ');

  return (
    <div {...props}>
      {isActive ? (
        <Badge color="success" className={className}>
          {title}
        </Badge>
      ) : (
        <Button color="link" className={className} onClick={onClick}>
          <small>{title}</small>
        </Button>
      )}
    </div>
  );
};

PaymentBadge.propTypes = {
  isActive: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
