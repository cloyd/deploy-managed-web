import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useMessageClasses } from '../../hooks';
import { USER_TYPES } from '../../redux/users';
import { formatDate, toClassName } from '../../utils';
import { CardPlain } from '../Card';
import { Link, LinkUser } from '../Link';
import { UserAvatar } from '../User';
import { LinkifyWithNewTab } from './LinkifyWithNewTab';

export const TaskMessage = (props) => {
  const {
    activity,
    creatorType,
    isFullWidth,
    isManager,
    isMarketplaceEnabled,
  } = props;

  const {
    body,
    createdAt,
    fromAvatarUrl,
    fromId,
    fromName,
    fromType,
    verb,
    auditableType,
    creditorId,
    toDescriptiveName,
  } = activity;

  const isTaskQuote = auditableType === 'PropertyTaskQuote';
  const isCreator = creatorType === fromType;
  const className = useMessageClasses(isCreator);

  const replyTo = useMemo(() => {
    const { fromType, toAgency, toOwner, toTenant } = activity;

    if (toOwner && toTenant && toAgency) {
      return 'All ';
    }

    if (fromType.toLowerCase() !== USER_TYPES.owner && toOwner) {
      return 'Owner ';
    }

    if (fromType.toLowerCase() !== USER_TYPES.tenant && toTenant) {
      return 'Tenant ';
    }

    if (toAgency) {
      return 'Agency ';
    }

    return ' ';
  }, [activity]);

  return (
    <div className={toClassName([className.outer], body ? '' : 'mb-2')}>
      <div className={toClassName([className.inner], body ? '' : 'w-100')}>
        <UserAvatar
          className="ml-1 mr-2"
          role={fromType}
          size={0.65}
          user={{ avatarUrl: fromAvatarUrl }}
        />
        <span className="text-muted">
          <LinkUser
            hasLink={isManager}
            userId={creditorId || fromId}
            userName={fromName}
            userType={fromType.toLowerCase()}
          />
          <small>
            {body ? (
              <span> {verb} </span>
            ) : (
              <strong className="text-secondary"> {verb} </strong>
            )}
            <span> {replyTo} </span>
            <span className="text-capitalize">
              {isTaskQuote && isManager && !isMarketplaceEnabled ? (
                <Link to={`/contacts/creditors/${creditorId}`}>
                  {toDescriptiveName}
                </Link>
              ) : isTaskQuote ? (
                <>{toDescriptiveName ?? ''}</>
              ) : null}
            </span>
            <span>on {formatDate(createdAt, 'shortWithTime')}</span>
          </small>
        </span>
      </div>
      {body && (
        <div className={isFullWidth ? 'w-100' : 'w-75'}>
          <CardPlain
            className={toClassName(
              ['border', 'mr-1'],
              isTaskQuote ? 'alert-warning' : ''
            )}>
            <LinkifyWithNewTab linkifyText={body} />
          </CardPlain>
        </div>
      )}
    </div>
  );
};

TaskMessage.defaultProps = {
  activity: {},
  creatorType: '',
  isFullWidth: false,
  isManager: false,
  isMarketplaceEnabled: false,
};

TaskMessage.propTypes = {
  activity: PropTypes.object,
  creatorType: PropTypes.string,
  isFullWidth: PropTypes.bool,
  isManager: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
};
