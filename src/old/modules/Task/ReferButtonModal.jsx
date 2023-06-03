import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useIsOpen } from '@app/hooks';
import { ButtonRefer } from '@app/modules/Button';
import { ModalConfirm } from '@app/modules/Modal';
import { updateTaskForOwnerReview } from '@app/redux/task';

export const TaskReferButtonModal = ({ task }) => {
  const [isOpen, { handleOpen, handleClose }] = useIsOpen();
  const dispatch = useDispatch();

  const handleSubmit = useCallback(() => {
    dispatch(updateTaskForOwnerReview(task));
    handleClose();
  }, [dispatch, handleClose, task]);

  return task.id ? (
    <div data-testid="task-review-button-modal">
      <ButtonRefer onClick={handleOpen} />
      <ModalConfirm
        isOpen={isOpen}
        onCancel={handleClose}
        onSubmit={handleSubmit}
        size="sm"
        title="Refer">
        <p>
          Are you sure you want to refer this task to the owner(s) for review?
        </p>
      </ModalConfirm>
    </div>
  ) : null;
};

TaskReferButtonModal.propTypes = {
  task: PropTypes.object,
};

TaskReferButtonModal.defaultProps = {
  task: {},
};
