import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  ReportOverviewPropertiesExpiredTable,
  ReportOverviewPropertiesTable,
  ReportOverviewPropertiesVacantTable,
} from '../../../modules/Report';
import {
  exportPropertyReportCSV,
  fetchReportPropertiesDetail,
  getReport,
  getReportIsLoading,
} from '../../../redux/report';
import { toQueryObject } from '../../../utils';

const ReportsDetailPropertyComponent = (props) => {
  const {
    exportPropertyReportCSV,
    fetchReportPropertiesDetail,
    isLoading,
    location,
    report,
    type,
  } = props;
  const isAllProperties = type === 'all';
  const isExpiredProperties = type === 'expired';
  const isVacantProperties = type === 'vacant';
  const [finalType, setFinalType] = useState();

  const params = useMemo(
    () => ({ ...toQueryObject(location.search), scope: type }),
    [location.search, type]
  );

  const title = useMemo(
    () =>
      isAllProperties
        ? 'All Properties'
        : `${startCase(
            finalType === 'active' ? 'leased' : finalType
          )} Properties`,
    [finalType, isAllProperties]
  );

  useEffect(() => {
    if (type) {
      if (type.indexOf('&') < 0) {
        setFinalType(type);
      } else {
        setFinalType(type.substring(0, type.indexOf('&')));
      }
    }
  }, [type]);

  const handleExport = useCallback(
    () => exportPropertyReportCSV(params),
    [exportPropertyReportCSV, params]
  );

  useEffect(() => {
    if (params.resourceType && type) {
      fetchReportPropertiesDetail(params);
    }
  }, [fetchReportPropertiesDetail, params, type]);

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
      {isLoading ? (
        <div className="d-block text-center m-5">
          <PulseLoader color="#dee2e6" />
        </div>
      ) : (
        <Container>
          <ReportHeading title={title} onExport={handleExport} />
          {isExpiredProperties ? (
            <ReportOverviewPropertiesExpiredTable
              properties={report.detail.properties}
            />
          ) : isVacantProperties ? (
            <ReportOverviewPropertiesVacantTable
              properties={report.detail.properties}
            />
          ) : (
            <ReportOverviewPropertiesTable
              type={type}
              properties={report.detail.properties}
              isRentReview={params.rentReview && params.rentReview === 'true'}
              isUpcoming={params.period && params.period >= 0}
            />
          )}
          <Pagination className="d-print-none mt-3" name="properties" />
        </Container>
      )}
    </Filter>
  );
};

ReportsDetailPropertyComponent.propTypes = {
  exportPropertyReportCSV: PropTypes.func.isRequired,
  fetchReportPropertiesDetail: PropTypes.func.isRequired,
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
  exportPropertyReportCSV,
  fetchReportPropertiesDetail,
};

export const ReportsDetailProperty = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsDetailPropertyComponent);
