import PropTypes from 'prop-types';
import React from 'react';

import { SignatureCanvas } from '.';
import { useIsOpen } from '../../hooks';
import { ButtonIcon } from '../Button';
import { ModalConfirm } from '../Modal';

export const SignatureModule = (props) => {
  const { buttonOptions, children, className, onConfirm, title } = props;
  const [isOpen, actions] = useIsOpen(onConfirm);

  return (
    <div className={className} data-testid="signature-module">
      <ButtonIcon
        buttonColor={buttonOptions.buttonColor || 'success'}
        color={buttonOptions.color || 'white'}
        data-testid="button-signature-module"
        disabled={props.isDisabled}
        icon={['far', 'file-signature']}
        onClick={actions.handleOpen}>
        {buttonOptions.text || 'Provide Signature'}
      </ButtonIcon>
      <ModalConfirm
        data-testid="modal-signature-module"
        isOpen={isOpen}
        size="lg"
        title={title}>
        <div className="d-block bg-light border mb-3 p-3">
          {children}
          <SignatureCanvas
            onCancel={actions.handleClose}
            onSubmit={actions.handleSubmit}
          />
        </div>
      </ModalConfirm>
    </div>
  );
};

SignatureModule.propTypes = {
  buttonOptions: PropTypes.shape({
    buttonColor: PropTypes.string,
    color: PropTypes.string,
    text: PropTypes.string,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
};

SignatureModule.defaultProps = {
  isDisabled: false,
  title: 'Acknowledgement & Signature',
};
