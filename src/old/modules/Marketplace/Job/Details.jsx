import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { AttachmentsList } from '@app/modules/Attachments';
import { ContentWithLabel } from '@app/modules/Content';
import { Link } from '@app/modules/Link';
import { IconWorkOrder } from '@app/modules/Marketplace/IconWorkOrder';
import { JobQuoteStatus } from '@app/modules/Marketplace/Job/QuoteStatus';
import { useMarketplaceTagsToString } from '@app/modules/Marketplace/hooks';
import { centsToDollar, toClassName } from '@app/utils';

/**
 * Job details as viewed by Managers and Owners
 */
export const JobDetails = ({ isCompactView, job, link }) => {
  const tags = useMarketplaceTagsToString(job.tagIds);

  return (
    <div className="d-flex flex-column">
      <Row>
        <Col md={isCompactView ? 12 : 7}>
          {link ? (
            <Link className="w-100" to={link}>
              <JobTitle job={job} />
            </Link>
          ) : (
            <JobTitle job={job} />
          )}
          {!!tags.length && <p className="text-small">Tags: {tags}</p>}
          {link ? (
            <Link
              className="text-left"
              color="link"
              to={`${link}${
                job.acceptedQuoteId ? `?quote_id=${job.acceptedQuoteId}` : ''
              }`}>
              <JobQuoteStatus job={job} />
            </Link>
          ) : (
            <JobQuoteStatus job={job} />
          )}
          <div className="d-block d-md-flex">
            <ContentWithLabel
              className="mr-3"
              label={job.hasWorkOrder ? 'Job limit' : 'Budget'}
              value={centsToDollar(job.budgetCents)}
            />
          </div>
          <p>{job.description}</p>
        </Col>
      </Row>
      {job.attachments?.length > 0 && (
        <AttachmentsList
          attachments={job.attachments}
          className={toClassName(
            ['px-0 mt-4 mx-0'],
            isCompactView ? '' : 'w-75'
          )}
          md={isCompactView ? 6 : 3}
        />
      )}
    </div>
  );
};

JobDetails.propTypes = {
  isCompactView: PropTypes.bool,
  job: PropTypes.object,
  link: PropTypes.string,
};

JobDetails.defaultProps = {
  isCompactView: false,
  job: {},
};

const JobTitle = ({ job }) => (
  <h5 className="text-left">
    <IconWorkOrder className="mr-2" job={job} />
    {job.title}
  </h5>
);

JobTitle.propTypes = {
  job: PropTypes.object,
};
