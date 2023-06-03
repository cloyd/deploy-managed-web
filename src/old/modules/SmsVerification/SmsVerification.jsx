import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import { selectProfileEmail } from '../../redux/profile';
import Form from './Form';
import './styles.scss';
import useSendSecurityCode from './use-send-security-code';

export const SmsVerification = ({
  modalState = {
    isOpen: false,
  },
  toggle,
}) => {
  const userEmail = useSelector(selectProfileEmail);

  const { mutate, isLoading, isSuccess } = useSendSecurityCode();

  const requestSecurityCode = useCallback(() => {
    mutate({ email: userEmail });
  }, [mutate, userEmail]);

  const verify = useCallback(
    ({ securityCode }) => {
      if (modalState.isOpen) {
        if (modalState.callback && typeof modalState.callback === 'function') {
          modalState.callback(securityCode);
        }
        toggle({ isOpen: false, callback: null });
      }
    },
    [modalState, toggle]
  );

  // request security code on open
  useEffect(() => {
    if (modalState.isOpen) {
      requestSecurityCode();
    }
  }, [modalState.isOpen, requestSecurityCode]);

  return (
    <Modal
      centered
      isOpen={modalState.isOpen}
      toggle={toggle}
      wrapClassName="sms-2fa-modal">
      <ModalHeader toggle={toggle}>2FA SMS Verification</ModalHeader>
      <ModalBody>
        <Form
          onSubmit={verify}
          requestSecurityCode={requestSecurityCode}
          isRequestingSecurityCode={isLoading}
          isSecurityCodeSuccess={isSuccess}
        />
      </ModalBody>
    </Modal>
  );
};

SmsVerification.propTypes = {
  modalState: PropTypes.object,
  toggle: PropTypes.func,
};

export default SmsVerification;
