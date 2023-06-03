import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { ReportWithType } from '.';
import { usePrevious } from '../../hooks';
import { Filter } from '../../modules/Filter';
import { Header } from '../../modules/Header';
import {
  ReportEfficiencyCards,
  validateReportParams,
} from '../../modules/Report';
import { fetchReportEfficiency, getReport } from '../../redux/report';
import { toQueryObject } from '../../utils';

const ReportsEfficiencyComponent = (props) => {
  const { fetchReportEfficiency, isLoading, location, report } = props;
  const prevSearch = usePrevious(location.search);

  const handleSubmit = useCallback(
    (params) => {
      fetchReportEfficiency({ ...params });
    },
    [fetchReportEfficiency]
  );

  useEffect(() => {
    if (!prevSearch && location.search) {
      const searchParams = toQueryObject(location.search);

      if (validateReportParams(searchParams)) {
        fetchReportEfficiency({ ...searchParams });
      }
    }
  }, [fetchReportEfficiency, location, prevSearch]);

  return (
    <Filter name="reports" isSaved={true} isUpdateUrlOnChange={true}>
      <Header title="Efficiency Reports" isLoading={isLoading} />
      <Container>
        <ReportWithType
          location={location}
          onSubmit={handleSubmit}
          onValidateParams={validateReportParams}
        />
        <ReportEfficiencyCards
          pathname={location.pathname}
          report={report.efficiency}
          searchParams={location.search}
        />
      </Container>
    </Filter>
  );
};

ReportsEfficiencyComponent.propTypes = {
  fetchReportEfficiency: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  location: PropTypes.object.isRequired,
  report: PropTypes.object,
};

const mapStateToProps = (state) => ({
  isLoading: state.profile.isLoading || state.report.isLoading,
  report: getReport(state),
});

const mapDispatchToProps = { fetchReportEfficiency };

export const ReportsEfficiency = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsEfficiencyComponent);
