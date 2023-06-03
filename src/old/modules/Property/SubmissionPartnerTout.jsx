import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Button, Col, Container, CustomInput, Row } from 'reactstrap';

import icon4 from '@app/assets/Connect.png';
import icon1 from '@app/assets/MoveEasy.png';
import icon3 from '@app/assets/OneCall.png';
import icon2 from '@app/assets/SaveTime.png';
import { useIsOpen } from '@app/hooks';
import { ModalConfirm } from '@app/modules/Modal';

export const PropertySubmissionPartnerTout = ({ ...props }) => {
  const [showIntegrationModal, buttonActions] = useIsOpen();
  const [checkedBoxes, setCheckedBoxes] = useState(0);

  const handleOnCheckBoxChange = useCallback(
    (e) => {
      e.persist();
      setCheckedBoxes((state) => (e.target.checked ? state + 1 : state - 1));
    },
    [setCheckedBoxes]
  );

  return (
    <Container fluid className="bg-green-light py-3 py-md-4">
      <Container>
        <Row className="justify-content-between text-white align-items-center">
          <Col className="connect-now-logo" />
          <Col sm={10} md={8}>
            <h5 className="px-3">
              Ready to move in? ConnectNow can sort your electricity, gas,
              internet, pay TV and more in one phone call.
            </h5>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button
              className="ml-3"
              color="primary"
              onClick={buttonActions.handleOpen}>
              More info
            </Button>
          </Col>
        </Row>
        <ModalConfirm
          isOpen={showIntegrationModal}
          isDisabled={checkedBoxes !== 2}
          size="lg"
          btnCancel={{ text: 'Cancel' }}
          btnSubmit={{ text: 'Get Connected' }}
          className="bg-green-light"
          onSubmit={props.handleSubmit}
          onCancel={buttonActions.handleClose}
          title={
            <div className="d-flex justify-content-center">
              <div className="connect-now-logo"></div>
            </div>
          }>
          <p className="text-center">
            ConnectNow has helped over 1 million customers move home.
          </p>
          <div className="row my-3">
            <article className="col-md-3 text-center py-3">
              <img src={icon1} alt="Move easy" width={60} />
              <h4>Home moving made easy</h4>
              <p>
                The free, no stress way to arrange all of your home moving
                needs.
              </p>
            </article>
            <article className="col-md-3 text-center py-3">
              <img src={icon2} alt="Save time" width={60} />
              <h4>Save time</h4>
              <p>Save up to 3 hours of your time.</p>
            </article>
            <article className="col-md-3 text-center py-3">
              <img src={icon3} alt="One Call" width={60} />
              <h4>One call</h4>
              <p>Arrange your core home moving needs in one call.</p>
            </article>
            <article className="col-md-3 text-center py-3">
              <img src={icon4} alt="Connect" width={60} />
              <h4>Choose your suppliers</h4>
              <p>You connect with some of Australia’s leading suppliers.</p>
            </article>
          </div>
          <p className="text-center">
            Let the team at ConnectNow help you with your move!
          </p>
          <hr />
          <CustomInput
            id="termsAndConditionsCheckbox"
            label={
              <>
                I accept the{' '}
                <a
                  href="https://connectnow.com.au/terms-and-conditions.asp?from=client"
                  target="_blank"
                  rel="noopener noreferrer">
                  ConnectNow Terms and Conditions
                </a>
                . Please call me to arrange my connections.
              </>
            }
            name="termsAndConditions"
            type="checkbox"
            onChange={handleOnCheckBoxChange}
          />
          <CustomInput
            id="shareDataCheckbox"
            label="I consent to Managed sharing my name, email, phone and lease info with ConnectNow"
            name="shareData"
            type="checkbox"
            onChange={handleOnCheckBoxChange}
          />
        </ModalConfirm>
      </Container>
    </Container>
  );
};

PropertySubmissionPartnerTout.propTypes = {
  handleSubmit: PropTypes.func,
};
