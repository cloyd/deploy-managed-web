import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import { Link } from '../Link';

export const ExternalCreditorButtonCTA = ({ tradieUser }) =>
  tradieUser && !tradieUser.promisepayUserPromisepayCompanyLegalName ? (
    <Link color="warning" to="/profile">
      <FontAwesomeIcon icon={['far', 'dollar-sign']} /> Complete profile to get
      paid
    </Link>
  ) : tradieUser && !tradieUser.isDisbursementAccountSet ? (
    <Link color="info" to="/payments/settings">
      <FontAwesomeIcon icon={['far', 'dollar-sign']} /> Complete payment details
      to get paid
    </Link>
  ) : null;

ExternalCreditorButtonCTA.propTypes = {
  tradieUser: PropTypes.object,
};
