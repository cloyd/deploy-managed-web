import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';

import { useLocationParams, useOnce } from '../../hooks';
import { Filter } from '../../modules/Filter';
import { Header } from '../../modules/Header';
import { Pagination } from '../../modules/Pagination';
import {
  PaymentListHeader,
  PaymentRequest,
  PaymentTransactionItem,
} from '../../modules/Payment';
import { useRolesContext } from '../../modules/Profile';
import { fetchAgencies } from '../../redux/agency';
import {
  PAYMENT_COMPLETE_FILTER,
  PAYMENT_STATUS,
  PAYMENT_TYPES,
  fetchIntentions,
  getIntentionsAll,
  payIntention,
} from '../../redux/intention';
import { showError } from '../../redux/notifier';
import {
  canDisbursePayment,
  getProfile,
  getTransactionViewRole,
} from '../../redux/profile';
import { fetchProperties, getPropertyList } from '../../redux/property';
import {
  fetchManagers,
  getManagersAsFilters,
  getUserAgenciesAsFilters,
} from '../../redux/users';

const INITIAL_FILTER = { page: '1', is_complete: false };

const PaymentsListComponent = (props) => {
  const {
    agencies,
    fetchIntentions,
    fetchManagers,
    fetchProperties,
    history,
    intentions,
    isLoading,
    managers,
    properties,
    transactionViewRole,
  } = props;

  const { isExternalCreditor, isManager, isTenant } = useRolesContext();
  const params = useLocationParams();

  const isFilterByUpcoming = useMemo(
    // Affects intentions list header
    () => params && params.isComplete === PAYMENT_COMPLETE_FILTER[0].value,
    [params]
  );

  const hasIntentions = useMemo(
    () => intentions && Object.keys(intentions).length > 0,
    [intentions]
  );

  const handleClear = useCallback(
    () => history.push('/payments?page=1&is_complete=false'),
    [history]
  );

  const handleClick = useCallback(
    (property, intention) => {
      const { id: propertyId } = property;
      const { id: intentionId, leaseId } = intention;

      history.push(
        `/payments/${intentionId}?leaseId=${leaseId}&propertyId=${propertyId}`
      );
    },
    [history]
  );

  const handleInputChange = useCallback(
    (value) => fetchManagers(value ? { search: value } : {}),
    [fetchManagers]
  );

  const handleSearch = useCallback(
    (address) => fetchProperties({ address }),
    [fetchProperties]
  );

  useOnce(() => {
    if (isManager) {
      fetchManagers();
    }

    // Fetch property to ensure address filter displays correctly
    if (params.propertyId) {
      fetchProperties({ propertyId: params.propertyId });
    }
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Fetch intentions list only when paginating or changing filters
    fetchIntentions({
      isComplete: PAYMENT_COMPLETE_FILTER[0].value, // Do not allow for null statuses
      ...params,
    });
  }, [
    params.agencyId,
    params.isComplete,
    params.isOverdue,
    params.managerId,
    params.page,
    params.propertyId,
    params.type,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Filter name="intentions" isSaved={false} initialFilter={INITIAL_FILTER}>
      <Header
        title={isTenant ? 'Upcoming' : 'Payment Centre'}
        isLoading={isLoading}>
        <div className="d-flex">
          <Filter.Search
            clearKeysOnClick={['managerId', 'agencyId']}
            isRightDropdown={true}
            isSubmitOnClick={true}
            label="Enter Street Address"
            name="propertyId"
            values={properties}
            onChange={handleSearch}
          />
        </div>
      </Header>
      <Container className="mt-3 mb-5">
        <Row className="mb-3 d-flex px-lg-2">
          <Col lg={!isManager ? 9 : 12}>
            <Row>
              {!isTenant && (
                <Col xs={6} md={4} lg={3} className="px-1 pb-2">
                  <Filter.TypeaheadSelect
                    label="Status"
                    name="isComplete"
                    isRequired={true}
                    values={PAYMENT_COMPLETE_FILTER}
                  />
                </Col>
              )}
              {!isExternalCreditor && (
                <Col xs={6} md={4} lg={2} className="px-1 pb-2">
                  <Filter.TypeaheadSelect
                    label="Type"
                    name="type"
                    values={PAYMENT_TYPES}
                  />
                </Col>
              )}
              <Col xs={6} md={4} lg={!isManager ? 3 : 2} className="px-1 pb-2">
                <Filter.TypeaheadSelect
                  label="Is Overdue?"
                  name="isOverdue"
                  values={PAYMENT_STATUS}
                />
              </Col>
              {isManager && (
                <>
                  {agencies && agencies.length > 0 && (
                    <Col xs={6} md={4} lg={2} className="px-1 pb-2">
                      <Filter.TypeaheadSelect
                        clearKeysOnChange={['managerId', 'propertyId']}
                        label="Agency"
                        name="agencyId"
                        values={agencies}
                      />
                    </Col>
                  )}
                  {managers && managers.length > 0 && (
                    <Col xs={6} md={4} lg={3} className="px-1 pb-2">
                      <Filter.TypeaheadSelect
                        clearKeysOnClick={['propertyId', 'agencyId']}
                        label="Manager"
                        name="managerId"
                        values={managers}
                        onKeyDown={handleInputChange}
                      />
                    </Col>
                  )}
                </>
              )}
            </Row>
          </Col>
          <Col lg={{ size: 3, offset: !isManager ? 0 : 9 }}>
            <Row>
              <Col xs={6} className="pt-2 text-center">
                <Filter.Clear
                  defaultParams={{ isComplete: 'false' }}
                  onClick={handleClear}
                />
              </Col>
              <Col
                xs={6}
                className="pl-3 pl-md-1 pl-lg-2 pr-lg-1 flex-lg-fill text-center">
                <Filter.Submit className="mt-1 w-100" color="primary" size="md">
                  Filter
                </Filter.Submit>
              </Col>
            </Row>
          </Col>
        </Row>
        {isLoading ? (
          <div className="d-block py-4 text-center">
            <PulseLoader size={12} color="#dee2e6" />
          </div>
        ) : hasIntentions ? (
          <>
            <PaymentListHeader
              isFilterByUpcoming={isFilterByUpcoming}
              className="payments-custom-header"
            />
            {intentions.map((intention, index) => (
              <React.Fragment key={`transaction-${intention.id}`}>
                {intention.isSuccess ? (
                  <Card
                    className={`border-0 pb-2 ${
                      intention.length !== index + 1 ? 'mb-2' : ''
                    }`}>
                    <CardBody className="px-3 py-2">
                      <PaymentTransactionItem
                        className={
                          intention.length !== index + 1 ? 'mb-2 pb-2' : ''
                        }
                        hasError={false}
                        intention={intention}
                        isDebtor={transactionViewRole === intention.debtor}
                        isLoading={isLoading}
                        property={intention.property}
                        totals={intention.formatted[transactionViewRole]}
                        isLast
                      />
                    </CardBody>
                  </Card>
                ) : (
                  <PaymentRequest
                    className={intention.length !== index + 1 ? 'mb-2' : ''}
                    hasLink={!isExternalCreditor && !isTenant}
                    intention={intention}
                    isDebtor={transactionViewRole === intention.debtor}
                    property={intention.property}
                    onClick={handleClick}
                  />
                )}
              </React.Fragment>
            ))}
            <Pagination className="mt-3" name="intentions" isReload={false} />
          </>
        ) : (
          <p className="m-4 text-center">No payments found.</p>
        )}
      </Container>
    </Filter>
  );
};

PaymentsListComponent.propTypes = {
  agencies: PropTypes.array,
  canDisbursePayment: PropTypes.bool.isRequired,
  fetchAgencies: PropTypes.func.isRequired,
  fetchIntentions: PropTypes.func.isRequired,
  fetchManagers: PropTypes.func.isRequired,
  fetchProperties: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  intentions: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  managers: PropTypes.array,
  properties: PropTypes.array,
  payIntention: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  transactionViewRole: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const profile = getProfile(state.profile);

  return {
    agencies: getUserAgenciesAsFilters(state.users, profile.id),
    canDisbursePayment: canDisbursePayment(state.profile),
    intentions: getIntentionsAll(state.intention),
    isLoading: state.intention.isLoading,
    managers: getManagersAsFilters(state.users),
    properties: getPropertyList(state.property),
    transactionViewRole: getTransactionViewRole(state.profile),
  };
};

const mapDispatchToProps = {
  fetchAgencies,
  fetchIntentions,
  fetchManagers,
  fetchProperties,
  payIntention,
  showError,
};

export const PaymentsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentsListComponent);
