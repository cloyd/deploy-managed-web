import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledCollapse,
} from 'reactstrap';

import { useIsOpen } from '../../hooks';
import {
  ATTACHMENT_CATEGORIES,
  centsToDollar,
  formatDate,
  isConditionReport,
  isLeaseAgreement,
  isOutgoingsAttachment,
  toClassName,
} from '../../utils';
import { ContentDefinition } from '../Content';
import { FormRefund } from '../Form';
import { useRolesContext } from '../Profile';
import { PropertyUserIcon } from '../Property';
import { UploaderButton, UploaderFiles } from '../Uploader';
import { PropertyLeaseOutgoingsModalHeader } from './LeaseOutgoingsModalHeader';
import { PropertyLeaseOutgoingsTable } from './LeaseOutgoingsTable';
import { PropertyLeaseTenantLedgerReport } from './LeaseTenantLedgerReports';

export const PropertyLeaseRefund = (props) => {
  const {
    canReleaseBond,
    lease,
    onSubmit,
    onUploaderComplete,
    onView,
    ...otherProps
  } = props;
  const { id, bondReturnedCents, hasBond, startDate, terminationDate } =
    lease || {};

  const [isViewOutgoingsOpen, setIsViewOutgoingsOpen] = useState(false);
  const [isOpen, actions] = useIsOpen();
  const { isManager, isTenant } = useRolesContext();

  const showBond = !bondReturnedCents && hasBond;
  const showRelease = !isOpen && showBond && canReleaseBond;
  const showDisbursed = !isOpen && (bondReturnedCents || !hasBond);

  const isCommercial = useMemo(() => {
    return lease?.currentCommercialOutgoingsEstimate || false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lease.id]);

  const showTenantLedgerReports = useMemo(
    () => (isTenant || isManager) && lease.primaryTenant,
    [lease.primaryTenant, isTenant, isManager]
  );
  const handleViewOutgoings = useCallback(() => {
    setIsViewOutgoingsOpen(!isViewOutgoingsOpen);
  }, [isViewOutgoingsOpen]);

  useEffect(() => {
    if (bondReturnedCents) {
      actions.handleClose();
    }
  }, [actions, bondReturnedCents]);

  return (
    <div {...otherProps}>
      <Row className={toClassName(['align-items-center'], isOpen && 'mb-4')}>
        <Col sm={9} id={`toggle-${id}`}>
          <Row>
            <Col
              xs={1}
              className="d-flex align-items-center justify-content-center">
              <FontAwesomeIcon icon={['far', 'chevron-down']} />
            </Col>
            <Col xs={11}>
              <Row xs={2} sm={3}>
                <Col
                  xs={2}
                  sm={2}
                  className="mb-2 mb-lg-0 pl-0"
                  style={{ marginLeft: '0.4rem' }}>
                  <ContentDefinition label="Lease Id" value={lease.id} />
                </Col>
                <Col xs={4} sm={3} className="mb-2 mb-lg-0">
                  <ContentDefinition
                    label="Rental Period:"
                    value={`${formatDate(startDate)} - ${formatDate(
                      terminationDate
                    )}`}
                  />
                </Col>
                <Col xs={6} sm={2} className="mb-2 mb-lg-0">
                  <ContentDefinition
                    label="Rent"
                    value={`${lease.amountDollars[lease.payFrequency]}/${
                      lease.payFrequency
                    }`}
                  />
                </Col>
                <Col xs={6} sm={2} className="mb-2 mb-lg-0">
                  <ContentDefinition label="Primary Tenant">
                    <PropertyUserIcon
                      className="mt-0"
                      disabled={false}
                      role="tenant"
                      user={lease.tenant}
                    />
                  </ContentDefinition>
                </Col>
                {showDisbursed && (
                  <Col xs={6} sm={2} className="mb-2 mb-lg-0">
                    <ContentDefinition
                      label="Bond disbursed to owner:"
                      value={centsToDollar(bondReturnedCents)}
                    />
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Col>
        <Col sm={3} className="d-flex justify-content-sm-end w-100 text-right">
          <div>
            {showRelease && (
              <Button
                className="mr-2 mr-sm-0 mb-3"
                color="primary"
                onClick={actions.handleToggle}>
                Release Bond
              </Button>
            )}
            <Button className="mb-3" color="success" onClick={onView(id)}>
              View Transactions
            </Button>
          </div>
        </Col>
        <Col sm={{ size: 11, offset: 1 }} className="pl-sm-0">
          <UncontrolledCollapse toggler={`#toggle-${id}`} className="mt-4">
            <Row>
              <Col xs={6} lg={2} className="mb-2 pl-0 mb-lg-0">
                <ContentDefinition
                  label="Rent Amount"
                  value={lease.amountDollars[lease.payFrequency]}
                />
              </Col>
              <Col xs={6} lg={2} className="mb-2 mb-lg-0">
                <ContentDefinition
                  label="Rent Frequency"
                  value={lease.payFrequency}
                />
              </Col>
              <Col xs={6} lg={2}>
                <ContentDefinition
                  label="Deposit"
                  value={centsToDollar(lease.depositCents)}
                />
              </Col>
              <Col xs={6} lg={2}>
                <ContentDefinition
                  label="Bond"
                  value={centsToDollar(lease.bondCents)}
                />
              </Col>
              <Col xs={6} lg={2}>
                <ContentDefinition label="Bond Id" value={lease.bondNumber} />
              </Col>
              <Col xs={6} lg={2}>
                <ContentDefinition
                  label="First Payment"
                  value={formatDate(lease.startDate)}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              {lease.secondaryTenants.length > 0 && (
                <Col lg={3} className="pl-0">
                  <ContentDefinition label="Secondary Tenants">
                    {lease.secondaryTenants.map((tenant) => (
                      <PropertyUserIcon
                        key={`user-${tenant?.id}`}
                        user={tenant}
                        role="tenant"
                      />
                    ))}
                  </ContentDefinition>
                </Col>
              )}
              {isCommercial && (
                <Col xs={6} lg={2} className="pl-0">
                  <ContentDefinition
                    label="Monthly Outgoings"
                    value={centsToDollar(
                      lease?.currentCommercialOutgoingsEstimate
                        ?.totalMonthlyTenantAmountCents
                    )}>
                    {centsToDollar(
                      lease?.currentCommercialOutgoingsEstimate
                        ?.totalMonthlyTenantAmountCents
                    )}
                    <Button
                      className="d-block px-0"
                      color="link"
                      onClick={handleViewOutgoings}>
                      View
                    </Button>
                  </ContentDefinition>
                </Col>
              )}
              <Col xs={6} lg={2} className={`${!isCommercial && 'pl-0'}`}>
                <ContentDefinition label="Tenancy Agreement">
                  <UploaderFiles
                    attachments={lease.attachments.filter(isLeaseAgreement)}
                    attachableType="Lease"
                    attachableId={lease.id}
                    onDestroyComplete={null}
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
              <Col xs={6} lg={2}>
                <ContentDefinition label="Condition Report">
                  <UploaderFiles
                    attachments={lease.attachments.filter(isConditionReport)}
                    attachableType="Lease"
                    attachableId={lease.id}
                    onDestroyComplete={null}
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
              {showTenantLedgerReports && (
                <Col xs={6} lg={3}>
                  <ContentDefinition label="Tenant Ledger Documents">
                    <PropertyLeaseTenantLedgerReport lease={lease} />
                  </ContentDefinition>
                </Col>
              )}
              {isCommercial && (
                <Col xs={6} lg={2}>
                  <ContentDefinition label="Outgoings Attachments">
                    <UploaderFiles
                      attachments={lease.attachments.filter(
                        isOutgoingsAttachment
                      )}
                      attachableType="Lease"
                      attachableId={lease.id}
                      onDestroyComplete={null}
                    />
                    <UploaderButton
                      attachableType="Lease"
                      attachableId={lease.id}
                      attachableCategory={
                        ATTACHMENT_CATEGORIES.commercialOutgoingsEstimate
                      }
                      onComplete={onUploaderComplete}
                    />
                  </ContentDefinition>
                </Col>
              )}
            </Row>
          </UncontrolledCollapse>
        </Col>
      </Row>
      {isOpen && (
        <FormRefund
          lease={lease}
          onSubmit={onSubmit}
          onCancel={actions.handleToggle}
        />
      )}
      {isCommercial && (
        <Modal size="lg" isOpen={isViewOutgoingsOpen} centered>
          <ModalHeader cssModule={{ 'modal-title': 'w-100' }} className="pb-0">
            <PropertyLeaseOutgoingsModalHeader
              canEditGst={false}
              isGstIncluded={
                lease?.currentCommercialOutgoingsEstimate?.gstIncluded
              }
              leaseId={lease.id}
              outgoingsEstimateId={lease?.currentCommercialOutgoingsEstimate.id}
            />
          </ModalHeader>
          <ModalBody>
            <PropertyLeaseOutgoingsTable
              outgoingsEstimate={lease?.currentCommercialOutgoingsEstimate}
            />
            <div
              className="mt-3"
              style={{ display: 'inline-block', float: 'right' }}>
              <Button
                className="float-right mt-2 mr-3"
                color="primary"
                onClick={handleViewOutgoings}>
                Done
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};

PropertyLeaseRefund.propTypes = {
  canReleaseBond: PropTypes.bool,
  lease: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUploaderComplete: PropTypes.func,
  onView: PropTypes.func.isRequired,
};

PropertyLeaseRefund.defaultProps = {
  canReleaseBond: false,
};
