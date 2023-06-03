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
  ReportOverviewArrearsTable,
} from '../../../modules/Report';
import {
  exportArrearsReportCSV,
  fetchReportLeasesDetail,
  getReport,
  getReportIsLoading,
} from '../../../redux/report';
import { toQueryObject } from '../../../utils';

const ReportsDetailArrearsComponent = (props) => {
  const {
    exportArrearsReportCSV,
    fetchReportLeasesDetail,
    isLoading,
    location,
    report,
  } = props;

  const params = useMemo(
    () => ({ ...toQueryObject(location.search), scope: 'arrears' }),
    [location.search]
  );

  const handleExport = useCallback(
    () => exportArrearsReportCSV(params),
    [exportArrearsReportCSV, params]
  );

  useEffect(() => {
    if (params.resourceType) {
      fetchReportLeasesDetail(params);
    }
  }, [fetchReportLeasesDetail, params]);

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
            <ReportHeading title="Leases in Arrears" onExport={handleExport} />
            <ReportOverviewArrearsTable leases={report.detail.leases} />
            <Pagination className="d-print-none mt-3" name="leases" />
          </>
        )}
      </Container>
    </Filter>
  );
};

ReportsDetailArrearsComponent.propTypes = {
  exportArrearsReportCSV: PropTypes.func.isRequired,
  fetchReportLeasesDetail: PropTypes.func.isRequired,
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

const mapDispatchToProps = { exportArrearsReportCSV, fetchReportLeasesDetail };

export const ReportsDetailArrears = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsDetailArrearsComponent);
