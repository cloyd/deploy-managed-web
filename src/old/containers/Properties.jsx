import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Col,
  Container,
  CustomInput,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from 'reactstrap';
import localStorage from 'store';

import { ButtonIcon } from '../modules/Button';
import { Filter } from '../modules/Filter';
import { Header } from '../modules/Header';
import { Link } from '../modules/Link';
import { Pagination } from '../modules/Pagination';
import { useRolesContext } from '../modules/Profile';
import { PropertyList } from '../modules/Property';
import {
  fetchAgencies,
  fetchAgency,
  getAgenciesRansackParams,
  selectAgencyTradingName,
} from '../redux/agency';
import { canCreateProperty as canCreatePropertySelector } from '../redux/profile';
import {
  fetchProperties,
  selectIsPropertyLoading,
  selectProperties,
} from '../redux/property';
import {
  USER_TYPES,
  fetchManager,
  fetchUsers,
  getManager,
} from '../redux/users';
import { toQueryObject, toQueryString } from '../utils';

const initialFilters = {
  residential: false,
  commercial: false,
  vacant: false,
  leased: false,
  draft: false,
  pendingActivateDueToDeposit: false,
  pendingActivate: false,
  pendingClearance: false,
  active: false,
  missingBankDetails: false,
  invalidBankDetails: false,
  withArchived: false,
};

