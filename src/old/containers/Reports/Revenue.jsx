import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Col, Container } from 'reactstrap';

import { ReportWithType } from '.';
import { useLocationParams, usePrevious } from '../../hooks';
import { ButtonIcon } from '../../modules/Button';
import { Filter } from '../../modules/Filter';
import { Header } from '../../modules/Header';
import { ReportPaymentTable, validateReportParams } from '../../modules/Report';
import {
  exportExpensesReportCSV,
  exportRevenueReportCSV,
  fetchReportAggregate,
  fetchReportAggregateExpenses,
  getReport,
  getReportIsLoading,
} from '../../redux/report';
import { toQueryObject } from '../../utils';

const ReportsRevenueComponent = (props) => {
  const {
    exportRevenueReportCSV,
    exportExpensesReportCSV,
    fetchReportAggregate,
    fetchReportAggregateExpenses,
    isLoading,
    location,
    report,
  } = props;
  const prevSearch = usePrevious(location.search);
  const params = useLocationParams();

  const canSubmit = validateReportParams(params);

  const reportExpenses = useMemo(
    () => ({
      tasks: report.tasksExpenses || {},
      aggregate: {
        ...report.aggregate,
        report: {
          total: report.aggregate.report.totalExpenses,
          totalGst: report.aggregate.report.totalGstExpenses,
        },
      },
      transaction: {
        ...report.transaction,
        report: {
          total: report.transaction.report.totalExpenses,
          totalGst: report.transaction.report.totalGstExpenses,
        },
      },
      net: {
        total: report.net.totalExpenses,
      },
    }),
    [
      report.aggregate,
      report.net.totalExpenses,
      report.tasksExpenses,
      report.transaction,
    ]
  );

  const handleExportRevenue = useCallback(
    () => exportRevenueReportCSV({ params }),
    [exportRevenueReportCSV, params]
  );

  const handleExportExpenses = useCallback(
    () => exportExpensesReportCSV({ params }),
    [exportExpensesReportCSV, params]
  );

  const handleSubmit = useCallback(
    (params) => {
      fetchReportAggregate({ params });
      fetchReportAggregateExpenses({ params });
    },
    [fetchReportAggregate, fetchReportAggregateExpenses]
  );

  useEffect(() => {
    if (!prevSearch && location.search) {
      const searchParams = toQueryObject(location.search);

      if (validateReportParams(searchParams)) {
        fetchReportAggregate({ params: searchParams });
        fetchReportAggregateExpenses({ params: searchParams });
      }
    }
  }, [
    fetchReportAggregate,
    fetchReportAggregateExpenses,
    location,
    prevSearch,
  ]);

  return (
    <Filter name="reports" isSaved={true} isUpdateUrlOnChange={true}>
      <Header title="Financials" />
      <Container>
        <ReportWithType onSubmit={handleSubmit} />
        {isLoading ? (
          <Col className="pt-5 text-center">
            <PulseLoader color="#dee2e6" />
          </Col>
        ) : (
          <>
            <div className="d-flex justify-content-between w-100 py-1">
              <h3>Agency Revenue</h3>
              <ButtonIcon
                buttonColor="primary"
                className="mb-2"
                color="white"
                disabled={!canSubmit}
                title="Export lost managements CSV"
                icon={['fas', 'download']}
                onClick={handleExportRevenue}>
                Export CSV
              </ButtonIcon>
            </div>
            <ReportPaymentTable
              report={report}
              location={location}
              feeType="revenue"
            />
            <div className="d-flex justify-content-between w-100 py-1">
              <h3>Agency Expenses</h3>
              <ButtonIcon
                buttonColor="primary"
                className="mb-2"
                color="white"
                disabled={!canSubmit}
                title="Export lost managements CSV"
                icon={['fas', 'download']}
                onClick={handleExportExpenses}>
                Export CSV
              </ButtonIcon>
            </div>
            <ReportPaymentTable
              report={reportExpenses}
              location={location}
              feeType="expenses"
            />
          </>
        )}
      </Container>
    </Filter>
  );
};

ReportsRevenueComponent.propTypes = {
  exportRevenueReportCSV: PropTypes.func.isRequired,
  exportExpensesReportCSV: PropTypes.func.isRequired,
  fetchReportAggregate: PropTypes.func.isRequired,
  fetchReportAggregateExpenses: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  report: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isLoading: getReportIsLoading(state),
  report: getReport(state),
});

const mapDispatchToProps = {
  exportRevenueReportCSV,
  exportExpensesReportCSV,
  fetchReportAggregate,
  fetchReportAggregateExpenses,
};

export const ReportsRevenue = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsRevenueComponent);
