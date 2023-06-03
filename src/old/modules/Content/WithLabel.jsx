import PropTypes from 'prop-types';
import React from 'react';

export const ContentWithLabel = (props) => {
  const { className, label, value } = props;
  const content = value === true ? 'Yes' : value === false ? 'No' : value;

  return (
    <div className={className}>
      <strong>{label}</strong>
      {props.children || <p>{content || '-'}</p>}
    </div>
  );
};

ContentWithLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
};
