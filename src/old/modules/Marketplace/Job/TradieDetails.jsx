import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { ExternalCreditorRecommendations } from '@app/modules/ExternalCreditor';
import { useRolesContext } from '@app/modules/Profile';

export const JobTradieDetails = ({ tradie }) => {
  const { isManager } = useRolesContext();

  return (
    <div className="border-bottom pb-3">
      <div className="px-3 px-lg-4 py-3 d-flex justify-content-between align-items-center">
        <p className="mb-0">
          <span className="font-weight-bold mb-0">{tradie.name}</span>
          {!!tradie.responseTime && (
            <small className="text-muted ml-1">
              - {tradie.responseTime} avg response time
            </small>
          )}
        </p>
        {isManager && (
          <Link to={`/marketplace/tradie/${tradie.id}`}>Full profile</Link>
        )}
      </div>
      <ExternalCreditorRecommendations tradie={tradie} isCompact />
    </div>
  );
};

JobTradieDetails.propTypes = {
  tradie: PropTypes.object,
};

JobTradieDetails.defaultProps = {
  tradie: {},
};
