import PropTypes from 'prop-types';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import { CardBody, CardTitle } from 'reactstrap';

import { CardHeaderLight, CardLight } from '../Card';
import { PaymentCardIcon } from './CardIcon';

export const AccountLoader = ({ title, type }) => (
  <CardLight className="mb-3">
    <CardHeaderLight hasCustomLoader>
      <header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-end w-50">
          <PaymentCardIcon cardType={type} className="mr-2" />
          <CardTitle className="mb-0" tag="h5">
            {title}
          </CardTitle>
        </div>
      </header>
    </CardHeaderLight>
    <CardBody className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
      <PulseLoader color="#dee2e6" />
    </CardBody>
  </CardLight>
);

AccountLoader.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
};

AccountLoader.defaultProps = {
  title: 'Bank',
  type: 'bank',
};
