import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';

import managedAdminAvatar from '../../../assets/avatar.webp';
import { useMessageClasses } from '../../../hooks';
import { LinkUser } from '../../../modules/Link';
import { UserAvatar } from '../../../modules/User';
import {
  centsToDollar,
  formatDate,
  toClassName,
  toYearAmountsCents,
} from '../../../utils';

const LEASE_PROPERTY_LABELS = {
  tenantStartDate: 'Living in Property Since',
  endDate: 'Lease End',
  leaseStartDate: 'Lease Start',
  inspectionDate: 'Next Inspection',
  inspectionDateFrequency: 'Inspection Frequency',
  reviewDate: 'Next Rent Review',
  reviewDateFrequency: 'Review Frequency',
  tenantPaysWater: 'Do tenants Pay Water',
  bondCents: 'Bond Amount',
  bondNumber: 'Bond ID',
  depositCents: 'Deposit',
  terminationDate: 'Terminate Lease Date',
  terminationReason: 'Terminate Lease Reason',
};

export const LeaseLog = ({ activity, isManager, payFrequency }) => {
  const {
    body,
    changedAt,
    fromAvatarUrl: avatarUrl,
    fromId,
    changeAuthor,
    fromType,
    verb,
    oldValue,
    newValue,
    property,
    info,
  } = activity;

  const isCreator = verb === 'created';
  const className = useMessageClasses(isCreator);

  const formatValue = (value, property = '') => {
    if (typeof value === 'boolean') {
      return value ? 'yes' : 'no';
    } else if (
      typeof value === 'string' &&
      property.toLowerCase().includes('date')
    ) {
      return formatDate(value, 'short');
    } else if (
      typeof value === 'number' &&
      property.toLowerCase().includes('cents')
    ) {
      if (property.toLowerCase().includes('rent')) {
        return centsToDollar(toYearAmountsCents(value)?.[payFrequency]);
      }

      return centsToDollar(value);
    } else if (['status'].includes(property)) {
      return startCase(value);
    } else if (value === null) {
      return '-';
    }

    return value;
  };

  // show pay frequency when displaying rent log
  const formatProperty = (value) =>
    value.toLowerCase() === 'annualrentcents'
      ? `${startCase(payFrequency)} Rent`
      : LEASE_PROPERTY_LABELS[value] || startCase(value);

  return (
    <div
      className={toClassName(
        [
          className.outer,
          ...(className.outer.includes('items-end') ? ['text-right'] : []),
        ],
        body ? '' : 'mb-3'
      )}>
      <div className={toClassName([className.inner], body ? '' : 'w-100')}>
        <UserAvatar
          className="ml-1 mr-2 align-self-start"
          size={0.65}
          user={{
            avatarUrl:
              fromType?.toLowerCase() === 'administrator'
                ? managedAdminAvatar
                : avatarUrl,
          }}
        />
        <div>
          <span className="text-muted">
            <LinkUser
              hasLink={isManager}
              userId={fromId}
              userName={changeAuthor}
              userType={fromType?.toLowerCase()}
            />
            <small>
              {` ${verb === 'created' ? 'initially set' : verb} the `}
              <strong className="text-secondary">
                {formatProperty(property)}
              </strong>
              {![null, ''].includes(oldValue) && (
                <>
                  &nbsp;from&nbsp;
                  <s>{formatValue(oldValue, property)}</s>
                </>
              )}
              <span>
                &nbsp;to&nbsp;
                <strong className="text-secondary">
                  {`${formatValue(newValue, property)} `}
                </strong>
                on {formatDate(changedAt, 'shortWithTime')}
              </span>
            </small>
          </span>
          <br />
          {info && (
            <small className="text-muted">
              <i>{info}</i>
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

LeaseLog.propTypes = {
  activity: PropTypes.object,
  isManager: PropTypes.bool,
  payFrequency: PropTypes.string,
};

LeaseLog.defaultProps = {
  activity: {},
  isManager: false,
  payFrequency: 'weekly',
};
