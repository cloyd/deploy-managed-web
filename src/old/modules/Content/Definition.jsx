import PropTypes from 'prop-types';
import React from 'react';

export const ContentDefinition = ({
  children,
  defaultValue,
  label,
  value,
  labelClassName,
  ...props
}) => (
  <span {...props}>
    <small className={labelClassName}>
      <strong>{label}</strong>
    </small>
    <br />
    <span data-testid="content-definition-value">
      {children || value || defaultValue}
    </span>
  </span>
);

ContentDefinition.defaultProps = {
  defaultValue: '-',
  labelClassName: '',
};

ContentDefinition.propTypes = {
  children: PropTypes.node,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  labelClassName: PropTypes.string,
};
