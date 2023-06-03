import camelCase from 'lodash/fp/camelCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';

import {
  ReportCardsLinkValue,
  ReportFooter,
  ReportHeading,
  useLinkSearchParams,
} from '..';
import {
  PROPERTY_GAIN_REASON,
  PROPERTY_LOST_REASON,
} from '../../../redux/property';
import { toQueryObject } from '../../../utils';
import { CardPlain, CardStatisticTitle, CardStatisticValue } from '../../Card';
import '../styles.scss';

const getReportStatisticValue = (reportStatistics = {}, type = '') =>
  reportStatistics[camelCase(type)] || 0;

export const ReportManagementCards = ({
  onExport,
  pathname,
  report,
  searchParams,
}) => {
  const [totalReport, setTotalReport] = useState({ gain: 0, lost: 0 });
  const { gain, lost } = report || {};
  const showReport = gain && lost;

  useEffect(() => {
    if (gain || lost) {
      setTotalReport({
        gain: Object.keys(PROPERTY_GAIN_REASON).reduce(
          (acc, curr) => acc + getReportStatisticValue(gain, curr),
          0
        ),
        lost: Object.keys(PROPERTY_LOST_REASON).reduce(
          (acc, curr) => acc + getReportStatisticValue(lost, curr),
          0
        ),
      });
    }
  }, [gain, lost]);

  const linkSearchParams = useLinkSearchParams(searchParams);

  const handleExport = useCallback(
    (category) => () => {
      if (onExport) {
        onExport(category)({ params: toQueryObject(searchParams) });
      }
    },
    [onExport, searchParams]
  );

  return !showReport ? (
    <Col className="py-5 text-center">No entries found</Col>
  ) : (
    <div>
      <ReportHeading
        title="Gained Managements"
        onExport={handleExport('gain')}
      />
      <CardPlain>
        <Row>
          {Object.keys(PROPERTY_GAIN_REASON).map((value) => (
            <Col key={`property-gain-${value}`} className="mb-3" sm={6} lg={3}>
              <CardStatisticTitle title={PROPERTY_GAIN_REASON[value]} />
              <CardStatisticValue>
                <ReportCardsLinkValue
                  to={`${pathname}/gain/${value}${linkSearchParams}`}
                  title={PROPERTY_GAIN_REASON[value]}
                  value={getReportStatisticValue(gain, value)}
                  className="report-value"
                />
              </CardStatisticValue>
            </Col>
          ))}
        </Row>
      </CardPlain>
      <ReportFooter
        information={[{ label: 'TOTAL GAINED', value: totalReport.gain }]}
      />
      <ReportHeading title="Lost Managements" onExport={handleExport('lost')} />
      <CardPlain>
        <Row>
          {Object.keys(PROPERTY_LOST_REASON).map((value) => (
            <Col key={`property-gain-${value}`} className="mb-3" sm={6} lg={3}>
              <CardStatisticTitle title={PROPERTY_LOST_REASON[value]} />
              <CardStatisticValue>
                <ReportCardsLinkValue
                  to={`${pathname}/lost/${value}${linkSearchParams}`}
                  title={PROPERTY_LOST_REASON[value]}
                  value={getReportStatisticValue(lost, value)}
                  className="report-value"
                />
              </CardStatisticValue>
            </Col>
          ))}
        </Row>
      </CardPlain>
      <ReportFooter
        information={[{ label: 'TOTAL LOST', value: totalReport.lost }]}
      />
    </div>
  );
};

ReportManagementCards.propTypes = {
  onExport: PropTypes.func,
  pathname: PropTypes.string,
  report: PropTypes.object,
  searchParams: PropTypes.string,
};

ReportManagementCards.defaultProps = {
  pathname: '',
  searchParams: '',
};
