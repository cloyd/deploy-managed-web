import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Container } from 'reactstrap';

import { BrandLogo } from '../../../modules/Brand';
import { Filter } from '../../../modules/Filter';
import { Header } from '../../../modules/Header';
import { Link } from '../../../modules/Link';
import { Pagination } from '../../../modules/Pagination';
import {
  ReportHeading,
  ReportOverviewManagersTable,
} from '../../../modules/Report';
import {
  exportManagerReportCSV,
  fetchReportManagersDetail,
  getReport,
  getReportIsLoading,
} from '../../../redux/report';
import { toQueryObject } from '../../../utils';

const ReportsDetailManagerComponent = (props) => {
  const {
    exportManagerReportCSV,
    fetchReportManagersDetail,
    isLoading,
    location,
    report,
  } = props;

  const params = useMemo(
    () => toQueryObject(location.search),
    [location.search]
  );

  const handleExport = useCallback(
    () => exportManagerReportCSV(params),
    [exportManagerReportCSV, params]
  );

  useEffect(() => {
    if (params.resourceType) {
      fetchReportManagersDetail(params);
    }
  }, [fetchReportManagersDetail, params]);

  return (
    <Filter name="reports" isSaved={true}>
      <Header title="Snapshot report details" isLoading={isLoading}>
        <BrandLogo className="d-none d-print-block" />
        <Link
          className="d-print-none"
          replace
          to={{
            pathname: params?.sourceUrl === 'dashboard' ? '/' : '/reports',
            search: location.search,
          }}>
          {params?.sourceUrl === 'dashboard'
            ? 'Back to Dashboard'
            : 'Back to Snapshot'}
        </Link>
      </Header>
      <Container>
        {isLoading ? (
          <div className="d-block text-center m-5">
            <PulseLoader color="#dee2e6" />
          </div>
        ) : (
          <>
            <ReportHeading title="Properties per PM" onExport={handleExport} />
            <ReportOverviewManagersTable managers={report.detail.managers} />
            <Pagination className="d-print-none mt-3" name="managers" />
          </>
        )}
      </Container>
    </Filter>
  );
};

ReportsDetailManagerComponent.propTypes = {
  exportManagerReportCSV: PropTypes.func.isRequired,
  fetchReportManagersDetail: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  report: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isLoading: getReportIsLoading(state),
    report: getReport(state),
  };
};

const mapDispatchToProps = {
  exportManagerReportCSV,
  fetchReportManagersDetail,
};

export const ReportsDetailManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsDetailManagerComponent);
