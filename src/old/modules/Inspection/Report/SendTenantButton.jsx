import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import { ButtonConfirm } from '../../Button';

export const InspectionReportSendTenantButton = (props) =>
  props.hasReportBeenSent ? (
    <span className="my-1 mx-3 mx-md-1 text-secondary">
      <FontAwesomeIcon icon={['far', 'check']} /> Sent to tenant
    </span>
  ) : (
    <ButtonConfirm
      className={props.className}
      color="link"
      data-testid="button-send-tenant"
      modal={{
        title: 'Send report to tenant',
        body: 'By clicking "Ok", the tenant will receive a notification to complete this report.',
      }}
      onClick={props.onSendToTenant}>
      <FontAwesomeIcon className="mr-2" icon={['far', 'paper-plane']} />
      Send
    </ButtonConfirm>
  );

InspectionReportSendTenantButton.propTypes = {
  className: PropTypes.string,
  hasReportBeenSent: PropTypes.bool,
  onSendToTenant: PropTypes.func,
};

InspectionReportSendTenantButton.defaultProps = {
  className: 'mx-1',
  hasReportBeenSent: false,
};
