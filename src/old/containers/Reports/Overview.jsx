import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { ReportWithType } from '.';
import { usePrevious } from '../../hooks';
import { Filter } from '../../modules/Filter';
import { Header } from '../../modules/Header';
import { ReportOverviewCards } from '../../modules/Report';
import { fetchReportOverview, getReport } from '../../redux/report';
import { toQueryObject } from '../../utils';

const ReportsOverviewComponent = (props) => {
  const { fetchReportOverview, isLoading, location, report } = props;
  const prevSearch = usePrevious(location.search);

  const handleSubmit = useCallback(
    (params) => fetchReportOverview({ ...params }),
    [fetchReportOverview]
  );

  const handleValidateParams = useCallback((searchParams) => {
    const { resourceId, resourceType } = searchParams;

    return (
      !!resourceType &&
      resourceType.length > 0 &&
      (resourceType === 'group' || (!!resourceId && resourceId.length > 0))
    );
  }, []);

  useEffect(() => {
    if (!prevSearch && location.search) {
      const searchParams = toQueryObject(location.search);

      if (handleValidateParams(searchParams)) {
        fetchReportOverview({ ...searchParams });
      }
    }
  }, [fetchReportOverview, handleValidateParams, location, prevSearch]);

  return (
    <Filter name="reports" isSaved={true} isUpdateUrlOnChange={true}>
      <Header title="Snapshot" isLoading={isLoading} />
      <Container>
        <ReportWithType
          hasDateFilter={false}
          location={location}
          onSubmit={handleSubmit}
          onValidateParams={handleValidateParams}
        />
        <ReportOverviewCards
          pathname={location.pathname}
          report={report.overview}
          searchParams={location.search}
        />
      </Container>
    </Filter>
  );
};

ReportsOverviewComponent.propTypes = {
  fetchReportOverview: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  location: PropTypes.object.isRequired,
  report: PropTypes.object,
};

const mapStateToProps = (state) => ({
  isLoading: state.profile.isLoading || state.report.isLoading,
  report: getReport(state),
});

const mapDispatchToProps = { fetchReportOverview };

export const ReportsOverview = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsOverviewComponent);
