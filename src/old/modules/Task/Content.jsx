import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';

import { LinkifyWithNewTab } from '@app/modules/Task';
import { UploaderFiles } from '@app/modules/Uploader';

export const TaskContent = ({ task, color, badge }) => {
  const { attachments, description, isArrear } = task;
  const hasAttachments = attachments && attachments.length > 0;

  return (
    <>
      {!!badge && (
        <Badge color={color || 'primary'} className="mb-2">
          {startCase(badge)}
        </Badge>
      )}
      <LinkifyWithNewTab linkifyText={description} />
      {isArrear ? ' is now overdue.' : ''}
      {hasAttachments && (
        <UploaderFiles attachments={attachments} className="small mb-0" />
      )}
    </>
  );
};

TaskContent.propTypes = {
  badge: PropTypes.string,
  color: PropTypes.string,
  task: PropTypes.object,
};
