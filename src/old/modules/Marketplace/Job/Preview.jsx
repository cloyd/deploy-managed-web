import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'reactstrap';

import { ButtonClose } from '@app/modules/Button';
import {
  JobDetailsForTradies,
  JobOverviewTitle,
  QuoteCtaButton,
  QuoteDeclineButton,
} from '@app/modules/Marketplace';

export const JobPreview = ({ job, onClose, quote }) => {
  return (
    <Card
      className="job-preview-container p-3"
      data-testid="marketplace-job-preview">
      {job.id ? (
        <>
          <div className="d-flex align-items-start justify-content-between border-bottom pb-2 mb-3">
            <JobOverviewTitle
              isEmergency={job.isEmergency}
              title={job.title}
              address={job.property?.address}
            />
            <ButtonClose
              className="btn mt-1 ml-2 p-0"
              direction="row"
              hasText={false}
              size="sm"
              onClick={onClose}
            />
          </div>

          <JobDetailsForTradies job={job} isPreview />
          <div className="action-buttons d-flex mt-1">
            <QuoteDeclineButton quote={quote} />
            <QuoteCtaButton job={job} quote={quote} />
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-between">
          <p className="w-100 text-center m-0">Job could not be found.</p>
          <ButtonClose
            className="btn"
            hasText={false}
            size="sm"
            onClick={onClose}
          />
        </div>
      )}
    </Card>
  );
};

JobPreview.propTypes = {
  job: PropTypes.object,
  onClose: PropTypes.func,
  quote: PropTypes.object,
};

JobPreview.defaultProps = {
  job: {},
  quote: {},
};
