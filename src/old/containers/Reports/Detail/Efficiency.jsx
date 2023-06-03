import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Container } from 'reactstrap';

import { BrandLogo } from '../../../modules/Brand';
import { Filter } from '../../../modules/Filter';
import { Header } from '../../../modules/Header';
import { Link } from '../../../modules/Link';
import { Pagination } from '../../../modules/Pagination';
import { ReportEfficiencyDetailsTable } from '../../../modules/Report';
import {
  fetchReportTasksDetail,
  getReport,
  getReportIsLoading,
} from '../../../redux/report';
import { toQueryObject } from '../../../utils';

const ReportsDetailEfficiencyComponent = (props) => {
  const { fetchReportTasksDetail, isLoading, location, report, type } = props;

  const params = useMemo(
    () => toQueryObject(location.search),
    [location.search]
  );

  const title = useMemo(
    () =>
      type
        ? `${startCase(type)} ${/task/.test(type) ? '' : 'Tasks'}`
        : 'Efficiency report details',
    [type]
  );

  useEffect(() => {
    fetchReportTasksDetail({
      ...params,
      ...(type && { scope: type }),
    });
  }, [fetchReportTasksDetail, params, type]);

  return (
    <Filter name="reports" isSaved={true}>
      <Header title="Efficiency Report Details" isLoading={isLoading}>
        <BrandLogo className="d-none d-print-block" />
        <Link
          className="d-print-none"
          replace
          to={{
            pathname: '/reports/efficiency',
            search: location.search,
          }}>
          Back to Efficiency Report
        </Link>
      </Header>
      {isLoading ? (
        <div className="d-block text-center m-5">
          <PulseLoader color="#dee2e6" />
        </div>
      ) : (
        <Container>
          <h4 className="mb-3">{title}</h4>
          <ReportEfficiencyDetailsTable tasks={report.detail.tasks} />
          <Pagination className="d-print-none mt-3" name="property_tasks" />
        </Container>
      )}
    </Filter>
  );
};

ReportsDetailEfficiencyComponent.propTypes = {
  fetchReportTasksDetail: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  report: PropTypes.object.isRequired,
  type: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  const { match } = props;
  const matchParams = match.params || {};

  return {
    isLoading: getReportIsLoading(state),
    report: getReport(state),
    type: matchParams.type,
  };
};

const mapDispatchToProps = {
  fetchReportTasksDetail,
};

export const ReportsDetailEfficiency = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsDetailEfficiencyComponent);
