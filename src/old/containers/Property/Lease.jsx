import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Button, Col, Container, Row } from 'reactstrap';

import { usePrevious } from '../../hooks';
import { CardLight } from '../../modules/Card';
import { DividerTitle } from '../../modules/Divider';
import {
  LeaseActions,
  LeaseFormTask,
  LeaseFormWarning,
  LeaseScheduleConfirm,
} from '../../modules/Lease';
import { ModalConfirm, ModalDeleteItem } from '../../modules/Modal';
import {
  PropertyLeaseCard,
  PropertyLeaseModificationsCard,
  PropertyLeaseOutgoingsCard,
  PropertyLeaseRefund,
  PropertyTenantCard,
} from '../../modules/Property';
import {
  activateLease,
  addTenant,
  cancelLease,
  disburseBond,
  fetchActivationTasks,
  fetchLease,
  fetchModifications,
  getLeaseActivationTasks,
  getLeaseActive,
  getLeaseModifications,
  getLeasesExpired,
  modifyRent,
  updateLease,
  updateLeaseAttachments,
} from '../../redux/lease';
import { hasError } from '../../redux/notifier';
import {
  canCreateLease,
  canCreateTenant,
  canViewTenantContactDetails,
} from '../../redux/profile';
import { fetchProperty } from '../../redux/property';
import { httpClient, isOverFortnightAgo } from '../../utils';

