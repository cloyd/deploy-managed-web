import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';

import { formatDate } from '../../../utils';
import { AttachmentsModule } from '../../Attachments';
import { UserAvatar } from '../../User';

export const InspectionAreaItemComment = (props) => {
  const { user, role } = props;
  const { name, note, notedAt, attachments } = user;

  return (
    <div className="d-flex mb-4 mb-md-3 overflow-hidden">
      <div className="d-block w-100 pr-2 text-break">
        <p className="mb-1">{note || ''}</p>
        {name && (
          <div className="d-flex align-items-center">
            <UserAvatar className="mr-1" role={role} size={0.5} user={user} />
            <small className="text-capitalize text-muted">
              {name}
              {notedAt ? ` - ${formatDate(notedAt, 'timeShortDate')}` : ''}
            </small>
          </div>
        )}
      </div>
      {attachments && (
        <AttachmentsModule
          attachableId={props.attachableId}
          attachableType={props.attachableType}
          attachments={attachments}
          title={`${startCase(role)} attachments`}
          onDestroyComplete={props.onDestroyComplete}
        />
      )}
    </div>
  );
};

InspectionAreaItemComment.propTypes = {
  attachableId: PropTypes.number,
  attachableType: PropTypes.string,
  onDestroyComplete: PropTypes.func,
  role: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    note: PropTypes.string,
    notedAt: PropTypes.string,
    attachments: PropTypes.array,
  }),
};
