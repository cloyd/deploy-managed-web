import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Button, Col, Row, UncontrolledTooltip } from 'reactstrap';

import { useIsMobile } from '../../hooks';
import { copyToClipboard } from '../../utils';
import { ButtonIcon } from '../Button';
import { ModalConfirm } from '../Modal';

export const TenantsInformationModal = ({
  isOpen,
  onClose,
  secondaryTenants,
  tenant,
}) =>
  isOpen && (
    <ModalConfirm isOpen={isOpen} size="lg" title="All Tenants Information">
      <strong className="text-primary">Primary</strong>
      <Row className="mb-1 d-flex align-items-center">
        <Col className="col-12 col-lg-3">
          <small className="font-weight-bold">
            {tenant.firstName + ' ' + tenant.lastName}
          </small>
        </Col>
        <Col className="col-12 col-lg-4">
          <Information
            field="phoneNumber"
            value={tenant.phoneNumber}
            tenantId={tenant.id}
          />
        </Col>
        <Col className="col-12 col-lg-5">
          <Information
            field="email"
            value={tenant.email}
            tenantId={tenant.id}
          />
        </Col>
      </Row>
      {!!secondaryTenants.length && (
        <strong className="text-primary">Other tenants</strong>
      )}
      {secondaryTenants.map(
        ({ id, firstName, lastName, phoneNumber, email }) => {
          return (
            <Row key={id}>
              <Col className="col-12 col-lg-3">
                <small className="font-weight-bold">
                  {firstName + ' ' + lastName}
                </small>
              </Col>
              <Col className="col-12 col-lg-4">
                <Information
                  field="phoneNumber"
                  value={phoneNumber}
                  tenantId={id}
                />
              </Col>
              <Col className="col-12 col-lg-5">
                <Information field="email" value={email} tenantId={id} />
              </Col>
            </Row>
          );
        }
      )}
      <Row className="mt-3">
        <Col className="d-flex justify-content-end">
          <Button color="primary" outline onClick={onClose}>
            Close
          </Button>
        </Col>
      </Row>
    </ModalConfirm>
  );

TenantsInformationModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  secondaryTenants: PropTypes.array,
  tenant: PropTypes.object.isRequired,
};

const Information = ({ field, tenantId, value }) => {
  const isMobile = useIsMobile();
  const [isCopied, setIsCopied] = useState(false);
  const maxLength = field === 'email' ? 42 : 34;
  const isValueLong = value.length > maxLength;

  const handleCopy = useCallback(
    (value) => () => {
      copyToClipboard(value);
      setIsCopied(true);
    },
    []
  );

  const handleBlur = useCallback(() => {
    setIsCopied(false);
  }, []);

  return (
    <div className="d-flex justify-content-between align-items-center">
      <small id={`${field}-${tenantId}`}>
        {!isMobile && isValueLong ? value.slice(0, maxLength) + '...' : value}
      </small>
      <ButtonIcon
        id={`${field}-${tenantId}-copy`}
        size="sm"
        icon={['far', 'clipboard-list']}
        className="p-0"
        onClick={handleCopy(value)}
        onBlur={handleBlur}
      />
      {!isMobile && isValueLong ? (
        <UncontrolledTooltip target={`${field}-${tenantId}`} placement="top">
          {value}
        </UncontrolledTooltip>
      ) : null}
      <UncontrolledTooltip target={`${field}-${tenantId}-copy`} placement="top">
        {isCopied ? 'Copied!' : 'Copy'}
      </UncontrolledTooltip>
    </div>
  );
};

Information.propTypes = {
  field: PropTypes.string,
  tenantId: PropTypes.number,
  value: PropTypes.string,
};
