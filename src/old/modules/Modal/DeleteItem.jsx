import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

export const ModalDeleteItem = ({
  isOpen,
  title,
  bodyText,
  onCancel,
  onSubmit,
  size,
}) => {
  return (
    <Modal size={size} isOpen={isOpen} centered>
      <ModalHeader>
        <div>{title}</div>
      </ModalHeader>
      <ModalBody>
        <p>{bodyText}</p>
        <div style={{ float: 'right' }}>
          <Button
            className="ml-2 mr-2"
            outline
            color="primary"
            onClick={onSubmit}>
            OK
          </Button>
          <Button
            className="ml-2 mr-2"
            outline
            color="danger"
            onClick={onCancel}>
            CANCEL
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

ModalDeleteItem.defaultProps = {
  size: 'sm',
};

ModalDeleteItem.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  bodyText: PropTypes.string,
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  size: PropTypes.string,
};
