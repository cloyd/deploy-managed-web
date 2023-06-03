import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Col, Container, Row } from 'reactstrap';
import localStorage from 'store';

import { useIsOpen } from '../../hooks';
import { ButtonIcon } from '../Button';

export const HeroTout = ({ ...props }) => {
  const storeKey = 'marketplace.hero-tout.persist';

  const isPropsOpen = useMemo(() => {
    return !localStorage.get(storeKey) && props.isOpen;
  }, [props.isOpen, storeKey]);

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
    <>
      <Container fluid className="marketplace-jobs py-3 py-md-4">
        <Container className="text-center">
          <Row className="justify-content-center text-white">
            <Col xs={12} className="d-flex justify-content-end">
              <ButtonIcon
                className="p-0 mt-3 text-white font-weight-bold"
                icon={['far', 'xmark']}
                onClick={handleSubmit}>
                Dismiss
              </ButtonIcon>
            </Col>
            <Col sm={10} md={8} className="mb-4">
              <FontAwesomeIcon icon={['far', 'store-alt']} size="4x" />
              <h1 className="alert-heading mb-0 pt-3 pb-4">Marketplace</h1>
              <h4>
                The Managed App marketplace connects you to thousands of
                potential jobs within your nominated service area. Easily grow
                your business by building more agency relationships and
                accessing more work.
              </h4>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container className="text-center my-3 my-md-5">
        <Row>
          <Col
            lg={4}
            className="d-flex flex-column align-items-center mb-3 mb-md-0">
            <RoundedIcon icon={['far', 'list']} />
            <h5>Search through all the active jobs within your service area</h5>
          </Col>
          <Col
            lg={4}
            className="d-flex flex-column align-items-center mb-3 mb-md-0">
            <RoundedIcon icon={['far', 'hand']} />
            <h5>
              Submit prices for open quotes or apply to handle open work orders
            </h5>
          </Col>
          <Col
            lg={4}
            className="d-flex flex-column align-items-center mb-3 mb-md-0">
            <RoundedIcon icon={['far', 'badge-dollar']} />
            <h5>
              Complete your assigned jobs, upload your invoice and track your
              payments
            </h5>
          </Col>
        </Row>
      </Container>
    </>
  ) : null;
};

HeroTout.propTypes = {
  isOpen: PropTypes.bool,
};

HeroTout.defaultProps = {
  isOpen: true,
};

export function RoundedIcon(props) {
  const { icon } = props;

  return (
    <div className="bg-yellow-light text-warning rounded-circle p-4 mb-3">
      <div className="d-flex text-center justify-content-center">
        <FontAwesomeIcon icon={icon} size="3x" />
      </div>
    </div>
  );
}

RoundedIcon.propTypes = {
  icon: PropTypes.array,
};
