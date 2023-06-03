import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Col, Row } from 'reactstrap';

import {
  ReportCardsLinkValue,
  ReportOverviewInputMultiple,
  ReportOverviewLandlords,
  calculateAami,
  useLinkSearchParams,
  useValuationMultiple,
} from '..';
import {
  centsToDollar,
  toDollarFormattedAmount,
  toPercent,
} from '../../../utils';
import { CardStatistic, CardStatisticValue } from '../../Card';
import { Link } from '../../Link';

export const ReportOverviewCards = (props) => {
  const { pathname, report } = props;
  const showReport = report && Object.keys(report).length > 0;

  const linkSearchParams = useLinkSearchParams(props.searchParams);
  const [multiple, updateMultiple] = useValuationMultiple();

  const aami = useMemo(
    () =>
      calculateAami(report.averageWeeklyRentCents, report.averageManagmentFee),
    [report.averageManagmentFee, report.averageWeeklyRentCents]
  );

  const valuationInCents = useMemo(
    () => multiple * aami * report.totalPropertiesCount,
    [aami, multiple, report.totalPropertiesCount]
  );

  return (
    <Row>
      {!showReport ? (
        <Col className="py-4 text-center">No entries found</Col>
      ) : (
        <>
          <Col xs={6} lg={3} className="pb-3">
            <CardStatistic title="Rent Roll Valuation" className="h-100">
              <CardStatisticValue>
                <ReportCardsLinkValue
                  to={`${pathname}/valuation${linkSearchParams}`}
                  title="Rent Roll Valuation"
                  value={toDollarFormattedAmount(valuationInCents)}
                />
              </CardStatisticValue>
              <div className="d-block text-center">
                <span className="text-muted">AAMI {centsToDollar(aami)}</span>
              </div>
              <ReportOverviewInputMultiple
                className="d-flex align-items-center mt-3"
                defaultValue={multiple}
                onChange={updateMultiple}
              />
            </CardStatistic>
          </Col>

          <Col xs={6} lg={3} className="pb-3">
            <CardStatistic title="Average Rent / Week" className="h-100">
              <CardStatisticValue>
                <ReportCardsLinkValue
                  to={`${pathname}/valuation${linkSearchParams}`}
                  title="Average Rent / Week"
                  value={centsToDollar(report.averageWeeklyRentCents)}
                />
              </CardStatisticValue>
            </CardStatistic>
          </Col>

          <Col xs={6} lg={3} className="pb-3">
            <CardStatistic title="Average Management Fee" className="h-100">
              <CardStatisticValue>
                <ReportCardsLinkValue
                  to={`${pathname}/valuation${linkSearchParams}`}
                  title="Average Management Fee"
                  value={`${toPercent(report.averageManagmentFee)}%`}
                />
              </CardStatisticValue>
            </CardStatistic>
          </Col>

          <Col xs={6} lg={3} className="pb-3">
            <CardStatistic title="Properties Per PM" className="h-100">
              <CardStatisticValue>
                <ReportCardsLinkValue
                  to={`${pathname}/managers${linkSearchParams}`}
                  title="Properties Per PM"
                  value={report.averagePropertiesPerManager}
                />
              </CardStatisticValue>
            </CardStatistic>
          </Col>

          <Col xs={6} lg={3} className="pb-3">
            <CardStatistic
              title="Total Number of Properties"
              statistic={
                <ReportCardsLinkValue
                  to={`${pathname}/property/all${linkSearchParams}`}
                  title="Total Number of Properties"
                  value={report.totalPropertiesCount}
                />
              }
              className="h-100">
              <Link
                to={`${pathname}/property/active${linkSearchParams}`}
                className="d-flex justify-content-center">
                <span className="text-success">
                  {report.activeProperties} Leased
                </span>
              </Link>
              <Link
                to={`${pathname}/property/expired${linkSearchParams}`}
                className="d-flex justify-content-center">
                <span className="text-warning">
                  {report.expiredProperties} Expired
                </span>
              </Link>
              <Link
                to={`${pathname}/property/vacant${linkSearchParams}`}
                className="d-flex justify-content-center">
                <span className="text-danger">
                  {report.vacantProperties} Vacant
                </span>
              </Link>
            </CardStatistic>
          </Col>

          <Col xs={6} lg={3} className="pb-3">
            <CardStatistic title="Arrears" className="h-100">
              <CardStatisticValue>
                <ReportCardsLinkValue
                  to={`${pathname}/arrears${linkSearchParams}`}
                  title="Rent Roll Valuation"
                  value={report.leasesInArrears}
                />
              </CardStatisticValue>
            </CardStatistic>
          </Col>

          <Col xs={6} lg={3} className="pb-3">
            <CardStatistic
              title="Vacancy Rate"
              statistic={`${Math.round(report.vacancyRate)}%`}
              className="h-100"
            />
          </Col>

          <Col xs={6} lg={3} className="pb-3">
            <ReportOverviewLandlords report={report} />
          </Col>
        </>
      )}
    </Row>
  );
};

ReportOverviewCards.propTypes = {
  pathname: PropTypes.string,
  report: PropTypes.object,
  searchParams: PropTypes.string,
};

ReportOverviewCards.defaultProps = {
  pathname: '',
  searchParams: '',
};
