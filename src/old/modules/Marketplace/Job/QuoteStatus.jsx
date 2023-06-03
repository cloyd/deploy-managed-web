import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import { useJobType } from '@app/modules/Marketplace';

export const JobQuoteStatus = ({ job }) => {
  const jobType = useJobType(job);

  return job.acceptedQuoteId ? (
    <p className="text-success text-capitalize">
      <FontAwesomeIcon icon={['far', 'check']} className="mr-2" />
      {jobType} Accepted
    </p>
  ) : null;
};

JobQuoteStatus.propTypes = {
  job: PropTypes.object,
};
