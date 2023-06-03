import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import {
  ReportCardsLinkOverdue,
  ReportCardsLinkValue,
  useLinkSearchParams,
} from '..';
import { CardStatistic, CardStatisticWithFooter } from '../../Card';

export const ReportEfficiencyCards = (props) => {
  const { pathname, report } = props;
  const showReport = report && Object.keys(report).length > 0;

  const linkSearchParams = useLinkSearchParams(props.searchParams);
  const linkSearchParamsWithDueDate = `${useLinkSearchParams(
    props.searchParams
  )}&use_due_date=true`;

  return !showReport ? (
    <Row>
      <Col className="py-5 text-center">No entries found</Col>
    </Row>
  ) : (
    <Row>
      <Col xs={6} lg={3} className="pb-3">
        <CardStatistic className="h-100" title="Completed tasks">
          <ReportCardsLinkValue
            to={`${pathname}/completed${linkSearchParams}`}
            title="Completed"
            value={report.completedTasks}
          />
        </CardStatistic>
      </Col>

      <Col xs={6} lg={3} className="pb-3">
        <CardStatisticWithFooter
          className="h-100"
          title="Median time taken"
          statistic={
            <span className="text-dark">{report.medianTimeTaken}h</span>
          }
        />
      </Col>

      <Col xs={6} lg={3} className="pb-3">
        <CardStatistic
          className="h-100"
          title="Tasks not completed before due date">
          <ReportCardsLinkValue
            to={`${pathname}/not_completed_before_due_date${linkSearchParams}`}
            title="Not completed before due date"
            value={report.notCompletedBeforeDueDate}
          />
        </CardStatistic>
      </Col>

      <Col xs={6} lg={3} className="pb-3">
        <CardStatistic className="h-100" title="Incomplete and deleted">
          <ReportCardsLinkValue
            to={`${pathname}/incomplete_and_deleted${linkSearchParams}`}
            title="Incomplete and deleted"
            value={report.incompleteAndDeleted}
          />
        </CardStatistic>
      </Col>

      <Col xs={6} lg={3} className="pb-3">
        <CardStatisticWithFooter
          className="h-100"
          title="Lease renewals due"
          statistic={
            <>
              <ReportCardsLinkValue
                to={`${pathname}/lease_renewals_due_completed${linkSearchParams}`}
                title="Lease renewals due completed"
                value={report.leaseRenewalsDueCompleted}
              />
              <span className="text-dark">/</span>
              <ReportCardsLinkValue
                to={`${pathname}/lease_renewals_due_total${linkSearchParamsWithDueDate}`}
                title="Lease renewals due total"
                value={report.leaseRenewalsDueTotal}
              />
            </>
          }>
          <ReportCardsLinkOverdue
            to={`${pathname}/lease_renewals_due_overdue${linkSearchParamsWithDueDate}`}
            title="Lease renewals due overdue"
            value={report.leaseRenewalsDueOverdue}
          />
        </CardStatisticWithFooter>
      </Col>

      <Col xs={6} lg={3} className="pb-3">
        <CardStatisticWithFooter
          className="h-100"
          title="Vacating tenants"
          statistic={
            <>
              <ReportCardsLinkValue
                to={`${pathname}/vacating_tenants_completed${linkSearchParams}`}
                title="Vacating tenants completed"
                value={report.vacatingTenantsCompleted}
              />
              <span className="text-dark">/</span>
              <ReportCardsLinkValue
                to={`${pathname}/vacating_tenants_total${linkSearchParamsWithDueDate}`}
                title="Vacating tenants total"
                value={report.vacatingTenantsTotal}
              />
            </>
          }>
          <ReportCardsLinkOverdue
            to={`${pathname}/vacating_tenants_overdue${linkSearchParamsWithDueDate}`}
            title="Vacating tenants overdue"
            value={report.vacatingTenantsOverdue}
          />
        </CardStatisticWithFooter>
      </Col>

      <Col xs={6} lg={3} className="pb-3">
        <CardStatisticWithFooter
          className="h-100"
          title="Condition reports and routines"
          statistic={
            <>
              <ReportCardsLinkValue
                to={`${pathname}/condition_reports_completed${linkSearchParams}`}
                title="Condition reports and routines completed"
                value={report.conditionReportsCompleted}
              />
              <span className="text-dark">/</span>
              <ReportCardsLinkValue
                to={`${pathname}/condition_reports_total${linkSearchParamsWithDueDate}`}
                title="Condition reports and routines total"
                value={report.conditionReportsTotal}
              />
            </>
          }>
          <ReportCardsLinkOverdue
            to={`${pathname}/condition_reports_overdue${linkSearchParamsWithDueDate}`}
            title="Condition reports and routines overdue"
            value={report.conditionReportsOverdue}
          />
        </CardStatisticWithFooter>
      </Col>

      <Col xs={6} lg={3} className="pb-3">
        <CardStatisticWithFooter
          className="h-100"
          title="Maintenance"
          statistic={
            <>
              <ReportCardsLinkValue
                to={`${pathname}/maintenance_completed${linkSearchParams}`}
                title="Maintenance completed"
                value={report.maintenanceCompleted}
              />
              <span className="text-dark">/</span>
              <ReportCardsLinkValue
                to={`${pathname}/maintenance_total${linkSearchParamsWithDueDate}`}
                title="Maintenance total"
                value={report.maintenanceTotal}
              />
            </>
          }>
          <ReportCardsLinkOverdue
            to={`${pathname}/maintenance_overdue${linkSearchParamsWithDueDate}`}
            title="Maintenance overdue"
            value={report.maintenanceOverdue}
          />
        </CardStatisticWithFooter>
      </Col>

      <Col xs={6} lg={3} className="pb-3">
        <CardStatisticWithFooter
          className="h-100"
          title="Rent Reviews"
          statistic={
            <>
              <ReportCardsLinkValue
                to={`${pathname}/rent_reviews_completed${linkSearchParams}`}
                title="Rent Reviews completed"
                value={report.rentReviewsCompleted}
              />
              <span className="text-dark">/</span>
              <ReportCardsLinkValue
                to={`${pathname}/rent_reviews_total${linkSearchParamsWithDueDate}`}
                title="Rent Reviews total"
                value={report.rentReviewsTotal}
              />
            </>
          }>
          <ReportCardsLinkOverdue
            to={`${pathname}/rent_reviews_overdue${linkSearchParamsWithDueDate}`}
            title="Rent Reviews overdue"
            value={report.rentReviewsOverdue}
          />
        </CardStatisticWithFooter>
      </Col>

      <Col xs={6} lg={3} className="pb-3">
        <CardStatisticWithFooter
          className="h-100"
          title="Other tasks"
          statistic={
            <>
              <ReportCardsLinkValue
                to={`${pathname}/other_tasks_completed${linkSearchParams}`}
                title="Other tasks completed"
                value={report.otherTasksCompleted}
              />
              <span className="text-dark">/</span>
              <ReportCardsLinkValue
                to={`${pathname}/other_tasks_total${linkSearchParamsWithDueDate}`}
                title="Other tasks total"
                value={report.otherTasksTotal}
              />
            </>
          }>
          <ReportCardsLinkOverdue
            to={`${pathname}/other_tasks_overdue${linkSearchParamsWithDueDate}`}
            title="Other tasks overdue"
            value={report.otherTasksOverdue}
          />
        </CardStatisticWithFooter>
      </Col>
    </Row>
  );
};

ReportEfficiencyCards.propTypes = {
  pathname: PropTypes.string,
  report: PropTypes.object,
  searchParams: PropTypes.string,
};

ReportEfficiencyCards.defaultProps = {
  pathname: '',
  searchParams: '',
};
