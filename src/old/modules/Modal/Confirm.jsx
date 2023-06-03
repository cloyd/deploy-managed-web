import PropTypes from 'prop-types';
import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import { sanitizeHtml } from '../../utils';
import { FormButtons } from '../Form';

export const ModalConfirm = (props) => {
  const {
    children,
    body,
    btnCancel,
    btnSubmit,
    isDisabled,
    onCancel,
    onSubmit,
    size,
    title,
    className,
    ...otherProps
  } = props;

  return (
    <Modal size={size} centered data-testid="modal-confirm" {...otherProps}>
      {title && (
        <ModalHeader
          cssModule={{ 'modal-title': 'w-100 mb-0' }}
          className={className}>
          {title}
        </ModalHeader>
      )}
      <ModalBody>
        {body && (
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }} />
        )}
        {children}
        {onSubmit && (
          <FormButtons
            className="justify-content-between mt-4"
            isDisabled={isDisabled}
            btnCancel={btnCancel}
            btnSubmit={btnSubmit}
            onCancel={onCancel}
            onSubmit={onSubmit}>
            <span className="d-none" />
          </FormButtons>
        )}
      </ModalBody>
    </Modal>
  );
};

ModalConfirm.propTypes = {
  body: PropTypes.string,
  children: PropTypes.node,
  btnCancel: PropTypes.object,
  btnSubmit: PropTypes.object,
  isDisabled: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
};

ModalConfirm.defaultProps = {
  btnCancel: { text: 'No' },
  btnSubmit: { text: 'Yes' },
  size: 'sm',
};
