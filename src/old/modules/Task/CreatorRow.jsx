import PropTypes from 'prop-types';
import React from 'react';

import { CardImage, CardPlain } from '@app/modules/Card';
import { TaskContent } from '@app/modules/Task';
import { UserAvatar } from '@app/modules/User';
import { featureImage, formatDate, imageSrcThumb } from '@app/utils';

export const TaskCreatorRow = (props) => {
  const { className, task } = props;
  const imageSrc = imageSrcThumb(featureImage(task.attachments));

  return (
    <div className={className}>
      <div className="d-flex align-items-center">
        <UserAvatar
          className="mx-1"
          role={task.creatorType}
          size={0.65}
          user={{ avatarUrl: task.creatorAvatarUrl }}
        />
        <small className="text-muted">
          <span className="text-capitalize">{task.creatorName}</span> -{' '}
          {formatDate(task.createdAt, 'timeShortDate')}
        </small>
      </div>
      {imageSrc.length > 0 ? (
        <CardImage src={imageSrc}>
          <TaskContent task={task} />
        </CardImage>
      ) : (
        <CardPlain>
          <TaskContent task={task} />
        </CardPlain>
      )}
    </div>
  );
};

TaskCreatorRow.defaultProps = {
  className: '',
  task: {},
};

TaskCreatorRow.propTypes = {
  className: PropTypes.string,
  task: PropTypes.object,
};
