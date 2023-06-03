import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';

import { formatDateRange } from '../../utils';
import { ContentWithLabel } from '../Content';
import { UploaderFiles } from '../Uploader';

export const TaskSummary = ({ hasDescription, task, ...props }) => {
  return (
    <div {...props}>
      {hasDescription && (
        <ContentWithLabel label="Description" value={task.description} />
      )}
      {task?.taskCategory?.key && (
        <ContentWithLabel
          label="Category"
          value={startCase(task?.taskCategory?.key)}
        />
      )}
      <ContentWithLabel label="Location" value={startCase(task.location)} />
      <ContentWithLabel label="When is a good time for someone to attend?">
        {task.appointments?.length > 0 && (
          <ul className="pl-4">
            {task.appointments.map(({ startsAt, endsAt }, i) => (
              <li key={`appointment-${i}`}>
                {formatDateRange(startsAt, endsAt)}
              </li>
            ))}
          </ul>
        )}
      </ContentWithLabel>
      <ContentWithLabel label="Dogs on the premises?" value={task.hasDogs} />
      <ContentWithLabel
        label="Hide tenant details from a tradie. Tradie will be prompted to contact the agency to organize access"
        value={task.hasAccess}
      />
      <ContentWithLabel
        label="Have the keys have changed?"
        value={task.keys_changed}
      />
      <ContentWithLabel
        label="Is there an alarm code?"
        value={task.alarm_code}
      />
      {task.attachments && task.attachments.length > 0 && (
        <ContentWithLabel label="Attached Files">
          <UploaderFiles
            attachments={task.attachments}
            className="small mt-2 mb-0"
          />
        </ContentWithLabel>
      )}
      {props.children}
    </div>
  );
};

TaskSummary.propTypes = {
  children: PropTypes.node,
  hasDescription: PropTypes.bool,
  task: PropTypes.object,
};

TaskSummary.defaultProps = {
  hasDescription: false,
  task: {},
};
