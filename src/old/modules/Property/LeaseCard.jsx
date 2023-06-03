import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Badge, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap';

import { LeaseEditSingleProperty } from '.';
import {
  ATTACHMENT_CATEGORIES,
  centsToDollar,
  formatDate,
  isConditionReport,
  isLeaseAgreement,
} from '../../utils';
import { ButtonApprove, ButtonDestroy, ButtonEdit } from '../Button';
import { CardLight } from '../Card';
import { ContentDefinition } from '../Content';
import { LeaseForm } from '../Lease';
import { useLeaseDates } from '../Lease/hooks';
import { useRolesContext } from '../Profile';
import { UploaderButton, UploaderFiles } from '../Uploader';
import { PropertyLeaseTenantLedgerReport } from './LeaseTenantLedgerReports';

const DEFAULT_LABEL_CLASS = 'd-inline-block mb-2';

export const PropertyLeaseCard = (props) => {
  const {
    canCreateLease,
    hasError,
    isLoading,
    lease,
    onActivate,
    onCancel,
    onSubmit,
    onUploaderComplete,
    property,
    title,
    isAnyOtherLeaseActive,
    handleChangeLeaseEnd,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSingleProperty, setIsEditingSingleProperty] = useState({
    tenantPaysWater: false,
    gstIncluded: false,
    periodic: false,
  });
  const [dates, leaseTermString] = useLeaseDates(lease);
  const { isManager, isTenant, isCorporateUser, isPrincipal } =
    useRolesContext();
  const isAgencyUser = isManager || isCorporateUser || isPrincipal;

  const showTenantLedgerReports = useMemo(
    () => (isTenant || isManager) && lease.primaryTenant,
    [lease.primaryTenant, isTenant, isManager]
  );

  const showDepositTaken = useMemo(
    () => lease.isPendingActivate && lease.hasDeposit && lease.depositIsPaid,
    [lease]
  );

  const attachments = useMemo(
    () => ({
      conditionReport: (lease.attachments || []).filter(isConditionReport),
      leaseAgreement: (lease.attachments || []).filter(isLeaseAgreement),
    }),
    [lease.attachments]
  );

  const isNsw = useMemo(() => {
    if (property.address) {
      const propertyState = property.address.state.toLowerCase();
      return ['nsw', 'new south wales'].includes(propertyState);
    } else {
      return false;
    }
  }, [property.address]);

  useEffect(() => {
    if (canCreateLease && lease.startDate === null) {
      setIsEditing(true);
    }
  }, [canCreateLease, lease.startDate]);

  const handleIsEditing = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const toggleSinglePropertyEdit = useCallback((name) => {
    setIsEditingSingleProperty((prevState) => ({
      ...prevState,
      [name]: !prevState?.[name],
    }));
  }, []);

  const handleUpdateLeasedProperty = useCallback(
    ({ name, value }) => {
      onSubmit({ id: lease.id, [name]: value });
      toggleSinglePropertyEdit(name);
    },
    [lease.id, onSubmit, toggleSinglePropertyEdit]
  );

  return (
    <CardLight className="d-flex h-100" data-testid="lease-card">
      <CardHeader className="d-md-flex bg-white justify-content-between border-400">
        <CardTitle className="mb-0" tag="h5">
          {title}
          <div className="h6">{`(ID: ${lease.id})`}</div>
        </CardTitle>
        <div className="d-flex align-items-center">
          {showDepositTaken && (
            <span className="pt-1">
              <Badge className="mx-2 text-white" color="warning" pill>
                Deposit Taken
              </Badge>
            </span>
          )}
          {canCreateLease && (
            <div className="d-inline-flex">
              {!isEditing && !lease.isActive && (
                <ButtonEdit
                  data-testid="edit-lease-btn"
                  onClick={handleIsEditing}>
                  Edit
                </ButtonEdit>
              )}
              {lease.canCancel && lease.status !== 'activating' && (
                <ButtonDestroy
                  onConfirm={onCancel}
                  size="md"
                  modal={{
                    title: 'Confirmation',
                    body: lease.canRefund
                      ? 'Cancel the lease and refund deposit to tenant ?'
                      : 'Cancel the lease ?',
                  }}>
                  Cancel lease
                </ButtonDestroy>
              )}
              {lease.canActivate && onActivate && !isAnyOtherLeaseActive && (
                <ButtonApprove color="success" onClick={onActivate}>
                  {isLoading ? <PulseLoader color="#dee2e6" /> : 'Activate'}
                </ButtonApprove>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {isEditing && !lease.isActive ? (
          <LeaseForm
            hasError={hasError}
            isLoading={isLoading}
            isNsw={isNsw}
            lease={lease}
            onCancel={handleIsEditing}
            onComplete={handleIsEditing}
            onSubmit={onSubmit}
            isCommercial={!!lease?.currentCommercialOutgoingsEstimate}
            handleChangeLeaseEnd={handleChangeLeaseEnd}
          />
        ) : (
          <>
            <Row className="mb-2">
              {!!lease.isTerminating && (
                <Col xs={12} className="alert alert-danger text-center">
                  Terminating on:
                  <strong>{formatDate(lease.terminationDate)}</strong>
                </Col>
              )}
              {!!lease.payFrequency && (
                <Col xs={12} lg={4} className="mb-2 mb-lg-0">
                  <ContentDefinition
                    data-testid="lease-pay-frequency"
                    label={`${startCase(lease.payFrequency)} Rent`}
                    value={lease.amountDollars[lease.payFrequency]}
                    labelClassName={DEFAULT_LABEL_CLASS}
                  />
                  {lease?.gstIncluded && (
                    <div className="text-small text-primary">
                      (GST Inclusive)
                    </div>
                  )}
                </Col>
              )}
              <Col sm={6} lg={4}>
                <ContentDefinition
                  label="Deposit"
                  data-test-id="lease-card-deposit"
                  value={centsToDollar(lease.depositCents)}
                  labelClassName={DEFAULT_LABEL_CLASS}
                />
              </Col>
              <LeaseEditSingleProperty
                lease={lease}
                isEditing={isEditingSingleProperty.gstIncluded}
                handleIsEditing={toggleSinglePropertyEdit}
                initialValue={lease.gstIncluded}
                id="gstIncluded"
                label="GST Included"
                onSubmit={handleUpdateLeasedProperty}
                canEdit={isAgencyUser}
              />
            </Row>
            {lease?.currentCommercialOutgoingsEstimate && (
              <Row className="mb-2">
                <Col sm={6} lg={4}>
                  <ContentDefinition
                    label="Monthly Outgoings Bill"
                    data-test-id="lease-card-monthly-outgoings-bill"
                    value={centsToDollar(
                      lease?.currentCommercialOutgoingsEstimate
                        ?.totalMonthlyTenantAmountCents
                    )}
                    labelClassName={DEFAULT_LABEL_CLASS}
                  />
                  {lease?.currentCommercialOutgoingsEstimate?.gstIncluded && (
                    <div className="text-small text-primary">
                      (GST Inclusive)
                    </div>
                  )}
                </Col>
                <Col sm={6} lg={5}>
                  <ContentDefinition
                    label="Send Invoice In Advance(Days)"
                    value={lease?.daysRentInvoiceInAdvance}
                    labelClassName={DEFAULT_LABEL_CLASS}
                  />
                </Col>
              </Row>
            )}
            <Row className="mb-2">
              <Col sm={6} lg={4}>
                <ContentDefinition
                  label="Bond Id"
                  data-test-id="lease-card-bond-id"
                  value={lease.bondNumber}
                  labelClassName={DEFAULT_LABEL_CLASS}
                />
              </Col>
              <Col sm={6} lg={4}>
                <ContentDefinition
                  label="Bond"
                  data-test-id="lease-card-bond"
                  value={centsToDollar(lease.bondCents)}
                  labelClassName={DEFAULT_LABEL_CLASS}
                />
              </Col>
              <LeaseEditSingleProperty
                lease={lease}
                isEditing={isEditingSingleProperty.tenantPaysWater}
                handleIsEditing={toggleSinglePropertyEdit}
                initialValue={lease.tenantPaysWater}
                id={'tenantPaysWater'}
                label="Do tenants Pay Water"
                onSubmit={handleUpdateLeasedProperty}
                canEdit={isAgencyUser}
              />
            </Row>
            <Row className="mb-2">
              <Col sm={6} lg={4}>
                <ContentDefinition
                  label="First Payment"
                  data-test-id="lease-card-first-payment"
                  value={dates.start}
                  labelClassName={DEFAULT_LABEL_CLASS}
                />
              </Col>

              {isManager && (
                <Col xs={12}>
                  <ContentDefinition
                    label="Inspection Date"
                    data-test-id="lease-card-inspection-date"
                    labelClassName={DEFAULT_LABEL_CLASS}>
                    {dates.inspection ? (
                      <p>
                        <span>{dates.inspection} </span>
                        {lease.inspectionDateFrequencyInMonths && (
                          <span>
                            (every {lease.inspectionDateFrequencyInMonths}{' '}
                            months)
                          </span>
                        )}
                      </p>
                    ) : (
                      '-'
                    )}
                  </ContentDefinition>
                </Col>
              )}
              {!isTenant && (
                <Col xs={12}>
                  <ContentDefinition
                    label="Rent Review Date"
                    data-testid="lease-card-rent-review-date"
                    labelClassName={DEFAULT_LABEL_CLASS}>
                    {dates.inspection ? (
                      <p>
                        <span>{dates.review} </span>
                        {lease.reviewDateFrequencyInMonths && (
                          <span>
                            (every {lease.reviewDateFrequencyInMonths} months)
                          </span>
                        )}
                      </p>
                    ) : (
                      '-'
                    )}
                  </ContentDefinition>
                </Col>
              )}
            </Row>
            <Row className="mb-2">
              <Col sm={12} lg={8}>
                <ContentDefinition
                  label="Lease Term"
                  data-test-id="lease-card-lease-term"
                  labelClassName={DEFAULT_LABEL_CLASS}>
                  {dates.leaseStart} - {dates.end}{' '}
                  {leaseTermString || (
                    <span className="text-danger">(Expired)</span>
                  )}
                </ContentDefinition>
              </Col>
              <LeaseEditSingleProperty
                lease={lease}
                isEditing={isEditingSingleProperty.periodic}
                handleIsEditing={toggleSinglePropertyEdit}
                initialValue={lease.periodic}
                id={'periodic'}
                label="Periodic"
                editLabel="Periodic (Month to Month)"
                onSubmit={handleUpdateLeasedProperty}
                canEdit={isAgencyUser}
              />
            </Row>
            {!!lease.isTerminating && (
              <Row className="mb-2">
                <Col>
                  <ContentDefinition
                    label="Move Out Date"
                    data-test-id="lease-card-move-out-date"
                    value={formatDate(lease.terminationDate)}
                    labelClassName={DEFAULT_LABEL_CLASS}
                  />
                </Col>
              </Row>
            )}
            <Row className="mb-2">
              <Col xs={12}>
                <ContentDefinition
                  label="Tenancy Agreement"
                  data-test-id="lease-card-tenancy-agreement"
                  labelClassName={DEFAULT_LABEL_CLASS}>
                  <UploaderFiles
                    attachments={attachments.leaseAgreement}
                    attachableType="Lease"
                    attachableId={isManager ? lease.id : null}
                    onDestroyComplete={onUploaderComplete}
                  />
                  {isManager && (
                    <UploaderButton
                      attachableType="Lease"
                      attachableId={lease.id}
                      attachableCategory={ATTACHMENT_CATEGORIES.leaseAgreement}
                      onComplete={onUploaderComplete}
                    />
                  )}
                </ContentDefinition>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={12}>
                <ContentDefinition
                  label="Condition Report"
                  data-test-id="lease-card-condition-report"
                  labelClassName={DEFAULT_LABEL_CLASS}>
                  <UploaderFiles
                    attachments={attachments.conditionReport}
                    attachableType="Lease"
                    attachableId={isManager ? lease.id : null}
                    onDestroyComplete={onUploaderComplete}
                  />
                  {isManager && (
                    <UploaderButton
                      attachableType="Lease"
                      attachableId={lease.id}
                      attachableCategory={ATTACHMENT_CATEGORIES.conditionReport}
                      isButton
                      onComplete={onUploaderComplete}
                    />
                  )}
                </ContentDefinition>
              </Col>
            </Row>
            {showTenantLedgerReports && (
              <Row className="mb-2">
                <Col xs={12}>
                  <ContentDefinition
                    label="Tenant Ledger Documents"
                    data-test-id="lease-card-tenant-ledger-documents"
                    labelClassName={DEFAULT_LABEL_CLASS}>
                    <PropertyLeaseTenantLedgerReport lease={lease} />
                  </ContentDefinition>
                </Col>
              </Row>
            )}
          </>
        )}
      </CardBody>
    </CardLight>
  );
};

PropertyLeaseCard.propTypes = {
  canCreateLease: PropTypes.bool,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  lease: PropTypes.object,
  onActivate: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUploaderComplete: PropTypes.func,
  property: PropTypes.object,
  title: PropTypes.string,
  isAnyOtherLeaseActive: PropTypes.bool,
  handleChangeLeaseEnd: PropTypes.func.isRequired,
};

PropertyLeaseCard.defaultProps = {
  canCreateLease: false,
  hasError: false,
  isLoading: true,
  lease: {},
  title: 'Lease',
};
