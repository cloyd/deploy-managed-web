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
  ReportOverviewInputMultiple,
  ReportOverviewLeasesTable,
  useValuationMultiple,
} from '../../../modules/Report';
import {
  exportLeaseReportCSV,
  fetchReportLeasesDetail,
  getReport,
  getReportIsLoading,
} from '../../../redux/report';
import { toQueryObject } from '../../../utils';

const ReportsDetailLeaseComponent = (props) => {
  const {
    exportLeaseReportCSV,
    fetchReportLeasesDetail,
    isLoading,
    location,
    report,
  } = props;

  const [multiple, updateMultiple] = useValuationMultiple();

  const params = useMemo(
    () => toQueryObject(location.search),
    [location.search]
  );

  const handleExport = useCallback(
    () => exportLeaseReportCSV({ ...params, multiple, scope: 'active' }),
    [exportLeaseReportCSV, multiple, params]
  );

  useEffect(() => {
    if (params.resourceType) {
      fetchReportLeasesDetail({ ...params, scope: 'active' });
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
          {`Back to ${
            params?.sourceUrl === 'dashboard' ? 'Dashboard' : 'Snapshot'
          }`}
        </Link>
      </Header>
      {isLoading ? (
        <div className="d-block text-center m-5">
          <PulseLoader color="#dee2e6" />
        </div>
      ) : (
        <Container>
          <ReportHeading
            title="Current Rent Roll"
            onExport={handleExport}
            isExportHidden
          />
          <ReportOverviewInputMultiple
            className="mb-3 d-inline-block"
            defaultValue={multiple}
            title="Enter current estimated multiple"
            onChange={updateMultiple}
          />
          <ReportOverviewLeasesTable
            leases={report.detail.leases}
            multiple={multiple}
          />
          <Pagination className="d-print-none mt-3" name="leases" />
        </Container>
      )}
    </Filter>
  );
};

ReportsDetailLeaseComponent.propTypes = {
  exportLeaseReportCSV: PropTypes.func.isRequired,
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

const mapDispatchToProps = { exportLeaseReportCSV, fetchReportLeasesDetail };

export const ReportsDetailLease = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsDetailLeaseComponent);