const PropertiesComponent = ({ history, location }) => {
  const dispatch = useDispatch();

  const params = toQueryObject(location.search);
  const userType = localStorage.get('userType');
  const agencyId = localStorage.get('agencyId');

  // redux state
  const users = useSelector((state) => state.users);
  const profile = useSelector((state) => state.profile);
  const isLoading = useSelector(selectIsPropertyLoading);
  const properties = useSelector(selectProperties);
  const agencytradingName = useSelector(selectAgencyTradingName);

  // TODO: create appropriate selectors
  const currentManagerAgency =
    userType === 'manager' &&
    Object.values(users.manager?.data || {})?.find(
      (item) => item?.agency?.id === agencyId
    )?.agency;
  const manager = getManager(users, params.managerId);
  const canCreateProperty = canCreatePropertySelector(profile);

  const isList = params.view === 'list';
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(initialFilters);

  const { isCorporateUser, isManager } = useRolesContext();

  const isAllFilterValuesFalse = useMemo(() => {
    return Object.keys(filterValues).every((k) => !filterValues[k]);
  }, [filterValues]);

  useEffect(() => {
    params.agencyId && dispatch(fetchAgency({ agencyId: params.agencyId }));
  }, [dispatch, params.agencyId]);

  const handleOnChangeManager = useCallback(() => {
    if (isManager && params.managerId) {
      !manager.name && dispatch(fetchManager({ id: params.managerId }));
    }
  }, [dispatch, isManager, manager.name, params.managerId]);

  useEffect(() => {
    // update the filterValues local state when the component is rendered.
    let updatedFilterValues = {};
    updatedFilterValues['residential'] = !!(
      params['propertyType'] && params['propertyType'].includes('residential')
    );
    updatedFilterValues['commercial'] = !!(
      params['propertyType'] && params['propertyType'].includes('commercial')
    );
    updatedFilterValues['draft'] = !!(
      params['leaseStatus'] && params['leaseStatus'].includes('draft')
    );
    updatedFilterValues['pendingActivateDueToDeposit'] = !!(
      params['leaseStatus'] &&
      params['leaseStatus'].includes('pendingActivateDueToDeposit')
    );
    updatedFilterValues['pendingActivate'] = !!(
      params['leaseStatus'] && params['leaseStatus'].includes('pendingActivate')
    );
    updatedFilterValues['pendingClearance'] = !!(
      params['leaseStatus'] &&
      params['leaseStatus'].includes('pendingClearance')
    );
    updatedFilterValues['active'] = !!(
      params['leaseStatus'] && params['leaseStatus'].includes('active')
    );
    updatedFilterValues['withArchived'] = !!(
      params['withArchived'] && params['withArchived'] === 'true'
    );
    updatedFilterValues['missingBankDetails'] = !!(
      params['missingBank'] && params['missingBank'] === 'true'
    );
    updatedFilterValues['invalidBankDetails'] = !!(
      params['invalidBank'] && params['invalidBank'] === 'true'
    );
    setFilterValues(updatedFilterValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Redirect to Property Show if only 1 property
    if (!canCreateProperty && properties.length === 1) {
      history.push(`/property/${properties[0].id}`);
    }
  }, [canCreateProperty, history, properties]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    handleOnChangeManager();
    dispatch(fetchProperties({ ...params }));
  }, [
    dispatch,
    params.address,
    params.agencyId,
    params.managerId,
    params.page,
    params.withArchived,
    params.propertyType,
    params.leaseStatus,
    params.missingBank,
    params.invalidBank,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleOnFiltersClick = useCallback(() => {
    setIsFiltersOpen(!isFiltersOpen);
  }, [isFiltersOpen]);

  const handleOnClose = useCallback(() => {
    setIsFiltersOpen(false);
  }, []);

  const handleOnCheckBoxChange = useCallback(
    (e) => {
      const { name, checked } = e.target;
      setFilterValues((prevState) => {
        const newValues = { ...prevState };
        newValues[name] = checked;
        return { ...newValues };
      });
    },
    [setFilterValues]
  );

  const handleClearAllFilters = useCallback(
    (e) => {
      setFilterValues((prevState) => {
        Object.keys(prevState).forEach((key) => {
          prevState[key] = false;
        });
        return { ...prevState };
      });
      [
        'propertyType',
        'missingBank',
        'invalidBank',
        'leaseStatus',
        'withArchived',
      ].forEach((e) => delete params[e]);
      history.replace({ search: toQueryString(params) });
    },
    [params, history]
  );

  const filtersToParamsConversion = useCallback(() => {
    let trueFilterValues = Object.keys(filterValues).filter(
      (k) => filterValues[k]
    );
    let propertyType = trueFilterValues.filter(
      (trueFilter) =>
        trueFilter === 'residential' || trueFilter === 'commercial'
    );
    // let archived = trueFilterValues.includes("archived");
    let leaseStatus = trueFilterValues.filter(
      (trueFilter) =>
        trueFilter === 'draft' ||
        trueFilter === 'pendingActivateDueToDeposit' ||
        trueFilter === 'pendingActivate' ||
        trueFilter === 'pendingClearance' ||
        trueFilter === 'active'
    );
    let missingBank = trueFilterValues.includes('missingBankDetails');
    let invalidBank = trueFilterValues.includes('invalidBankDetails');
    let withArchived = trueFilterValues.includes('withArchived');
    const newParams = {
      missingBank: missingBank,
      withArchived: withArchived,
      invalidBank: invalidBank,
    };
    if (propertyType.length > 0)
      newParams['propertyType'] = propertyType.join(',');
    if (leaseStatus.length > 0)
      newParams['leaseStatus'] = leaseStatus.join(',');
    return newParams;
  }, [filterValues]);

  const handleApplyFilters = useCallback(() => {
    const newParams = filtersToParamsConversion();
    // Override propertyType, leaseStatus, missingBank, invalidBank, withArchived values to reflect newParams.
    let uniqueKeys = Object.keys(Object.assign({}, newParams, params));
    uniqueKeys.forEach((key) => {
      if (
        [
          'propertyType',
          'leaseStatus',
          'missingBank',
          'invalidBank',
          'withArchived',
        ].includes(key)
      ) {
        params[key] = newParams[key];
      }
    });
    history.replace({ search: toQueryString(params) });
    handleOnClose();
  }, [handleOnClose, history, params, filtersToParamsConversion]);

  return (
    <Filter
      name="properties"
      isSaved={false}
      isSubmitOnChange
      filterValues={filterValues}
      filtersToParamsConversion={filtersToParamsConversion}>
      <Header title="Properties" isLoading={isLoading}>
        <div className="d-flex">
          <div className="mb-sm-0">
            <Filter.View name="view" values={['grid', 'list']} />
          </div>
          {canCreateProperty && !isCorporateUser && (
            <Link
              className="ml-2 d-flex align-items-center"
              color="primary"
              to="/property/create">
              Add a property
            </Link>
          )}
        </div>
      </Header>
      <Container>
        <Row className="mb-3 justify-content-end no-gutters">
          {isManager && (
            <Col
              xs={{ size: 4, order: 1 }}
              sm={{ size: 3, order: 1 }}
              md={2}
              className="mb-2 mb-sm-0 text-center align-self-center">
              {isAllFilterValuesFalse ? (
                <ButtonIcon
                  color="primary"
                  style={{ border: '1px solid' }}
                  icon={['fas', 'filter']}
                  outline
                  onClick={handleOnFiltersClick}>
                  Filters
                </ButtonIcon>
              ) : (
                <ButtonIcon
                  color="white"
                  buttonColor="primary"
                  icon={['far', 'filter']}
                  onClick={handleOnFiltersClick}>
                  Filters
                </ButtonIcon>
              )}
            </Col>
          )}

          <Col
            xs={{ size: 8, order: 1 }}
            sm={{ size: 3, order: 1 }}
            className="mb-2 mb-sm-0">
            <Filter.Search label="Enter Street Address" name="address" />
          </Col>
        </Row>
        <Row data-testid="property-list">
          <PropertyList isList={isList} />
        </Row>
        {!isLoading && <Pagination className="mt-2" name="properties" />}
        <Modal size="lg" isOpen={isFiltersOpen} centered>
          <ModalHeader cssModule={{ 'modal-title': 'w-100 mb-0' }}>
            <div className="d-inline-flex w-100 justify-content-between">
              <div>Advanced Filters</div>
              <div className="text-right px-md-0">
                <Button color="primary" onClick={handleOnClose}>
                  <FontAwesomeIcon icon={['far', 'times']} />
                </Button>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="container">
              {isManager && (
                <Row className="mx-3">
                  <Col
                    xs={{ size: 12, order: 1 }}
                    sm={{ size: 12, order: 1 }}
                    md={{ size: 6, order: 1 }}
                    className="mb-2 text-primary">
                    {'Property Manager'}
                  </Col>
                  <Col
                    xs={{ size: 12, order: 3 }}
                    sm={{ size: 12, order: 3 }}
                    md={{ size: 6, order: 2 }}
                    className="mb-2 text-primary">
                    {'Office Branch'}
                  </Col>
                  <Col
                    xs={{ size: 12, order: 1 }}
                    sm={{ size: 12, order: 1 }}
                    md={{ size: 6, order: 3 }}
                    className="mb-2">
                    <Filter.SearchUser
                      name="managerId"
                      type={USER_TYPES.manager}
                      action={fetchUsers}
                      defaultInputValue={params.managerId && manager.name}
                      labelKey="firstName"
                      label="Search Property Manager"
                      default
                      filterValues={filterValues}
                      filtersToParamsConversion={filtersToParamsConversion}
                      location={location}
                      searchData={{
                        'q[user_active_true]': true,
                      }}
                    />
                  </Col>
                  <Col
                    xs={{ size: 12, order: 3 }}
                    sm={{ size: 12, order: 3 }}
                    md={{ size: 6, order: 4 }}
                    className="mb-2">
                    <Filter.SearchUser
                      name="agencyId"
                      type="agency"
                      action={fetchAgencies}
                      labelKey="tradingName"
                      label="Search Branch"
                      ransackParams={getAgenciesRansackParams()}
                      defaultInputValue={params.agencyId && agencytradingName}
                      filterValues={filterValues}
                      filtersToParamsConversion={filtersToParamsConversion}
                      location={location}
                    />
                  </Col>
                </Row>
              )}
              <Row className="mx-3 mb-3">
                <Col
                  xs={{ size: 12, order: 1 }}
                  sm={{ size: 12, order: 1 }}
                  md={{ size: 4, order: 1 }}
                  className="mb-2 text-primary">
                  {'Property'}
                </Col>
                <Col
                  xs={{ size: 12, order: 3 }}
                  sm={{ size: 12, order: 3 }}
                  md={{ size: 4, order: 2 }}
                  className="mb-2 text-primary">
                  {'Lease'}
                </Col>
                <Col
                  xs={{ size: 12, order: 5 }}
                  sm={{ size: 12, order: 5 }}
                  md={{ size: 4, order: 3 }}
                  className="mb-2 text-primary">
                  {'Other'}
                </Col>
                <div className="mb-2 mb-sm-0 col-12 order-2 col-sm-12 order-sm-2 col-md-4 order-md-4">
                  <CustomInput
                    checked={filterValues['residential']}
                    id="propertyFilterResidential"
                    label="Residential"
                    name="residential"
                    type="checkbox"
                    onChange={handleOnCheckBoxChange}
                    disabled={!currentManagerAgency?.commercialModuleEnabled}
                  />
                  <CustomInput
                    checked={filterValues['commercial']}
                    id="propertyFilterCommercial"
                    label="Commercial"
                    name="commercial"
                    type="checkbox"
                    onChange={handleOnCheckBoxChange}
                    disabled={!currentManagerAgency?.commercialModuleEnabled}
                  />
                  <CustomInput
                    checked={filterValues['withArchived']}
                    id="propertyFilterWithArchived"
                    label="Include Archived"
                    name="withArchived"
                    type="checkbox"
                    onChange={handleOnCheckBoxChange}
                  />
                </div>
                <div className="mb-2 mb-sm-0 col-12 order-4 col-sm-12 order-sm-4 col-md-4 order-md-5">
                  <CustomInput
                    checked={filterValues['draft']}
                    id="propertyFilterDraft"
                    label="Vacant"
                    name="draft"
                    type="checkbox"
                    onChange={handleOnCheckBoxChange}
                  />
                  <CustomInput
                    checked={filterValues['pendingActivateDueToDeposit']}
                    id="propertyFilterDepositPaid"
                    label="Deposit Paid"
                    name="pendingActivateDueToDeposit"
                    type="checkbox"
                    onChange={handleOnCheckBoxChange}
                  />
                  <CustomInput
                    checked={filterValues['pendingActivate']}
                    id="propertyFilterPendingActivate"
                    label="Pending Activate"
                    name="pendingActivate"
                    type="checkbox"
                    onChange={handleOnCheckBoxChange}
                  />
                  <CustomInput
                    checked={filterValues['pendingClearance']}
                    id="propertyFilterPendingClearance"
                    label="Pending Clearance"
                    name="pendingClearance"
                    type="checkbox"
                    onChange={handleOnCheckBoxChange}
                  />
                  <CustomInput
                    checked={filterValues['active']}
                    id="propertyFilterActive"
                    label="Leased"
                    name="active"
                    type="checkbox"
                    onChange={handleOnCheckBoxChange}
                  />
                </div>
                <div className="mb-2 mb-sm-0 col-12 order-6 col-sm-12 order-sm-6 col-md-4 order-md-6">
                  <CustomInput
                    checked={filterValues['missingBankDetails']}
                    id="propertyFilterMissingBankDetails"
                    label="Missing Bank Details"
                    name="missingBankDetails"
                    type="checkbox"
                    onChange={handleOnCheckBoxChange}
                  />
                  <CustomInput
                    checked={filterValues['invalidBankDetails']}
                    id="propertyFilterInvalidBankDetails"
                    label="Invalid Bank Details"
                    name="invalidBankDetails"
                    type="checkbox"
                    onChange={handleOnCheckBoxChange}
                  />
                </div>
              </Row>
            </div>
            <div className="mt-3 mb-2" style={{ float: 'right' }}>
              <Button
                className="ml-2 mr-2"
                outline
                color="primary"
                onClick={handleClearAllFilters}>
                Clear all
              </Button>
              <Button
                className="ml-2 mr-2"
                color="primary"
                onClick={handleApplyFilters}>
                Apply
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </Container>
    </Filter>
  );
};

PropertiesComponent.defaultProps = {};

PropertiesComponent.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export const Properties = memo(PropertiesComponent);