const PropertyLeaseComponent = ({
  activateLease,
  addTenant,
  cancelLease,
  canCreateLease,
  canCreateTenant,
  canViewTenantContactDetails,
  disburseBond,
  fetchLease,
  fetchModifications,
  fetchProperty,
  hasError,
  history,
  isLoadingLease,
  isLoadingTenant,
  lease,
  leaseUpcoming,
  leasesExpired,
  modifications,
  modifyRent,
  property,
  updateLease,
  updateLeaseAttachments,
  fetchActivationTasks,
  activationTasks,
  isAnyOtherLeaseActive,
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showRestoreDefaultsModal, setShowRestoreDefaultsModal] =
    useState(false);
  const [leaseItems, setLeaseItems] = useState([]);
  const [isShowRenewalModal, setIsShowRenewalModal] = useState(false);
  const [isExistingRenewalTaskComplete, setIsExistingRenewalTaskComplete] =
    useState(undefined);
  const [isShowAuditLog, setIsShowAuditLog] = useState(false);
  const prevLeaseUpcoming = usePrevious(leaseUpcoming);

  useEffect(() => {
    activationTasks && setLeaseItems([...activationTasks]);
  }, [activationTasks]);

  const show = useMemo(() => {
    const showLease = !!lease.id;
    const showLeaseUpcoming =
      !!leaseUpcoming.id && (!showLease || lease.isTerminating);
    const showLeaseWarning = isOverFortnightAgo(
      new Date(leaseUpcoming.startDate)
    );

    return {
      actions: lease.isActive && canCreateLease,
      expired: leasesExpired.length > 0,
      lease: showLease,
      leaseUpcoming: showLeaseUpcoming,
      leaseWarning: showLeaseWarning,
      modifications: modifications.length > 0,
      spinner: !showLease && !showLeaseUpcoming && !showLeaseWarning,
      leaseOutgoings: lease.currentCommercialOutgoingsEstimate !== undefined,
      upcomingLeaseOutgoings:
        leaseUpcoming.currentCommercialOutgoingsEstimate !== undefined,
    };
  }, [
    canCreateLease,
    lease,
    leaseUpcoming,
    leasesExpired.length,
    modifications.length,
  ]);

  const handleActivate = useCallback(
    (lease) => () => {
      activateLease({
        leaseId: lease.id,
      });
      setShowConfirmationModal(false);
      fetchProperty({ propertyId: property.id });
    },
    [activateLease, fetchProperty, property.id]
  );

  const handleCancel = useCallback(
    (lease) => () => cancelLease(lease),
    [cancelLease]
  );

  const handleSubmitTenant = useCallback(
    (lease) => (values) => {
      addTenant({ ...values, leaseId: lease.id });
      fetchProperty({ propertyId: property.id });
    },
    [addTenant, fetchProperty, property.id]
  );

  const handleSubmitLease = useCallback(
    (property) => (values) => {
      updateLease({
        ...values,
        markExistingRenewalTaskAsCompleted: isExistingRenewalTaskComplete,
      });
      fetchProperty({ propertyId: property.id });
    },
    [updateLease, fetchProperty, isExistingRenewalTaskComplete]
  );

  const handleView = useCallback(
    (leaseId) => () =>
      history.push(`/property/${property.id}/transactions?leaseId=${leaseId}`),
    [history, property]
  );

  // Toggles only the Activation modal
  const handleShowActivationModal = useCallback(
    (e) => {
      setShowWarningModal(false);
      setShowActivationModal(!showActivationModal);
      setShowConfirmationModal(false);
      e.preventDefault();
    },
    [showActivationModal]
  );

  // Toggles only the Confirmation modal
  const handleShowConfirmationModal = useCallback(
    (e) => {
      setShowActivationModal(false);
      setShowConfirmationModal(!showConfirmationModal);
      e.preventDefault();
    },
    [showConfirmationModal]
  );

  const handleShowRestoreDefaultsModal = useCallback(
    (e) => {
      setShowRestoreDefaultsModal(!showRestoreDefaultsModal);
      e.preventDefault();
    },
    [showRestoreDefaultsModal]
  );

  const onSubmitScheduledLeaseItems = useCallback(
    (e) => {
      e.preventDefault();
      handleShowConfirmationModal(e);
    },
    [handleShowConfirmationModal]
  );

  const handleResetDefaults = useCallback(
    (e) => {
      e.preventDefault();
      httpClient
        .post(
          `/properties/${property.id}/tasks/remove-lease-activation-tasks`,
          {
            leaseId: leaseUpcoming.id,
          }
        )
        .then((response) => {
          setLeaseItems(response.data.leaseItems);
          setShowRestoreDefaultsModal(false);
        })
        .catch((error) => {
          console.log('Internal Server error. Please contact Support', error);
        });
    },
    [property.id, leaseUpcoming.id, setShowRestoreDefaultsModal]
  );

  // If lease payments set over two week prior, then toggle warning modal
  const handleShowWarningModal = useCallback(() => {
    if (show.leaseWarning) {
      setShowWarningModal(!showWarningModal);
    } else {
      setShowActivationModal(!showActivationModal);
    }
  }, [show.leaseWarning, showActivationModal, showWarningModal]);

  useEffect(() => {
    if (property.id && lease.id) {
      fetchModifications({ leaseId: lease.id });
    }
  }, [fetchModifications, lease.id, property.id]);

  useEffect(() => {
    if (property.leaseId) {
      fetchLease({ leaseId: property.leaseId });
    }
  }, [fetchLease, property.leaseId]);

  useEffect(() => {
    if (!leaseUpcoming.id && prevLeaseUpcoming && prevLeaseUpcoming.id) {
      fetchProperty({ propertyId: property.id });
    }
  }, [fetchProperty, leaseUpcoming.id, prevLeaseUpcoming, property.id]);

  const handleOnActivate = useCallback(() => {
    if (!show.lease) {
      handleShowWarningModal();
    }
    fetchActivationTasks({ leaseId: leaseUpcoming.id });
  }, [
    leaseUpcoming.id,
    fetchActivationTasks,
    show.lease,
    handleShowWarningModal,
  ]);

  const handleChangeLeaseEndDate = useCallback(() => {
    setIsExistingRenewalTaskComplete(undefined);
    setIsShowRenewalModal(lease.hasExistingLeaseRenewalTasks);
  }, [lease.hasExistingLeaseRenewalTasks, setIsShowRenewalModal]);

  const handleClick = useCallback(
    (isRenewal) => () => {
      setIsExistingRenewalTaskComplete(isRenewal === 'yes');
      setIsShowRenewalModal(false);
    },
    [setIsShowRenewalModal, setIsExistingRenewalTaskComplete]
  );

  useEffect(() => {
    if (hasError) {
      setShowWarningModal(false);
      setShowActivationModal(false);
    }
  }, [hasError, setShowActivationModal, setShowWarningModal]);

  return (
    <Container className="mb-3">
      {show.spinner && (
        <div className="m-5 text-center">
          <PulseLoader color="#dee2e6" />
        </div>
      )}
      {show.lease && <DividerTitle title="Current Lease" className="mb-2" />}
      {show.actions && (
        <LeaseActions
          className="mb-4"
          hasError={hasError}
          isLoading={isLoadingLease}
          lease={lease}
          handleChangeLeaseEnd={handleChangeLeaseEndDate}
          isExistingRenewalTaskComplete={isExistingRenewalTaskComplete}
          handleToggleAuditLog={setIsShowAuditLog}
          isShowAuditLog={isShowAuditLog}
        />
      )}
      {show.lease && !isShowAuditLog && (
        <>
          <Row className="mb-3" data-testid="property-lease-active-cards">
            <Col md={6} className="mb-3 mb-md-0">
              <PropertyLeaseCard
                canCreateLease={canCreateLease}
                hasError={hasError}
                isLoading={isLoadingLease}
                lease={lease}
                onCancel={handleCancel(lease)}
                onSubmit={updateLease}
                onUploaderComplete={updateLeaseAttachments}
                property={property}
                handleChangeLeaseEnd={handleChangeLeaseEndDate}
                handleSetRenewalModal={setIsShowRenewalModal}
              />
            </Col>
            <Col md={6}>
              <PropertyTenantCard
                canCreateTenant={canCreateTenant}
                canViewContactDetails={canViewTenantContactDetails}
                hasError={hasError}
                isLoading={isLoadingTenant}
                isLeaseCreated={!!lease.startDate}
                onSubmit={handleSubmitTenant(lease)}
                secondaryTenants={lease.secondaryTenants || []}
                tenant={lease.tenant}
                tenantStartDate={lease.tenantStartDate}
                property={property}
              />
            </Col>
          </Row>
          {show.leaseOutgoings && (
            <Row
              className="mb-3"
              data-testid="property-lease-active-outgoings-estimate">
              <Col md={12} className="mb-3 mb-md-0">
                <PropertyLeaseOutgoingsCard
                  lease={lease}
                  propertyId={property.id}
                  onUploaderComplete={updateLeaseAttachments}
                />
              </Col>
            </Row>
          )}
        </>
      )}
      {show.modifications && (
        <PropertyLeaseModificationsCard
          lease={lease}
          modifications={modifications}
        />
      )}
      {show.leaseUpcoming && !property.isArchived && (
        <>
          <DividerTitle title="Upcoming Lease" className="mb-2" />
          <Row className="mb-4" data-testid="property-lease-upcoming-cards">
            <Col md={6} className="mb-3 mb-md-0">
              <PropertyLeaseCard
                canCreateLease={canCreateLease}
                hasError={hasError}
                isLoading={isLoadingLease}
                lease={leaseUpcoming}
                onActivate={handleOnActivate}
                onCancel={handleCancel(leaseUpcoming)}
                onSubmit={handleSubmitLease(property)}
                onUploaderComplete={updateLeaseAttachments}
                property={property}
                isAnyOtherLeaseActive={
                  Object.keys(isAnyOtherLeaseActive).length > 0
                }
                handleChangeLeaseEnd={handleChangeLeaseEndDate}
              />
              <ModalConfirm
                isOpen={showActivationModal}
                size="lg"
                className="pb-0"
                title={
                  <>
                    <div className="d-inline-flex w-100 justify-content-between">
                      <div>
                        Schedule agency bills before activating this lease
                      </div>
                      <div>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={handleShowActivationModal}>
                          <FontAwesomeIcon icon={['far', 'times']} />
                        </Button>
                      </div>
                    </div>
                    <div className="h6 text-muted mt-2">
                      If payment reference is empty, property address will be
                      used
                    </div>
                  </>
                }>
                <LeaseFormTask
                  onSubmit={onSubmitScheduledLeaseItems}
                  onCancel={handleShowRestoreDefaultsModal}
                  leaseItems={leaseItems}
                  handleActivationModal={setShowActivationModal}
                  handleActivationTasks={setLeaseItems}
                  propertyId={property.id}
                  leaseId={leaseUpcoming.id}
                />
              </ModalConfirm>
              {show.leaseWarning && (
                <ModalConfirm
                  isOpen={showWarningModal}
                  size="lg"
                  title="Warning">
                  <LeaseFormWarning
                    onSubmit={handleShowActivationModal}
                    onCancel={handleShowWarningModal}
                  />
                </ModalConfirm>
              )}
              {showConfirmationModal && (
                <ModalConfirm
                  isOpen={showConfirmationModal}
                  size="md"
                  title="These bills will be scheduled before lease activation">
                  <LeaseScheduleConfirm
                    onCancel={handleShowActivationModal}
                    onSubmit={handleActivate(leaseUpcoming)}
                    scheduledLeaseItems={leaseItems}
                  />
                </ModalConfirm>
              )}
            </Col>
            <Col md={6}>
              <PropertyTenantCard
                canCreateTenant={canCreateTenant}
                canViewContactDetails={canViewTenantContactDetails}
                hasError={hasError}
                isLoading={isLoadingTenant}
                isLoadingLease={isLoadingLease}
                isLeaseCreated={!!leaseUpcoming.startDate}
                onSubmit={handleSubmitTenant(leaseUpcoming)}
                secondaryTenants={leaseUpcoming.secondaryTenants || []}
                tenant={leaseUpcoming.tenant || {}}
                tenantStartDate={leaseUpcoming.tenantStartDate}
                property={property}
              />
            </Col>
          </Row>
          {show.upcomingLeaseOutgoings && (
            <Row
              className="mb-3"
              data-testid="property-lease-upcoming-outgoings-estimate">
              <Col md={12} className="mb-3 mb-md-0">
                <PropertyLeaseOutgoingsCard
                  lease={leaseUpcoming}
                  propertyId={property.id}
                  onUploaderComplete={updateLeaseAttachments}
                />
              </Col>
            </Row>
          )}
        </>
      )}
      {show.expired && (
        <>
          <DividerTitle title="Terminated Leases" className="mb-2" />
          <CardLight className="mb-4 p-3">
            {leasesExpired.map((lease, i) => (
              <PropertyLeaseRefund
                className={
                  i < leasesExpired.length - 1
                    ? 'pb-3 mb-3 border-bottom'
                    : null
                }
                canReleaseBond={canCreateLease}
                key={`lease-${lease.id}`}
                lease={lease}
                onSubmit={disburseBond}
                onUploaderComplete={updateLeaseAttachments}
                onView={handleView}
              />
            ))}
          </CardLight>
        </>
      )}
      {/* Modal for Restore Defaults Confirmation */}
      <ModalDeleteItem
        size="md"
        isOpen={showRestoreDefaultsModal}
        title="Are you sure?"
        bodyText="This will remove all current bills and restore to the default letting and lease renewal bills"
        onSubmit={handleResetDefaults}
        onCancel={handleShowRestoreDefaultsModal}
      />
      {/* Modal for Existing Task Renewal Alert Confirmation */}
      <ModalConfirm
        isOpen={isShowRenewalModal}
        size="md"
        title="Alert!"
        btnCancel={{ text: 'No' }}
        btnSubmit={{ text: 'Yes' }}
        onCancel={handleClick('no')}
        onSubmit={handleClick('yes')}>
        <p>
          A new lease renewal task will be generated but there is an existing
          outstanding task
        </p>
        <p>Do you want to automatically mark the old task as completed?</p>
      </ModalConfirm>
    </Container>
  );
};

