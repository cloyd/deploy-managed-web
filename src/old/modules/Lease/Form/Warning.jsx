import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Form } from 'reactstrap';

import { FormButtons } from '../../Form';

export const LeaseFormWarning = ({ className, onCancel, onSubmit }) => {
  return (
    <Form onSubmit={onSubmit} className={className}>
      <Alert color="danger">
        Please note you have entered a <strong>first payment date</strong> that
        is more than two weeks in the past. This may cause the tenant to be in
        arrears or allocate funds to the wrong rental period. If the tenant has
        elected to pay via Direct Debit, it will debit their bank account to
        ensure they are paid to date.
        <br />
        <br />
        Please review the date entered.
        <br />
        <br />
        If the <strong>date is correct</strong>, please continue with the
        activation. Note: First payment date should be the tenant&apos;s{' '}
        <strong>Paid to Date</strong> + 1 day.
      </Alert>
      <FormButtons btnSubmit={{ text: 'Continue' }} onCancel={onCancel} />
    </Form>
  );
};

LeaseFormWarning.propTypes = {
  className: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  property: PropTypes.object,
  lease: PropTypes.object,
};
