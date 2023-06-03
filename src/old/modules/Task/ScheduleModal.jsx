import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button, CustomInput, Modal, ModalBody, ModalHeader } from 'reactstrap';

import { TaskBillSummary } from '@app/modules/Task';
import { updateTask } from '@app/redux/task';
import { toDollars } from '@app/utils';

export const TaskScheduleModal = ({ task, isOpen, onCancel, onSubmit }) => {
  const dispatch = useDispatch();

  const handleOnChange = useCallback(() => {
    const action = updateTask({
      propertyId: task.propertyId,
      taskId: task.id,
      invoiceAttributes: {
        ...task.invoice,
        isAgencyCoveringFees: !task.invoice.isAgencyCoveringFees,
      },
    });

    dispatch(action);
  }, [dispatch, task]);

  return (
    <Modal size="sm" isOpen={isOpen} centered>
      <ModalHeader>Schedule Payment</ModalHeader>
      <ModalBody>
        <TaskBillSummary task={task} hasAlerts={false} />
        <CustomInput
          checked={task.invoice.isAgencyCoveringFees}
          id="isAgencyCoveringFees"
          label="Agency covers fees"
          type="checkbox"
          value={task.invoice.isAgencyCoveringFees}
          onChange={handleOnChange}
          className="mb-3"
        />
        <p className="mb-2">The tradie will pay the following fees:</p>
        <p className="mb-4">
          <strong>Admin fee</strong> $
          {toDollars(task.invoice.tradieAdminFeeCents)}
          <br />
          <strong>{task.invoice.tradieServiceFeeType} fee</strong> $
          {toDollars(task.invoice.tradieServiceFeeCents)}
        </p>
        <div className="d-flex justify-content-between">
          <Button outline color="primary" onClick={onCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={onSubmit}>
            Schedule
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

TaskScheduleModal.propTypes = {
  task: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
