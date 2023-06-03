import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { UncontrolledTooltip } from 'reactstrap';

export const PaymentVirtualAccountIcon = (props) => {
  const showWarningOrError =
    props.virtualAccountStatus === 'pending_activation' ||
    props.virtualAccountStatus === 'failed_activation';
  const checkWarningOrErrorStatus = useMemo(() => {
    if (props.virtualAccountStatus === 'pending_activation') {
      return 'warning';
    } else if (props.virtualAccountStatus === 'failed_activation') {
      return 'error';
    } else {
      return null;
    }
  }, [props.virtualAccountStatus]);

  return (
    <div className="d-flex">
      <FontAwesomeIcon
        icon={['far', 'money-check-alt']}
        size="4x"
        color="#142C61"
      />
      <div className={`ml-2 ${props.className}`}>
        <div>
          <strong>{props.title}</strong>
          {showWarningOrError && (
            <FontAwesomeIcon
              id={'tooltipVirtualAccountIcon-' + props.virtualAccountStatus}
              className={`ml-2 ${
                checkWarningOrErrorStatus === 'warning'
                  ? 'text-warning'
                  : checkWarningOrErrorStatus === 'error'
                  ? 'text-danger'
                  : null
              }`}
              icon={['fas', 'exclamation-triangle']}
            />
          )}
          {showWarningOrError && (
            <UncontrolledTooltip
              target={'tooltipVirtualAccountIcon-' + props.virtualAccountStatus}
              placement="top">
              {checkWarningOrErrorStatus === 'warning'
                ? 'This account will complete activating shortly.'
                : 'Activation failed'}
            </UncontrolledTooltip>
          )}
        </div>
        {props.children}
      </div>
    </div>
  );
};

PaymentVirtualAccountIcon.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  virtualAccountStatus: PropTypes.string,
};

PaymentVirtualAccountIcon.defaultProps = {
  title: 'Direct Payment',
};
