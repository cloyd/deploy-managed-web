import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Row } from 'reactstrap';

import { Filter } from '.';
import { FILTER_PERIODS } from '../../redux/report/constants';

export const FilterReport = (props) => {
  const { endsAt, onSubmit, startsAt, onClear } = props;

  return (
    <Row className="mb-2 d-print-none" data-testid="report-filters">
      <Col lg={9}>
        <Row>
          <Col md={4} className="mb-2">
            <Filter.Dropdown
              label="Period"
              name="period"
              values={Object.keys(FILTER_PERIODS)}
            />
          </Col>
          <Col md={8} className="mb-2 d-flex">
            <Filter.Date name="startsAt" label="From" value={startsAt} />
            <Filter.Date name="endsAt" label="To" value={endsAt} />
          </Col>
        </Row>
      </Col>
      <Col lg={3}>
        <Row>
          <Col
            xs={{ size: 4, offset: 2 }}
            md={{ size: 3, offset: 3 }}
            lg={{ size: 6, offset: 0 }}
            className="mb-2 mt-1 text-center">
            <Filter.Clear onClick={onClear} />
          </Col>
          <Col xs={4} md={3} lg={6} className="mb-2">
            <Button
              className="mt-1 w-100"
              color="primary"
              data-testid="filter-report-btn"
              disabled={!startsAt || !endsAt}
              size="md"
              onClick={onSubmit}>
              Filter
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

FilterReport.propTypes = {
  endsAt: PropTypes.instanceOf(Date),
  location: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  startsAt: PropTypes.instanceOf(Date),
};

FilterReport.defaultProps = {
  endsAt: new Date(),
  startsAt: new Date(),
};
