import PropTypes from 'prop-types';
import React from 'react';

import { useIsOpen } from '../../../hooks';
import { ButtonIcon } from '../../Button';
import { ModalConfirm } from '../../Modal';

export const JobCancelModal = (props) => {
  const { className, onSubmit, title } = props;
  const [isOpen, openActions] = useIsOpen(onSubmit);

  return (
    <div className={className}>
      <ButtonIcon
        color="danger"
        data-testid="button-job-cancel"
        direction="column"
        icon={['far', 'times-circle']}
        size="2x"
        onClick={openActions.handleOpen}>
        <small>Cancel Job</small>
      </ButtonIcon>
      <ModalConfirm
        btnCancel={{ text: 'No' }}
        btnSubmit={{ text: 'Yes', color: 'danger' }}
        isOpen={isOpen}
        size="sm"
        onCancel={openActions.handleClose}
        onSubmit={openActions.handleSubmit}>
        <p>
          Are you sure you want to cancel {title ? `"${title}"` : 'this job'}?
        </p>
      </ModalConfirm>
    </div>
  );
};

JobCancelModal.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
};
