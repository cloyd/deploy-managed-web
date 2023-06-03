import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { usePrevious } from '../../../hooks';
import { BrandLogo } from '../../../modules/Brand';
import { Filter } from '../../../modules/Filter';
import { Header } from '../../../modules/Header';
import { Link } from '../../../modules/Link';
import { Pagination } from '../../../modules/Pagination';
import { ReportRentTable, ReportTaskTable } from '../../../modules/Report';
import {
  fetchReportAggregate,
  fetchReportRent,
  fetchReportTask,
  getReport,
  getReportIsLoading,
} from '../../../redux/report';
import { formatDate, toQueryObject } from '../../../utils';

const getTitle = ({ isRent, startsAt, endsAt, reportType }) => {
  const startDate = formatDate(startsAt, 'short');
  const endDate = formatDate(endsAt, 'short');
  const prefixTitle =
    reportType === 'revenue_share_charge'
      ? 'Total Revenue Share Fees'
      : `${startCase(reportType)} paid to Agent`;

  return isRent
    ? `Management fees - ${startDate} to ${endDate}`
    : `${prefixTitle} - ${startDate} to ${endDate}`;
};

const ReportsDetailRevenueComponent = (props) => {
  const {
    fetchReportAggregate,
    fetchReportRent,
    fetchReportTask,
    location,
    match,
    report,
  } = props;
  const reportType = match.params.type;
  const isRent = reportType === 'rent';
  const feeType = location.pathname.split('/')[4];

  const params = useMemo(
    () => toQueryObject(location.search),
    [location.search]
  );

  const title = useMemo(
    () => getTitle({ ...params, isRent, reportType }),
    [params, isRent, reportType]
  );

  const paramsPrev = usePrevious(params);

  useEffect(() => {
    if (params !== paramsPrev && reportType) {
      report.tasks.length === 0 && fetchReportAggregate({ params });
      isRent
        ? fetchReportRent({ params })
        : fetchReportTask({
            params,
            reportType,
            feeType,
          });
    }
  }, [
    feeType,
    fetchReportAggregate,
    fetchReportRent,
    fetchReportTask,
    isRent,
    params,
    paramsPrev,
    report.aggregate,
    report.tasks.length,
    reportType,
  ]);

  const item = useMemo(() => {
    return isRent
      ? report.rent
      : feeType === 'revenue'
      ? report.tasks[reportType] || {}
      : report.tasksExpenses[reportType] || {};
  }, [
    feeType,
    isRent,
    report.rent,
    report.tasks,
    report.tasksExpenses,
    reportType,
  ]);

  return (
    <Filter name="reports" isSaved={true}>
      <Header title="Financials" isLoading={props.isLoading}>
        <BrandLogo className="d-none d-print-block" />
        <Link
          className="d-print-none"
          replace
          to={{
            pathname: '/reports/financials',
            search: location.search,
          }}>
          Back to Financials
        </Link>
      </Header>
      <Container>
        {isRent ? (
          <ReportRentTable item={item} title={title} />
        ) : (
          <ReportTaskTable
            item={item}
            title={title}
            properties={item.properties}
            feeType={feeType}
          />
        )}
        <Pagination
          className="d-print-none mt-3"
          name={feeType === 'revenue' ? 'income' : 'expense'}
          isReload={false}
        />
      </Container>
    </Filter>
  );
};

ReportsDetailRevenueComponent.propTypes = {
  fetchReportAggregate: PropTypes.func.isRequired,
  fetchReportRent: PropTypes.func.isRequired,
  fetchReportTask: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  report: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isLoading: getReportIsLoading(state),
  report: getReport(state),
});

const mapDispatchToProps = {
  fetchReportAggregate,
  fetchReportRent,
  fetchReportTask,
};

export const ReportsDetailRevenue = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsDetailRevenueComponent);
