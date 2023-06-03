import PropTypes from 'prop-types';
import React from 'react';

import { useMessageClasses } from '../../../hooks';
import { formatDate } from '../../../utils';
import { CardPlain } from '../../Card';
import { LinkUser } from '../../Link';
import { UserAvatar } from '../../User';

export const JobMessage = (props) => {
  const {
    createdAt,
    fromAvatarUrl,
    fromId,
    fromName,
    fromType,
    hasLink,
    isActivityMessage,
    isCreator,
    isFullWidth,
  } = props;

  const className = useMessageClasses(isCreator, isActivityMessage);

  return (
    <div className={className.outer} data-testid="job-message-card">
      <div className={className.inner}>
        <UserAvatar
          className="mx-1"
          role={fromType}
          size={0.65}
          user={{ avatarUrl: fromAvatarUrl }}
        />
        <span>
          <LinkUser
            hasLink={hasLink}
            userId={fromId}
            userName={fromName}
            userType={fromType}
          />
          <small className="text-muted">
            {' '}
            - {formatDate(createdAt, 'timeShortDate')}
          </small>
        </span>
      </div>
      <div className={isFullWidth ? 'w-100' : 'd-flex'}>
        <CardPlain className={className.card}>{props.children}</CardPlain>
      </div>
    </div>
  );
};

JobMessage.defaultProps = {
  isActivityMessage: false,
  isFullWidth: false,
};

JobMessage.propTypes = {
  children: PropTypes.node,
  createdAt: PropTypes.string,
  fromAvatarUrl: PropTypes.string,
  fromId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fromName: PropTypes.string,
  fromType: PropTypes.string,
  hasLink: PropTypes.bool,
  isActivityMessage: PropTypes.bool,
  isCreator: PropTypes.bool,
  isFullWidth: PropTypes.bool,
};
