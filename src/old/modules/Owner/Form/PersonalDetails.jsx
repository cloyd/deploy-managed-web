import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, CardHeader, CardTitle } from 'reactstrap';

import { CardLight } from '../../Card';
import { UserFormPersonal } from '../../User';

export const OwnerFormPersonalDetails = ({
  hasError,
  isLoading,
  user,
  onKycSubmit,
  onKycCancel,
}) => {
  return (
    <CardLight className="mb-3" data-testid="owner-form-personal-details">
      <CardHeader className="d-flex justify-content-between bg-white border-400">
        <CardTitle className="mb-0" tag="h5">
          Personal Details
        </CardTitle>
      </CardHeader>
      <CardBody>
        <UserFormPersonal
          hasError={hasError}
          isLoading={isLoading}
          user={user}
          onSubmit={onKycSubmit}
          onCancel={onKycCancel}
          className="mb-3"
        />
      </CardBody>
    </CardLight>
  );
};

OwnerFormPersonalDetails.propTypes = {
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  onKycSubmit: PropTypes.func,
  onKycCancel: PropTypes.func,
};

OwnerFormPersonalDetails.defaultProps = {
  user: {},
};
