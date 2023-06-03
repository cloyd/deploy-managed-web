import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';

import { useLocationParams, useOnce } from '../../hooks';
import { ButtonIcon } from '../../modules/Button';
import { Filter } from '../../modules/Filter';
import { useDateFilter } from '../../modules/Filter/hooks';
import { useRolesContext } from '../../modules/Profile';
import { getProfile } from '../../redux/profile';
import { resetReport } from '../../redux/report';
import { FILTER_PERIODS, FILTER_TYPES } from '../../redux/report/constants';
import {
  fetchManagers,
  getManagersAsFilters,
  getUserAgenciesAsFilters,
} from '../../redux/users';

const ReportWithTypeComponent = (props) => {
  const {
    agencies,
    fetchManagers,
    hasDateFilter,
    managers,
    onExport,
    onSubmit,
    onValidateParams,
    resetReport,
  } = props;

  const params = useLocationParams();
  const { isCorporateUser } = useRolesContext();
  const { startsAt, endsAt } = useDateFilter(params);

  const filterTypes = useMemo(
    () =>
      isCorporateUser
        ? FILTER_TYPES
        : FILTER_TYPES.filter((type) => type !== 'group'),
    [isCorporateUser]
  );

  const canSubmit = useMemo(
    () => (onValidateParams ? onValidateParams(params) : true),
    [onValidateParams, params]
  );

  const resourceFilter = useMemo(() => {
    switch (params.resourceType) {
      case 'agency':
        return agencies;
      case 'manager':
        return managers;
      default:
        return [];
    }
  }, [agencies, managers, params.resourceType]);

  const resourceLabel = useMemo(() => {
    if (params.resourceType) {
      return 'Select ' + params.resourceType;
    } else {
      return 'Filter ID';
    }
  }, [params.resourceType]);

  const handleClear = useCallback(() => resetReport(), [resetReport]);

  const handleInputChange = useCallback(
    (value) => fetchManagers(value ? { search: value } : {}),
    [fetchManagers]
  );

  const handleSubmit = useCallback(() => {
    if (canSubmit) {
      onSubmit(params);
    }
  }, [canSubmit, onSubmit, params]);

  const handleExport = useCallback(() => {
    onExport && onExport({ params });
  }, [onExport, params]);

  useOnce(() => {
    fetchManagers();
  });

  return (
    <Formik>
      <Row className="mb-3 d-print-none">
        <Col lg={9}>
          <Row>
            <Col lg={3} className="mb-2">
              <Filter.TypeaheadSelect
                label="Filter By"
                name="resourceType"
                values={filterTypes}
                clearKeysOnChange={['resourceId']}
              />
            </Col>
            <Col lg={4} className="mb-2">
              {params.resourceType !== 'group' && (
                <Filter.TypeaheadSelect
                  label={resourceLabel}
                  name="resourceId"
                  onKeyDown={
                    params.resourceType === 'manager'
                      ? handleInputChange
                      : undefined
                  }
                  values={resourceFilter}
                />
              )}
            </Col>
          </Row>
          {hasDateFilter && (
            <Row>
              <Col md={4} lg={4} className="mb-2">
                <Filter.Dropdown
                  label="Period"
                  name="period"
                  values={Object.keys(FILTER_PERIODS)}
                  clearKeysOnChange={['startsAt', 'endsAt']}
                />
              </Col>
              <Col md={8} lg={7} className="mb-2 d-flex">
                <Filter.Date name="startsAt" label="From" value={startsAt} />
                <Filter.Date name="endsAt" label="To" value={endsAt} />
              </Col>
            </Row>
          )}
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
                disabled={!canSubmit}
                onClick={handleSubmit}>
                Filter
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="text-right">
              {onExport && (
                <ButtonIcon
                  buttonColor="primary"
                  className="mt-1 mr-3"
                  color="white"
                  disabled={!canSubmit || props.isLoading}
                  title="Export lost managements CSV"
                  icon={['fas', 'download']}
                  onClick={handleExport}>
                  Export CSV
                </ButtonIcon>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Formik>
  );
};

ReportWithTypeComponent.propTypes = {
  agencies: PropTypes.array,
  managers: PropTypes.array,
  hasDateFilter: PropTypes.bool,
  isLoading: PropTypes.bool,
  onExport: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onValidateParams: PropTypes.func,
  fetchManagers: PropTypes.func.isRequired,
  resetReport: PropTypes.func.isRequired,
};

ReportWithTypeComponent.defaultProps = {
  agencies: [],
  hasDateFilter: true,
  isLoading: false,
  managers: [],
};

const mapStateToProps = (state) => {
  return {
    agencies: getUserAgenciesAsFilters(
      state.users,
      getProfile(state.profile).id
    ),
    managers: getManagersAsFilters(state.users),
  };
};

const mapDispatchToProps = {
  fetchManagers,
  resetReport,
};

export const ReportWithType = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportWithTypeComponent);
