import PropTypes from 'prop-types';
import React from 'react';

import { useIsOpen } from '@app/hooks';
import { ButtonIcon } from '@app/modules/Button';
import { ModalConfirm } from '@app/modules/Modal';

/**
 * Request owner review of quote confirmation component
 */
export const JobRequestReviewModal = (props) => {
  const { className, onSubmit } = props;
  const [isOpen, openActions] = useIsOpen(onSubmit);

  return (
    <div className={className}>
      <ButtonIcon
        color="success"
        data-testid="button-request-review"
        direction="column"
        icon={['far', 'envelope']}
        size="2x"
        onClick={openActions.handleOpen}>
        <small>Review</small>
      </ButtonIcon>
      <ModalConfirm
        btnCancel={{ text: 'Cancel' }}
        btnSubmit={{ text: 'Request', color: 'success' }}
        isOpen={isOpen}
        size="sm"
        onCancel={openActions.handleClose}
        onSubmit={openActions.handleSubmit}>
        <p>
          Request owner to review quotes for {`"${props.title}"` || 'this job'}?
        </p>
      </ModalConfirm>
    </div>
  );
};

JobRequestReviewModal.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
};
