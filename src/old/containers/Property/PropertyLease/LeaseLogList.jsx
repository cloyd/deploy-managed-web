import PropTypes from 'prop-types';
import React from 'react';

import { CardLight } from '../../../modules/Card';
import { useRolesContext } from '../../../modules/Profile';
import { LeaseLog } from './LeaseLog';

export const LeaseLogList = ({ leaseLog, payFrequency }) => {
  const { isManager } = useRolesContext();

  return (
    <CardLight style={{ maxHeight: '40vh', overflow: 'auto' }}>
      <div>
        {leaseLog.map((activity, key) => (
          <LeaseLog
            key={`activity-${activity.id}-${key}`}
            activity={activity}
            isFullWidth={true}
            isManager={isManager}
            payFrequency={payFrequency}
          />
        ))}
      </div>
    </CardLight>
  );
};

LeaseLogList.propTypes = {
  leaseLog: PropTypes.array,
  payFrequency: PropTypes.string,
};

LeaseLogList.defaultProps = {
  leaseLog: [],
};
