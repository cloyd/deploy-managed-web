import PropTypes from 'prop-types';
import React from 'react';

import { Link } from '../Link';

export const LoanCallback = ({ provider }) => {
  return (
    <>
      <h4>Questions? Chat with {provider.name}</h4>
      <p>
        If you have any questions, please email{' '}
        <Link href={`mailto:${provider.email}`}>{provider.email}</Link> along
        with the nature your enquiry and we&#39;ll be in touch or give Possibl a
        call on{' '}
        <Link href={`tel:${provider.phone.replace(/\s+/g, '')}`}>
          {provider.phone}
        </Link>
      </p>
    </>
  );
};

LoanCallback.propTypes = {
  provider: PropTypes.object.isRequired,
};
