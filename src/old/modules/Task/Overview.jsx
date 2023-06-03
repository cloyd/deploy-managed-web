import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader } from 'reactstrap';

import { ButtonEdit } from '@app/modules/Button';
import { CardImage, CardPlain } from '@app/modules/Card';
import { HeaderTitle } from '@app/modules/Header';
import { IconJob } from '@app/modules/Marketplace';
import { useRolesContext } from '@app/modules/Profile';
import {
  TaskBackButton,
  TaskContent,
  TaskFollowers,
  TaskOverviewDetails,
} from '@app/modules/Task';
import { featureImage, formatDate, imageSrcMedium } from '@app/utils';

export const TaskOverview = ({ task, property }) => {
  const { isManager } = useRolesContext();

  const category = useMemo(() => {
    if (task.id) {
      let text = task.isArrear ? 'Arrears' : startCase(task.taskType.key);

      if (task.categoryLabel) {
        text += ` - ${task.categoryLabel}`;
      }

      return text;
    }
  }, [task.id, task.taskType, task.isArrear, task.categoryLabel]);

  const dueDate = useMemo(() => {
    if (task.dueDate) {
      return `Due date: ${formatDate(task.dueDate)}`;
    }
  }, [task.dueDate]);

  const reminder = useMemo(() => {
    if (isManager && task.reminderDate) {
      return `Action date: ${formatDate(task.reminderDate)}`;
    }
  }, [isManager, task.reminderDate]);

  const rentOverdue = useMemo(() => {
    if (property.arrears?.rentOverdueDays > 0) {
      return `Payment overdue by: ${property.arrears.rentOverdueDays} days`;
    }
  }, [property]);

  const alert = useMemo(() => {
    let color = 'primary';
    let className = 'd-flex p-0 mb-3 text-dark';

    if (task.priority === 'emergency') {
      color = 'danger';
      className += ' alert-danger';
    } else {
      className += ' border-400';
    }

    return { color, className };
  }, [task.priority]);

  const imgSrc = useMemo(() => {
    return imageSrcMedium(featureImage(task.attachments));
  }, [task.attachments]);

  return (
    <div data-testid="task-overview">
      <Card>
        <CardHeader className="d-flex justify-content-between bg-transparent border-400">
          <TaskBackButton />
          <TaskFollowers task={task} />
        </CardHeader>
        <CardBody>
          <div className="d-flex justify-content-between">
            <HeaderTitle className="mb-2 text-dark">
              <IconJob
                className="mb-1 mr-1"
                hasWorkOrder={task.hasWorkOrder}
                size="xs"
                tradieJobId={task.tradieJobId}
              />
              {task.title}
            </HeaderTitle>
            <Link to={`/property/${task.propertyId}/tasks/${task.id}/edit`}>
              <ButtonEdit>Edit</ButtonEdit>
            </Link>
          </div>
          <div className="small mb-3">
            {category && <p className="mb-1">{category}</p>}
            {task.assigneeName && (
              <p className="mb-1">Assigned to: {task.assigneeName}</p>
            )}
            {reminder && <p className="mb-0">{reminder}</p>}
            {dueDate && <p className="mb-0">{dueDate}</p>}
            {rentOverdue && <p className="mb-0">{rentOverdue}</p>}
          </div>
          {imgSrc.length > 0 ? (
            <CardImage
              color={alert.color}
              className={alert.className}
              src={imgSrc}>
              <TaskContent
                task={task}
                color={alert.color}
                badge={task.priority}
              />
            </CardImage>
          ) : (
            <CardPlain color={alert.color} className={alert.className}>
              <TaskContent
                task={task}
                color={alert.color}
                badge={task.priority}
              />
            </CardPlain>
          )}
          <TaskOverviewDetails task={task} />
        </CardBody>
      </Card>
    </div>
  );
};

TaskOverview.propTypes = {
  task: PropTypes.object,
  taskMeta: PropTypes.object,
  property: PropTypes.object,
};

TaskOverview.defaultProps = {
  task: {},
  taskMeta: {},
  property: {},
};
