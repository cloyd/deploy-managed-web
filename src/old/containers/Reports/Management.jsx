import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Col, Container } from 'reactstrap';

import { ReportWithType } from '.';
import { usePrevious } from '../../hooks';
import { Filter } from '../../modules/Filter';
import { Header } from '../../modules/Header';
import {
  ReportManagementCards,
  validateReportParams,
} from '../../modules/Report';
import {
  exportManagementReportCSV,
  fetchReportManagement,
  getReport,
  getReportIsLoading,
} from '../../redux/report';
import { toQueryObject } from '../../utils';

const ReportsManagementComponent = (props) => {
  const {
    exportManagementReportCSV,
    fetchReportManagement,
    isLoading,
    location,
    report,
  } = props;
  const prevSearch = usePrevious(location.search);

  const handleExport = useCallback(
    (category) =>
      ({ params }) =>
        exportManagementReportCSV({ ...params, category }),
    [exportManagementReportCSV]
  );

  const handleSubmit = useCallback(
    (params) => fetchReportManagement(params),
    [fetchReportManagement]
  );

  useEffect(() => {
    if (!prevSearch && location.search) {
      const searchParams = toQueryObject(location.search);

      if (validateReportParams(searchParams)) {
        fetchReportManagement(searchParams);
      }
    }
  }, [fetchReportManagement, location, prevSearch]);

  return (
    <Filter name="reports" isSaved={true} isUpdateUrlOnChange={true}>
      <Header title="Gain/Lost Managements" />
      <Container>
        <ReportWithType
          isLoading={isLoading}
          location={location}
          onExport={handleExport()}
          onSubmit={handleSubmit}
          onValidateParams={validateReportParams}
        />
        {isLoading ? (
          <Col className="pt-5 text-center">
            <PulseLoader color="#dee2e6" />
          </Col>
        ) : (
          <ReportManagementCards
            pathname={location.pathname}
            report={report}
            searchParams={location.search}
            onExport={handleExport}
          />
        )}
      </Container>
    </Filter>
  );
};

ReportsManagementComponent.propTypes = {
  exportManagementReportCSV: PropTypes.func.isRequired,
  fetchReportManagement: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  report: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isLoading: getReportIsLoading(state),
    report: getReport(state).management || {},
  };
};

const mapDispatchToProps = {
  exportManagementReportCSV,
  fetchReportManagement,
};

export const ReportsManagement = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsManagementComponent);
