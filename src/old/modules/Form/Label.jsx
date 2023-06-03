import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { Label, UncontrolledTooltip } from 'reactstrap';

export const FormLabel = ({
  children,
  className,
  isRequired,
  isShowRequired,
  helpText,
  ...props
}) => {
  const toolTipRef = useRef();
  return (
    <Label className={className} {...props}>
      <span>{children || props.for}</span>
      {(isRequired || isShowRequired) && (
        <span className="text-danger ml-1">*</span>
      )}
      {helpText && (
        <>
          <span ref={toolTipRef} className="text-left ml-1">
            <FontAwesomeIcon icon={['fas', 'circle-question']} />
          </span>
          <UncontrolledTooltip target={toolTipRef} placement="top">
            {helpText}
          </UncontrolledTooltip>
        </>
      )}
    </Label>
  );
};

FormLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  for: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  isShowRequired: PropTypes.bool,
  helpText: PropTypes.string,
};

FormLabel.defaultProps = {
  isRequired: false,
  className: 'text-capitalize ml-1',
};
