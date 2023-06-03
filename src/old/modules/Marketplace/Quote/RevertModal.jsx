import PropTypes from 'prop-types';
import React from 'react';

import { useIsOpen } from '../../../hooks';
import { ButtonIcon } from '../../Button';
import { ModalConfirm } from '../../Modal';

/**
 * Revert accepted quote confirmation component - should be used by managers
 * when they revert accepted quotes.
 */
export const QuoteRevertModal = (props) => {
  const { className, onSubmit, title } = props;
  const [isOpen, openActions] = useIsOpen(onSubmit);

  return (
    <div className={className} data-testid="quote-revert-modal">
      <ButtonIcon
        color="danger"
        data-testid="button-quote-revert"
        direction="column"
        icon={['far', 'history']}
        size="2x"
        onClick={openActions.handleOpen}>
        <small>Revert</small>
      </ButtonIcon>
      <ModalConfirm
        btnCancel={{ text: 'Cancel' }}
        btnSubmit={{ text: 'Accept', color: 'danger' }}
        isOpen={isOpen}
        size="sm"
        onCancel={openActions.handleClose}
        onSubmit={openActions.handleSubmit}>
        <p>Are you sure you want to revert {title && `, "${title}"`}?</p>
      </ModalConfirm>
    </div>
  );
};

QuoteRevertModal.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
};
