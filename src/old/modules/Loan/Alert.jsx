import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import localStorage from 'store';

import { useIsOpen } from '../../hooks';
import { sanitizeHtml } from '../../utils';

export const LoanAlert = ({ balance, property, ...props }) => {
  const storeKey = useMemo(() => {
    return `property.${property.id}.loan-alert`;
  }, [property]);

  const isPropsOpen = useMemo(() => {
    return !localStorage.get(storeKey) && props.isOpen;
  }, [props.isOpen, storeKey]);

  const title = useMemo(() => {
    return balance > 0
      ? 'Improve your property cash flow'
      : 'You don&rsquo;t have enough funds in your wallet to cover upcoming bills';
  }, [balance]);

  const content = useMemo(() => {
    return balance > 0
      ? 'You could benefit from a short-term loan.'
      : 'Improve your property cash flow by getting a loan.';
  }, [balance]);

  const handleSubmitCallback = useCallback(() => {
    localStorage.set(storeKey, true);
  }, [storeKey]);

  const [isOpen, { handleOpen, handleSubmit }] = useIsOpen(
    handleSubmitCallback,
    isPropsOpen
  );

  useEffect(() => {
    if (isPropsOpen) {
      handleOpen();
    }
  }, [handleOpen, isPropsOpen]);

  return isOpen ? (
    <Alert toggle={handleSubmit} {...props}>
      <div className="d-flex">
        <div className="fa-layers fa-fw mt-1">
          <FontAwesomeIcon icon={['far', 'circle']} size="lg" />
          <FontAwesomeIcon
            icon={['far', 'dollar-sign']}
            size="xs"
            className="ml-2"
          />
        </div>
        <div className="d-lg-flex justify-content-between align-items-center w-100">
          <div className="ml-3 text-dark">
            <h5
              className="alert-heading mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
            />
            <small>{content}</small>
          </div>
          <div className="ml-3 mt-3 m-lg-0">
            <Link
              data-testid="link"
              className="btn btn-lg btn-primary"
              color="primary"
              to={`/property/${property.id}/loans/providers`}>
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </Alert>
  ) : null;
};

LoanAlert.propTypes = {
  isOpen: PropTypes.bool,
  color: PropTypes.string,
  className: PropTypes.string,
  balance: PropTypes.number,
  property: PropTypes.object.isRequired,
};

LoanAlert.defaultProps = {
  isOpen: false,
  color: 'primary',
  balance: 0,
};
