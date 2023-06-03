import PropTypes from 'prop-types';
import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import { ChangePasswordForm } from './ChangePasswordForm';

export const ChangePassword = ({ isOpen, toggle }) => (
  <Modal centered isOpen={isOpen}>
    <ModalHeader toggle={toggle}>Change User Password</ModalHeader>
    <ModalBody>
      <ChangePasswordForm toggle={toggle} isOpen={isOpen} />
    </ModalBody>
  </Modal>
);

ChangePassword.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
};
ChangePassword.defaultProps = {
  isOpen: false,
};
