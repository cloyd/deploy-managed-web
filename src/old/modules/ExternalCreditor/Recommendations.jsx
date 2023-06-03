import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

export const ExternalCreditorRecommendations = ({ isCompact, tradie }) => {
  const stats = useMemo(() => {
    if (!tradie.stats) return [];

    if (isCompact) {
      return tradie.stats.filter(([label]) => label !== 'Insurance document');
    }

    return tradie.stats;
  }, [isCompact, tradie.stats]);

  return (
    <div className="text-center px-3 d-flex">
      {stats.map(([label, value], index) => (
        <div
          className={`w-100 px-1 d-flex flex-column justify-content-between ${
            index < stats.length - 1 ? 'border-right' : null
          }`}
          key={`recommendation-${index}`}>
          <small className="d-block text-muted">
            {label === 'Recommended by' && (
              <FontAwesomeIcon
                className="mr-1 text-muted"
                icon={['far', 'thumbs-up']}
                size="sm"
              />
            )}
            {label}
          </small>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
};

ExternalCreditorRecommendations.propTypes = {
  isCompact: PropTypes.bool,
  tradie: PropTypes.object,
};
