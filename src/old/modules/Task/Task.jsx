import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';

import { formatDate, isInPast } from '../../utils';
import { ButtonIcon } from '../Button';
import { IconInspectionReport } from '../Inspection';
import { IconJob } from '../Marketplace';
import { UserAvatar } from '../User';
import { TaskCard } from './Card';
import { TaskCardPreview } from './CardPreview';
import { TaskIcon } from './Icon';

export const TaskContext = React.createContext();

const Action = () => (
  <TaskContext.Consumer>
    {() => (
      <ButtonIcon icon={['far', 'ellipsis-h']} color="muted" className="px-2" />
    )}
  </TaskContext.Consumer>
);

const Assignee = () => (
  <TaskContext.Consumer>
    {({ waitingOn }) => (
      <UserAvatar className="mx-2" role={waitingOn || 'manager'} size={0.65} />
    )}
  </TaskContext.Consumer>
);

const Description = () => (
  <TaskContext.Consumer>
    {({ description }) => (
      <div className="small">
        {description.length > 60
          ? description.slice(0, 57) + '...'
          : description}
      </div>
    )}
  </TaskContext.Consumer>
);

const DueDate = (props) => (
  <TaskContext.Consumer>
    {({ reminderDate, dueDate, status }) => {
      const { isManager } = props;
      const isCompleted = status === 'completed';
      const isAction =
        isManager &&
        reminderDate &&
        !isInPast(reminderDate) &&
        (isInPast(dueDate) || reminderDate < dueDate);
      const classname = isAction
        ? 'text-primary'
        : isInPast(dueDate) && !isCompleted
        ? 'text-danger'
        : 'text-muted';

      return dueDate ? (
        <div className={`small ${classname}`}>
          <span className="mr-1">{isAction ? 'Action' : 'Due'} date:</span>
          <br className="d-none d-md-block" />
          {formatDate(isAction ? reminderDate : dueDate)}
        </div>
      ) : null;
    }}
  </TaskContext.Consumer>
);

const CreatedAt = () => (
  <TaskContext.Consumer>
    {({ createdAt }) =>
      createdAt && (
        <div className="small text-muted">{formatDate(createdAt)}</div>
      )
    }
  </TaskContext.Consumer>
);

const DueDatePreview = (props) => {
  const renderArrearsLabel = (arrears) => {
    const { endDate, rentOverdueDays, startDate } = arrears;

    return (
      <div className={`text-danger`}>
        {formatDate(startDate, 'shortDayMonthYear')} -{' '}
        {formatDate(endDate, 'shortDayMonthYear')}
        <br className="d-none d-md-block" />
        {rentOverdueDays > 0 ? `(${rentOverdueDays} days in arrears)` : ''}
      </div>
    );
  };

  const renderDueDateLabel = (dueDate, reminderDate, status) => {
    const { isManager } = props;
    const isCompleted = status === 'completed';

    const isAction =
      isManager &&
      reminderDate &&
      !isInPast(reminderDate) &&
      (isInPast(dueDate) || reminderDate < dueDate);

    const classname = isAction
      ? 'text-primary'
      : isInPast(dueDate) && !isCompleted
      ? 'text-danger'
      : 'text-muted';

    return dueDate ? (
      <div className={`text-truncate ${classname}`}>
        {formatDate(dueDate, 'shortDayMonthYear')}
      </div>
    ) : null;
  };

  return (
    <TaskContext.Consumer>
      {({ arrears, dueDate, reminderDate, status }) =>
        arrears
          ? renderArrearsLabel(arrears)
          : renderDueDateLabel(dueDate, reminderDate, status)
      }
    </TaskContext.Consumer>
  );
};

const Edit = () => (
  <TaskContext.Consumer>
    {() => <ButtonIcon icon={['far', 'chevron-right']} color="muted" />}
  </TaskContext.Consumer>
);

const IntentionStatus = () => (
  <TaskContext.Consumer>
    {({ intentionStatus }) => {
      return (
        intentionStatus && (
          <TaskIcon value={intentionStatus.icon}>
            <span className="small">{intentionStatus.label}</span>
          </TaskIcon>
        )
      );
    }}
  </TaskContext.Consumer>
);

const Priority = () => (
  <TaskContext.Consumer>
    {({ categoryLabel, priority }) => {
      return (
        <TaskIcon value={priority}>
          <Task.Type />
          {categoryLabel && (
            <>
              <br className="d-none d-md-block" />
              <small className="ml-2 ml-md-0">{categoryLabel}</small>
            </>
          )}
        </TaskIcon>
      );
    }}
  </TaskContext.Consumer>
);

const Property = () => (
  <TaskContext.Consumer>
    {({ propertyAddress }) => {
      const { postcode, state, street, suburb } = propertyAddress || {};

      return street ? (
        <div className="text-muted small">
          {street},<br className="d-none d-lg-block" />
          {suburb}, {state}, {postcode}
        </div>
      ) : null;
    }}
  </TaskContext.Consumer>
);

const PropertyPreview = () => (
  <TaskContext.Consumer>
    {({ propertyAddress }) => {
      const { street } = propertyAddress || {};

      return street ? (
        <div className="text-muted text-truncate">{street}</div>
      ) : null;
    }}
  </TaskContext.Consumer>
);

const Status = () => (
  <TaskContext.Consumer>
    {({ isArrear, taskStatus }) => {
      return isArrear ? (
        <span className="small text-danger">Awaiting payment</span>
      ) : (
        <TaskIcon value={taskStatus.custom ? 'custom' : taskStatus.key}>
          <span className="small">
            {typeof taskStatus.key === 'string'
              ? taskStatus.key.replace(/_/g, ' ')
              : taskStatus.key}
          </span>
        </TaskIcon>
      );
    }}
  </TaskContext.Consumer>
);

const Title = () => (
  <TaskContext.Consumer>
    {({ hasWorkOrder, inspectionReportId, title, tradieJobId, taskType }) => (
      <strong className="text-capitalize text-task-title">
        <IconInspectionReport
          className="mr-1"
          inspectionReportId={inspectionReportId}
        />
        <IconJob
          className="mr-1"
          hasWorkOrder={hasWorkOrder}
          tradieJobId={tradieJobId}
        />
        {taskType.key === 'arrear'
          ? 'Rent is overdue'
          : title.length > 40
          ? title.slice(0, 37) + '...'
          : title}
      </strong>
    )}
  </TaskContext.Consumer>
);

const Type = () => (
  <TaskContext.Consumer>
    {({ taskType, isArrear }) => {
      return (
        <small className="text-dark">
          {isArrear ? 'Arrears' : startCase(taskType.key)}
        </small>
      );
    }}
  </TaskContext.Consumer>
);

export const Task = (props) => (
  <TaskContext.Provider {...props}>{props.children}</TaskContext.Provider>
);

Task.propTypes = {
  children: PropTypes.node.isRequired,
};

DueDate.propTypes = {
  isManager: PropTypes.bool,
};

DueDatePreview.propTypes = {
  isManager: PropTypes.bool,
};

Task.Action = Action;
Task.Assignee = Assignee;
Task.Card = TaskCard;
Task.CardPreview = TaskCardPreview;
Task.Description = Description;
Task.DueDate = DueDate;
Task.DueDatePreview = DueDatePreview;
Task.Edit = Edit;
Task.IntentionStatus = IntentionStatus;
Task.Property = Property;
Task.PropertyPreview = PropertyPreview;
Task.Priority = Priority;
Task.Status = Status;
Task.Title = Title;
Task.Type = Type;
Task.CreatedAt = CreatedAt;
