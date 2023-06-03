import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap';

import {
  ATTACHMENT_CATEGORIES,
  centsToDollar,
  isAgencyAgreement,
  toPercent,
} from '../../utils';
import { ButtonEdit } from '../Button';
import { CardLight } from '../Card';
import { ContentDefinition } from '../Content';
import { UploaderButton, UploaderFiles } from '../Uploader';

export const PropertyAuthoritiesCard = ({
  lease,
  property,
  isOwner,
  onClick,
  onUploaderComplete,
  ...props
}) => {
  const {
    id,
    specialAuthorities,
    internalNotes,
    lettingFee,
    lettingFeeUnit,
    leaseRenewal,
    leaseRenewalUnit,
  } = property;
  const history = useHistory();
  const attachments = (property.attachments || []).filter(isAgencyAgreement);
  const lettingFeeDisplay = lettingFee
    ? `${lettingFee}${lettingFeeUnit}`
    : null;
  const leaseRenewalDisplay = leaseRenewal
    ? `${leaseRenewal}${leaseRenewalUnit}`
    : null;

  const handleViewAuditLog = useCallback(() => {
    history.push(`/property/${id}/auditLog?page=1`);
  }, [id, history]);

  return (
    <CardLight {...props}>
      <CardHeader className="d-flex justify-content-between bg-white border-400">
        <CardTitle className="mb-0" tag="h5">
          Fees & Authorities
        </CardTitle>
        {onClick && !isOwner && <ButtonEdit onClick={onClick}>Edit</ButtonEdit>}
      </CardHeader>
      <CardBody>
        <Row>
          {!isOwner && (
            <Col sm={6}>
              <ContentDefinition
                label="Management Fee"
                value={`${toPercent(property.percentageManagementFee)}%`}
                className="mb-3 d-block"
              />
            </Col>
          )}
          <Col sm={6}>
            <ContentDefinition
              label="Wallet amount"
              value={centsToDollar(property.floatCents)}
              className="mb-3 d-block"
            />
          </Col>
        </Row>
        {!isOwner && (
          <Row>
            <Col sm={6}>
              <ContentDefinition
                label="Letting Fee"
                value={lettingFeeDisplay}
                className="mb-3 d-block"
              />
            </Col>
            <Col sm={6}>
              <ContentDefinition
                label="Lease Renewal"
                value={leaseRenewalDisplay}
                className="mb-3 d-block"
              />
            </Col>
            <Col sm={6}>
              <ContentDefinition
                label="Admin Fee"
                value={centsToDollar(property.adminFeeCents)}
                className="mb-3 d-block"
              />
            </Col>
            <Col sm={6}>
              <ContentDefinition
                label="Advertising Fee"
                value={centsToDollar(property.advertisingFeeCents)}
                className="mb-3 d-block"
              />
            </Col>
            <Col sm={6}>
              <ContentDefinition
                label="Approved Maintenance Spend Without Authorisation"
                value={centsToDollar(property.workOrderLimitCents)}
                className="mb-3 d-block"
              />
            </Col>
          </Row>
        )}
        <Row className="mb-3">
          <Col sm={12}>
            <ContentDefinition label="Managing agency agreement">
              <UploaderFiles
                attachments={attachments}
                attachableType="Property"
                attachableId={id}
                className="d-flex flex-wrap"
                onDestroyComplete={!isOwner ? onUploaderComplete : null}
              />
              {!isOwner && (
                <UploaderButton
                  attachableType="Property"
                  attachableId={property.id}
                  attachableCategory={ATTACHMENT_CATEGORIES.agencyAgreement}
                  onComplete={onUploaderComplete}
                />
              )}
            </ContentDefinition>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <ContentDefinition
              label="Special authorities"
              value={specialAuthorities}
              className="mb-3 d-block"
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </Col>
        </Row>
        {!isOwner && (
          <Row>
            <Col sm={12}>
              <ContentDefinition
                label="Internal Notes"
                value={internalNotes}
                className="mb-3 d-block"
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </Col>
          </Row>
        )}
        {!isOwner && (
          <Row>
            <Col sm={12} id={`auditlogs-${id}`}>
              <Row className="pl-3">
                <span className="d-block">
                  <small>
                    <strong>Audit Log</strong>
                  </small>
                </span>
              </Row>
            </Col>
            <Col>
              <Button
                color="link"
                className="px-0"
                onClick={handleViewAuditLog}>
                View Audit Log
              </Button>
            </Col>
          </Row>
        )}
      </CardBody>
    </CardLight>
  );
};

PropertyAuthoritiesCard.propTypes = {
  lease: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  onUploaderComplete: PropTypes.func,
};
