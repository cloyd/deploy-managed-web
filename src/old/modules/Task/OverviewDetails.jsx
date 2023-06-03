import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';

import { useIsOpen } from '@app/hooks';
import { ButtonToggler } from '@app/modules/Button';
import { TaskOverviewDetail, useTaskAppointments } from '@app/modules/Task';

export const TaskOverviewDetails = ({ task }) => {
  const [isOpen, { handleToggle }] = useIsOpen();
  const appointments = useTaskAppointments(task);

  return (
    <>
      {isOpen && (
        <div className="mb-3">
          <div className="d-lg-flex justify-space-between border-bottom px-1 mb-3">
            <TaskOverviewDetail
              title="Tenant allows access?"
              value={!task.hasAccess}
            />
            <TaskOverviewDetail
              title="Preferred day and time"
              value={appointments}
            />
            <TaskOverviewDetail title="Area" value={startCase(task.location)} />
          </div>
          {task.hasAccess && (
            <>
              <div className="d-lg-flex justify-space-between px-1">
                <TaskOverviewDetail
                  title="Dogs on premises?"
                  value={task.hasDogs}
                />
                <TaskOverviewDetail
                  title="Have the keys changed?"
                  value={task.keysChanged}
                />
                <TaskOverviewDetail title="Alarm Code" value={task.alarmCode} />
              </div>
              <div className="px-1">
                <TaskOverviewDetail
                  title="Access instructions"
                  value={task.accessInstructions}
                />
              </div>
            </>
          )}
        </div>
      )}
      <div className="d-flex justify-content-center">
        <ButtonToggler isActive={isOpen} onClick={handleToggle}>
          More Details
        </ButtonToggler>
      </div>
    </>
  );
};

TaskOverviewDetails.propTypes = {
  task: PropTypes.object,
};

TaskOverviewDetails.defaultProps = {
  task: {},
};
