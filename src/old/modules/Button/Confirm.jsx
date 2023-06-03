import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import { useIsOpen } from '../../hooks';
import { ModalConfirm } from '../Modal';

export const ButtonConfirm = ({ children, modal, onClick, ...props }) => {
  const { title, body } = modal || {};

  const [isOpen, actions] = useIsOpen(onClick);

  return (
    <div>
      <Button onClick={modal ? actions.handleOpen : onClick} {...props}>
        {children}
      </Button>
      <ModalConfirm
        btnSubmit={modal.btnSubmit}
        btnCancel={modal.btnCancel}
        body={body}
        isOpen={isOpen}
        title={title}
        onCancel={actions.handleClose}
        onSubmit={actions.handleSubmit}
      />
    </div>
  );
};

ButtonConfirm.propTypes = {
  children: PropTypes.node.isRequired,
  modal: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
    btnSubmit: PropTypes.object,
    btnCancel: PropTypes.object,
  }),
  onClick: PropTypes.func.isRequired,
};

ButtonConfirm.defaultProps = {
  modal: {
    btnCancel: { text: 'Cancel' },
    btnSubmit: { text: 'Ok' },
  },
};