PropertyLeaseComponent.propTypes = {
  activateLease: PropTypes.func,
  addTenant: PropTypes.func,
  cancelLease: PropTypes.func,
  canCreateLease: PropTypes.bool,
  canCreateTenant: PropTypes.bool,
  canViewTenantContactDetails: PropTypes.bool,
  disburseBond: PropTypes.func,
  fetchLease: PropTypes.func,
  fetchModifications: PropTypes.func,
  fetchProperty: PropTypes.func,
  hasError: PropTypes.bool,
  history: PropTypes.object,
  isLoadingLease: PropTypes.bool,
  isLoadingTenant: PropTypes.bool,
  lease: PropTypes.object,
  leaseUpcoming: PropTypes.object,
  leasesExpired: PropTypes.array,
  modifications: PropTypes.array,
  modifyRent: PropTypes.func,
  property: PropTypes.object.isRequired,
  updateLease: PropTypes.func,
  updateLeaseAttachments: PropTypes.func,
  fetchActivationTasks: PropTypes.func,
  activationTasks: PropTypes.array,
  isAnyOtherLeaseActive: PropTypes.object,
};

PropertyLeaseComponent.defaultProps = {
  lease: {},
  leaseUpcoming: {},
};

const mapStateToProps = (state, props) => {
  const { lease, property, leaseUpcoming } = props;

  return {
    canCreateLease: canCreateLease(state.profile),
    canCreateTenant: canCreateTenant(state.profile),
    canViewTenantContactDetails: canViewTenantContactDetails(state.profile),
    hasError: hasError(state),
    isLoadingLease: state.lease.isLoading,
    isLoadingTenant: state.property.isLoading || state.profile.isLoading,
    leasesExpired: getLeasesExpired(state.lease, property.id),
    modifications: getLeaseModifications(state.lease, lease && lease.id),
    activationTasks: getLeaseActivationTasks(
      state.lease,
      leaseUpcoming && leaseUpcoming.id
    ),
    isAnyOtherLeaseActive: getLeaseActive(state.lease, property.id),
  };
};

const mapDispatchToProps = {
  activateLease,
  addTenant,
  cancelLease,
  disburseBond,
  fetchLease,
  fetchModifications,
  fetchProperty,
  modifyRent,
  updateLease,
  updateLeaseAttachments,
  fetchActivationTasks,
};

export const PropertyLease = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyLeaseComponent);
