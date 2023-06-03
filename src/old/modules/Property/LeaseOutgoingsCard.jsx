import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import {
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  CustomInput,
  Row,
  UncontrolledCollapse,
} from 'reactstrap';

import {
  ATTACHMENT_CATEGORIES,
  centsToDollar,
  httpClient,
  isOutgoingsAttachment,
  toClassName,
} from '../../utils';
import { ButtonEdit } from '../Button';
import { CardLight } from '../Card';
import { ContentDefinition } from '../Content';
import { ModalOutgoingsEstimateBill } from '../Modal';
import { UploaderButton, UploaderFiles } from '../Uploader';
import { PropertyLeaseOutgoingsTable } from './LeaseOutgoingsTable';

export const PropertyLeaseOutgoingsCard = (props) => {
  const { lease, title, onUploaderComplete } = props;

  const [isEditingOutgoings, setIsEditingOutgoings] = useState(false);
  const [isTenantReceived, setIsTenantReceived] = useState(
    lease?.currentCommercialOutgoingsEstimate?.sentToTenant || false
  );
  const [outgoingsEstimate, setOutgoingsEstimate] = useState({});

  const outgoingsAttachments = useMemo(
    () => (lease.attachments || []).filter(isOutgoingsAttachment),
    [lease.attachments]
  );

  const handleOnEditOutgoings = useCallback(() => {
    if (!isEditingOutgoings) {
      httpClient
        .get(
          `/leases/${lease.id}/commercial/outgoings_estimates/${lease?.currentCommercialOutgoingsEstimate.id}`
        )
        .then((response) => {
          setOutgoingsEstimate(response.data.outgoingsEstimate);
          setIsEditingOutgoings(!isEditingOutgoings);
        })
        .catch((error) => {
          console.log('Internal Server error. Please contact Support', error);
        });
    }
  }, [
    lease.id,
    isEditingOutgoings,
    lease.currentCommercialOutgoingsEstimate.id,
  ]);

  const handleOnClose = useCallback(() => {
    setIsEditingOutgoings(false);
    window.location.reload();
  }, [setIsEditingOutgoings]);

  const handleChangeTenantReceived = useCallback(
    (e) => {
      let checkedValue = e.target.checked;
      setIsTenantReceived(checkedValue);
      httpClient
        .put(
          `/leases/${lease.id}/commercial/outgoings_estimates/${lease?.currentCommercialOutgoingsEstimate.id}`,
          {
            sentToTenant: checkedValue,
          }
        )
        .then((response) => {
          return null;
        })
        .catch((error) => {
          setIsTenantReceived(!checkedValue);
          console.log('Internal Server error. Please contact Support', error);
        });
    },
    [lease.id, lease.currentCommercialOutgoingsEstimate.id]
  );

  return (
    <>
      <CardLight className="d-flex h-100">
        <CardHeader className="d-flex bg-white border-400">
          <CardTitle className="mb-0 px-0 col-6" tag="h5">
            {title}
          </CardTitle>
          <div className="col-6 d-flex align-items-center justify-content-end">
            <ButtonEdit
              className="col-sm-6 col-md-5 col-lg-3 col-xl-3"
              disabled={
                isEditingOutgoings ||
                lease?.currentCommercialOutgoingsEstimate
                  ?.totalMonthlyTenantAmountCents === undefined
              }
              onClick={handleOnEditOutgoings}>
              Edit
            </ButtonEdit>
            <CustomInput
              className="d-flex col-sm-6 col-md-6 col-lg-5 col-xl-4 px-0 justify-content-end"
              checked={isTenantReceived}
              id="ougoingsEstimateTenantReceived"
              label="Tenant has Received"
              name="tenantReceived"
              type="checkbox"
              onChange={handleChangeTenantReceived}
            />
          </div>
        </CardHeader>
        <CardBody>
          <Row className={toClassName(['align-items-center'])}>
            <Col sm={12} id={`toggle-outgoings-${lease.id}`}>
              <Row>
                <Col
                  xs={1}
                  className="d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={['far', 'chevron-down']} />
                </Col>
                <Col xs={11} className="px-0">
                  Monthly Outgoing Bill:
                  <strong>
                    {centsToDollar(
                      lease?.currentCommercialOutgoingsEstimate
                        ?.totalMonthlyTenantAmountCents
                    )}
                  </strong>
                  {lease?.currentCommercialOutgoingsEstimate?.gstIncluded && (
                    <span className="ml-1 text-small text-primary">
                      (GST Inclusive)
                    </span>
                  )}
                </Col>
              </Row>
            </Col>
            <Col sm={{ size: 11, offset: 1 }} className="px-0">
              <UncontrolledCollapse
                toggler={`#toggle-outgoings-${lease.id}`}
                className="mt-4">
                {lease?.currentCommercialOutgoingsEstimate?.items?.length >
                0 ? (
                  <PropertyLeaseOutgoingsTable
                    outgoingsEstimate={
                      lease?.currentCommercialOutgoingsEstimate
                    }
                  />
                ) : (
                  <div>
                    No items found. Please click on Edit Button above to add
                    items
                  </div>
                )}
              </UncontrolledCollapse>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm={{ size: 11, offset: 1 }} className="px-0">
              <ContentDefinition label="Attachments">
                <UploaderFiles
                  attachments={outgoingsAttachments}
                  attachableType="Lease"
                  attachableId={lease.id}
                  onDestroyComplete={onUploaderComplete}
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
          </Row>
        </CardBody>
      </CardLight>
      {isEditingOutgoings && (
        <ModalOutgoingsEstimateBill
          size="xl"
          isOpen={isEditingOutgoings}
          title="Outgoings Estimate Bill"
          subTitle="This will automatically generate in monthly instalments."
          onClose={handleOnClose}
          outgoingsEstimate={outgoingsEstimate}
          lease={lease}
          handleSetOutgoings={setOutgoingsEstimate}
        />
      )}
    </>
  );
};

PropertyLeaseOutgoingsCard.propTypes = {
  lease: PropTypes.object,
  title: PropTypes.string,
  onUploaderComplete: PropTypes.func,
};

PropertyLeaseOutgoingsCard.defaultProps = {
  lease: {},
  title: 'Outgoings Estimates',
};
