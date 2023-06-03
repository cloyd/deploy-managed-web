import capitalize from 'lodash/fp/capitalize';
import upperCase from 'lodash/fp/upperCase';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Col, Row } from 'reactstrap';

import { CardPlain } from '@app/modules/Card';
import { IconWorkOrder, QuoteStatus } from '@app/modules/Marketplace';

export const PreviewCard = ({ className, job, isShowingPreview }) => {
  const quote = job.myQuote || {};

  const category = useMemo(() => {
    return capitalize(upperCase(job.category));
  }, [job.category]);

  return (
    <CardPlain
      className={className}
      classNameInner="py-2 py-md-3"
      isHideSpacing={true}>
      <Row className="align-items-center text-left">
        <Col
          lg={isShowingPreview ? 6 : 4}
          className="d-flex align-items-center px-1">
          <IconWorkOrder className="mr-2" job={job} size="xl" />
          <div className="d-flex flex-column text-truncate">
            <div className="font-weight-bold">
              {job.isEmergency && (
                <span className="text-danger">Emergency: </span>
              )}
              {job.title}
            </div>
            {job.description}
          </div>
        </Col>
        <Col xs={4} lg={2} className="px-1 py-3 py-lg-0">
          <QuoteStatus className="text-small" status={quote.status} />
        </Col>
        <Col xs={4} lg={2} className="text-small px-1 py-3 py-lg-0">
          {category}
        </Col>
        <Col xs={4} lg={2} className="text-small px-1 py-3 py-lg-0">
          {job.agencyName}
        </Col>
        {!isShowingPreview && (
          <Col lg={2} className="text-wrap text-muted small px-1 order-2">
            {job.property?.address}
          </Col>
        )}
      </Row>
    </CardPlain>
  );
};

PreviewCard.propTypes = {
  className: PropTypes.string,
  job: PropTypes.object,
  isShowingPreview: PropTypes.bool,
};
