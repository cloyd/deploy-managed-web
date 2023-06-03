import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';

import { ButtonIcon } from '../../modules/Button';
import { Filter } from '../../modules/Filter';
import { Header } from '../../modules/Header';
import { Pagination } from '../../modules/Pagination';
import {
  ReportLeaseDataTable,
  ReportOwnerDataTable,
  ReportPropertyDataTable,
  ReportTenantDataTable,
  validateDataReportParams,
} from '../../modules/Report';
import { resetPagination } from '../../redux/pagination';
import { getProfile } from '../../redux/profile';
import {
  exportDataPropertyReportCSV,
  fetchData,
  getReport,
  getReportIsLoading,
  resetReport,
} from '../../redux/report';
import {
  FILTER_DATA_TYPES,
  FILTER_LEASE_STATUSES,
  FILTER_ONBOARDING,
  FILTER_OWNER_STATUSES,
  FILTER_PROPERTY_TYPES,
  FILTER_TENANT_STATUSES,
} from '../../redux/report/constants';
import { getUserAgenciesAsFilters } from '../../redux/users';
import { toQueryObject } from '../../utils';

const ReportsDataComponent = (props) => {
  const {
    exportDataPropertyReportCSV,
    fetchData,
    isLoading,
    params,
    agencies,
    resetReport,
    resetPagination,
    report,
    isReportLoading,
    history,
  } = props;

  useEffect(() => {
    // reset the form when there is a change in filterType param.
    if (params.filterType) {
      resetReport();
      resetPagination();
    }
  }, [params.filterType, resetReport, resetPagination]);

  useEffect(() => {
    if (params.agencyId) fetchData({ ...params });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSubmit = useMemo(() => validateDataReportParams(params), [params]);

  const dataTypes = useMemo(() => Object.keys(FILTER_DATA_TYPES), []);

  const handleExport = useCallback(() => {
    exportDataPropertyReportCSV({ ...params });
  }, [exportDataPropertyReportCSV, params]);

  const handleClear = useCallback(() => {
    resetReport();
    resetPagination();
    history.replace('/reports/data');
  }, [resetReport, resetPagination, history]);

  const handleSubmit = useCallback(() => {
    fetchData({ ...params });
  }, [fetchData, params]);

  return (
    <Filter name="properties" isSaved={false} isSubmitOnChange={true}>
      <Header title="Data" isLoading={isLoading} />
      <div>
        <Row className=" container mb-3 mx-auto px-0">
          <Col lg={9}>
            <Row>
              <Col
                xs={{ size: 12, order: 1 }}
                sm={{ size: 12, order: 1 }}
                md={2}
                lg={2}
                className="mb-2 mb-sm-0">
                <Filter.Dropdown
                  label="Filter By"
                  name="filterType"
                  values={dataTypes}
                  clearKeysOnChange={[
                    'agencyId',
                    'propertyType',
                    'leaseStatus',
                    'ownerStatus',
                    'tenantStatus',
                    'withArchived',
                    'isOnboarded',
                    'page',
                  ]}
                />
              </Col>
              {params.filterType && (
                <ShowFilters params={params} agencies={agencies} />
              )}
              <ShowSubFilters params={params} />
              {params.filterType === 'property' && (
                <Col
                  xs={{ size: 12, order: 4 }}
                  sm={{ size: 12, order: 4 }}
                  md={2}
                  lg={2}
                  style={{ paddingRight: '0px', marginTop: '8px' }}
                  className="mb-2 mb-sm-0">
                  <Filter.Check label="Incl. Archived" name="withArchived" />
                </Col>
              )}
            </Row>
          </Col>
          <Col lg={3}>
            <Row>
              <Col xs={6} className="mb-2 mt-1 text-center">
                <Filter.Clear onClick={handleClear} />
              </Col>
              <Col xs={6} className="mb-2">
                <Button
                  className="mt-1 w-100"
                  color="primary"
                  size="md"
                  disabled={!canSubmit || props.isReportLoading}
                  onClick={handleSubmit}>
                  Filter
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className="text-center text-md-right">
                <ButtonIcon
                  buttonColor="primary"
                  className="mt-1"
                  color="white"
                  title="Export Data CSV"
                  icon={['fas', 'download']}
                  disabled={!canSubmit || props.isReportLoading}
                  onClick={handleExport}>
                  Export CSV
                </ButtonIcon>
              </Col>
            </Row>
          </Col>
        </Row>
        {params.filterType === 'property' && (
          <ReportPropertyDataTable
            isLoading={isReportLoading}
            properties={report}
          />
        )}
        {params.filterType === 'lease' && (
          <ReportLeaseDataTable isLoading={isReportLoading} leases={report} />
        )}
        {params.filterType === 'owner' && (
          <ReportOwnerDataTable isLoading={isReportLoading} owners={report} />
        )}
        {params.filterType === 'tenant' && (
          <ReportTenantDataTable isLoading={isReportLoading} tenants={report} />
        )}
        <Pagination className="mt-2" name="search_data" />
      </div>
    </Filter>
  );
};

const ShowFilters = ({ params, agencies }) => {
  const filterType = params.filterType;
  const ownerTypes = useMemo(() => FILTER_OWNER_STATUSES, []);
  const tenantTypes = useMemo(() => FILTER_TENANT_STATUSES, []);

  switch (filterType) {
    case 'owner':
      return (
        <>
          <Col
            xs={{ size: 12, order: 2 }}
            sm={{ size: 12, order: 2 }}
            md={5}
            lg={5}
            className="mb-2 mb-sm-0 mt-md-1">
            <Filter.TypeaheadMultiSelect
              label="Agency"
              name="agencyId"
              values={agencies}
              selectClassName="data-export"
              clearKeysOnChange={['page']}
            />
          </Col>
          <Col
            xs={{ size: 6, order: 2 }}
            sm={{ size: 6, order: 3 }}
            md={3}
            lg={3}
            className="mb-2 mb-sm-0">
            <Filter.Dropdown
              label="Owner Status"
              name="ownerStatus"
              clearKeysOnChange={['isOnboarded', 'page']}
              values={ownerTypes}
            />
          </Col>
        </>
      );
    case 'tenant':
      return (
        <>
          <Col
            xs={{ size: 12, order: 2 }}
            sm={{ size: 12, order: 2 }}
            md={5}
            lg={5}
            className="mb-2 mb-sm-0 mt-md-1">
            <Filter.TypeaheadMultiSelect
              label="Agency"
              name="agencyId"
              values={agencies}
              selectClassName="data-export"
              clearKeysOnChange={['page']}
            />
          </Col>
          <Col
            xs={{ size: 6, order: 2 }}
            sm={{ size: 6, order: 3 }}
            md={3}
            lg={3}
            className="mb-2 mb-sm-0">
            <Filter.Dropdown
              label="Tenant Status"
              name="tenantStatus"
              clearKeysOnChange={['isOnboarded', 'page']}
              values={tenantTypes}
            />
          </Col>
        </>
      );
    default:
      return (
        <Col
          xs={{ size: 12, order: 2 }}
          sm={{ size: 12, order: 2 }}
          md={5}
          lg={5}
          className="mb-2 mb-sm-0 mt-md-1">
          <Filter.TypeaheadMultiSelect
            label="Agency"
            name="agencyId"
            values={agencies}
            selectClassName="data-export"
            clearKeysOnChange={['page']}
          />
        </Col>
      );
  }
};

const ShowSubFilters = ({ params }) => {
  const filterType = params.filterType;
  const propertyTypes = useMemo(() => FILTER_PROPERTY_TYPES, []);
  const leaseTypes = useMemo(() => FILTER_LEASE_STATUSES, []);

  switch (filterType) {
    case 'owner':
    case 'tenant':
      return (
        <Col
          xs={{ size: 6, order: 2 }}
          sm={{ size: 3, order: 3 }}
          md={2}
          lg={2}
          className="mb-2 mb-sm-0">
          <Filter.Dropdown
            label="Onboarded"
            name="isOnboarded"
            values={FILTER_ONBOARDING}
            clearKeysOnChange={['page']}
          />
        </Col>
      );
    case 'property':
      return (
        <Col
          xs={{ size: 6, order: 2 }}
          sm={{ size: 3, order: 3 }}
          md={3}
          lg={3}
          className="mb-2 mb-sm-0">
          <Filter.Dropdown
            label="Property Type"
            name="propertyType"
            values={propertyTypes}
            clearKeysOnChange={['page']}
          />
        </Col>
      );
    case 'lease':
      return (
        <Col
          xs={{ size: 12, order: 2 }}
          sm={{ size: 12, order: 3 }}
          md={5}
          lg={5}
          className="mb-2 mb-sm-0 mt-sm-1">
          <Filter.TypeaheadMultiSelect
            label="Lease Status"
            name="leaseStatus"
            values={leaseTypes}
            selectClassName="data-export"
            clearKeysOnChange={['page']}
          />
        </Col>
      );
    default:
      return null;
  }
};

ShowFilters.propTypes = {
  params: PropTypes.shape({
    address: PropTypes.string,
    agencyId: PropTypes.array,
    page: PropTypes.string,
    view: PropTypes.string,
    withArchived: PropTypes.string,
    filterType: PropTypes.string,
    propertyType: PropTypes.string,
    leaseStatus: PropTypes.array,
    ownerStatus: PropTypes.string,
    tenantStatus: PropTypes.string,
    isOnboarded: PropTypes.string,
  }),
  agencies: PropTypes.array,
};

ShowSubFilters.propTypes = {
  params: PropTypes.shape({
    address: PropTypes.string,
    agencyId: PropTypes.array,
    managerId: PropTypes.string,
    page: PropTypes.string,
    view: PropTypes.string,
    withArchived: PropTypes.string,
    filterType: PropTypes.string,
    propertyType: PropTypes.string,
    leaseStatus: PropTypes.array,
    ownerStatus: PropTypes.string,
    tenantStatus: PropTypes.string,
    isOnboarded: PropTypes.string,
  }),
};

ReportsDataComponent.propTypes = {
  exportDataPropertyReportCSV: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.shape({
    address: PropTypes.string,
    agencyId: PropTypes.array,
    page: PropTypes.string,
    view: PropTypes.string,
    withArchived: PropTypes.string,
    filterType: PropTypes.string,
    propertyType: PropTypes.string,
    leaseStatus: PropTypes.array,
    ownerStatus: PropTypes.string,
    tenantStatus: PropTypes.string,
    isOnboarded: PropTypes.string,
  }),
  report: PropTypes.array,
  agencies: PropTypes.array,
  resetReport: PropTypes.func.isRequired,
  resetPagination: PropTypes.func.isRequired,
  isReportLoading: PropTypes.bool,
  history: PropTypes.object.isRequired,
};

ReportsDataComponent.defaultProps = {
  agencies: [],
  report: [],
};

const mapStateToProps = (state, props) => {
  const params = toQueryObject(props.location.search);
  const profile = state.profile;
  const users = state.users;
  const property = state.property;
  const data = getReport(state).data || [];
  const isReportLoading = getReportIsLoading(state);

  return {
    params,
    isLoading: property.isLoading,
    isReportLoading: isReportLoading,
    report: data,
    agencies: getUserAgenciesAsFilters(users, getProfile(profile).id),
  };
};

const mapDispatchToProps = {
  fetchData,
  exportDataPropertyReportCSV,
  resetReport,
  resetPagination,
};

export const ReportsData = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsDataComponent);
