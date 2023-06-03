import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { useIsOpen } from '../../hooks';
import { removeAttachments } from '../../utils';
import { ButtonDestroy } from '../Button';
import { ModalConfirm } from '../Modal';

export const UploaderDestroy = ({
  attachableId,
  attachableType,
  attachmentId,
  onComplete,
  customHandleRemove,
  isArchived,
  children,
  ...props
}) => {
  const handleRemove = useCallback(() => {
    const params = {
      attachableId,
      attachableType,
      attachmentIds: [attachmentId],
    };

    if (customHandleRemove) {
      customHandleRemove(params);
    } else {
      removeAttachments(params, onComplete);
    }
  }, [
    attachableId,
    attachableType,
    attachmentId,
    customHandleRemove,
    onComplete,
  ]);

  const [isOpen, actions] = useIsOpen(handleRemove);

  return (
    <>
      <ButtonDestroy
        onClick={actions.handleOpen}
        {...props}
        disabled={isArchived}>
        {children}
      </ButtonDestroy>
      <ModalConfirm
        body="Are you sure you want this file permanently deleted?"
        btnSubmit={{ color: 'danger', text: 'Yes' }}
        isOpen={isOpen}
        title="Confirmation"
        onCancel={actions.handleClose}
        onSubmit={actions.handleSubmit}
      />
    </>
  );
};

UploaderDestroy.propTypes = {
  attachableId: PropTypes.number.isRequired,
  attachableType: PropTypes.string.isRequired,
  attachmentId: PropTypes.number.isRequired,
  children: PropTypes.node,
  onComplete: PropTypes.func.isRequired,
  isArchived: PropTypes.bool,
  customHandleRemove: PropTypes.func,
};
