import startCase from 'lodash/fp/startCase';
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
  ReportManagementGainTable,
  ReportManagementLostTable,
} from '../../../modules/Report';
import {
  exportManagementReportCSV,
  fetchReportManagementsDetail,
  getReport,
  getReportIsLoading,
} from '../../../redux/report';
import { toQueryObject } from '../../../utils';

const ReportsDetailManagementComponent = (props) => {
  const {
    category,
    exportManagementReportCSV,
    fetchReportManagementsDetail,
    isLoading,
    location,
    report,
    type,
  } = props;
  const isGainManagements = category === 'gain';

  const isValidCategory = useMemo(
    () => ['gain', 'lost'].includes(category),
    [category]
  );

  const params = useMemo(
    () => ({ ...toQueryObject(location.search), category, type }),
    [category, location.search, type]
  );

  const title = useMemo(() => {
    const gainOrLostText = isGainManagements ? 'gained' : 'lost';
    return type
      ? `Property managements ${gainOrLostText} via ${startCase(type)}`
      : 'Efficiency report details';
  }, [isGainManagements, type]);

  const handleExport = useCallback(
    () => exportManagementReportCSV(params),
    [exportManagementReportCSV, params]
  );

  useEffect(() => {
    if (isValidCategory && params.resourceType) {
      fetchReportManagementsDetail(params);
    }
  }, [category, fetchReportManagementsDetail, isValidCategory, params, type]);

  return (
    <Filter name="reports" isSaved={true}>
      <Header
        title={`${startCase(category)} Report Details`}
        isLoading={isLoading}>
        <BrandLogo className="d-none d-print-block" />
        <Link
          className="d-print-none"
          replace
          to={{
            pathname: '/reports/management',
            search: location.search,
          }}>
          Back to Gain/Lost Managements
        </Link>
      </Header>
      {!isValidCategory ? (
        <div className="d-block text-center m-5">
          <p>Invalid property management category &quot;{category}&quot;</p>
        </div>
      ) : isLoading ? (
        <div className="d-block text-center m-5">
          <PulseLoader color="#dee2e6" />
        </div>
      ) : (
        <Container className="py-3">
          <ReportHeading title={title} onExport={handleExport} />
          {isGainManagements ? (
            <ReportManagementGainTable
              propertyManagements={report.detail.managements}
            />
          ) : (
            <ReportManagementLostTable
              propertyManagements={report.detail.managements}
            />
          )}
          <Pagination
            className="d-print-none mt-3"
            name="property_managements"
          />
        </Container>
      )}
    </Filter>
  );
};

ReportsDetailManagementComponent.propTypes = {
  category: PropTypes.string,
  exportManagementReportCSV: PropTypes.func.isRequired,
  fetchReportManagementsDetail: PropTypes.func.isRequired,
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
    category: matchParams.category,
    isLoading: getReportIsLoading(state),
    report: getReport(state),
    type: matchParams.type,
  };
};

const mapDispatchToProps = {
  exportManagementReportCSV,
  fetchReportManagementsDetail,
};

export const ReportsDetailManagement = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsDetailManagementComponent);
