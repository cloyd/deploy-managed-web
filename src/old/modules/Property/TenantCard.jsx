import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import {
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  CustomInput,
  Row,
} from 'reactstrap';

import { useIsOpen } from '../../hooks';
import { formatDate, validatePhoneNumber } from '../../utils';
import { ButtonIcon } from '../Button/';
import { CardLight } from '../Card';
import { ContentDefinition } from '../Content';
import { FormPropertyTenants, FormUser } from '../Form';
import { useRolesContext } from '../Profile';
import { PropertyUserIcon } from '../Property';
import { TenantsInformationModal } from './TenantsInformationModal';

export const PropertyTenantCard = ({
  canCreateTenant,
  canViewContactDetails,
  hasError,
  isLoading,
  isLeaseCreated,
  tenantStartDate,
  onSubmit,
  secondaryTenants,
  tenant,
  isLoadingLease,
  property,
}) => {
  const [tenantType, setTenantType] = useState(
    property.propertyType === 'commercial' ? 'company' : 'private'
  );
  const [isTenantInfoOpen, actions] = useIsOpen();

  const { isManager, isPrincipal } = useRolesContext();

  const {
    isValid: isValidPhoneNumber,
    value: phoneValue,
    error,
  } = validatePhoneNumber({
    mobileNumber: tenant?.phoneNumber,
  });

  const handleSubmitPrimaryTenant = useCallback(
    (values) => {
      const submitValues = {
        primaryTenantLeaseAttributes: {
          tenantAttributes: {
            user_attributes: {
              email: values.email,
              firstName: values.firstName,
              lastName: values.lastName,
              phoneNumber: values.phoneNumber,
            },
          },
        },
      };
      if (tenantType === 'company') {
        submitValues['primaryTenantLeaseAttributes']['tenantAttributes'][
          'companyAttributes'
        ] = {
          legalName: values.companyName,
          taxNumber: values.taxNumber,
        };
      }
      onSubmit(submitValues);
    },
    [onSubmit, tenantType]
  );

  const handleSubmitSecondaryTenants = useCallback(
    (values) => {
      onSubmit({
        secondaryTenantsAttributes: values,
      });
    },
    [onSubmit]
  );

  const handleTenantTypeChange = useCallback(
    (e) => {
      setTenantType(e.target.value);
    },
    [setTenantType]
  );

  return (
    <>
      <CardLight className="d-flex h-100" data-testid="tenant-card">
        <CardHeader className="d-md-flex bg-white justify-content-between align-items-end border-400">
          <CardTitle className="mb-0" tag="h5">
            Tenants
            {!tenant?.id && canCreateTenant && (
              <div className="w-100 h6 d-flex justify-content-end align-items-center mb-1">
                <CustomInput
                  checked={tenantType === 'private'}
                  id="private"
                  className="pr-3"
                  label="Personally"
                  name="tenantType"
                  type="radio"
                  value="private"
                  onChange={handleTenantTypeChange}
                  disabled={property.isArchived}
                />
                <CustomInput
                  checked={tenantType === 'company'}
                  id="company"
                  label="Company / Trust"
                  name="tenantType"
                  type="radio"
                  value="company"
                  onChange={handleTenantTypeChange}
                  disabled={property.isArchived}
                />
              </div>
            )}
            {tenant?.id &&
              (tenant?.company === null || tenant?.company === undefined ? (
                <div className="h6">(Personally)</div>
              ) : (
                <div className="h6">(Company / Trust)</div>
              ))}
          </CardTitle>
          {tenant?.firstName && (isManager || isPrincipal) && (
            <>
              <ButtonIcon
                size="sm"
                icon={['far', 'eye']}
                iconStyle={{ position: 'relative', top: '0.08rem' }}
                style={{ padding: '0.1875rem 0' }}
                onClick={actions.handleOpen}>
                <small>See All Tenants Info</small>
              </ButtonIcon>
              <TenantsInformationModal
                isOpen={isTenantInfoOpen}
                onClose={actions.handleClose}
                secondaryTenants={secondaryTenants}
                tenant={tenant}
              />
            </>
          )}
        </CardHeader>
        <CardBody>
          {tenant && tenant.id ? (
            <Row>
              {tenant.company && (
                <Col xs={12} className="mt-2">
                  <ContentDefinition
                    label="Company Name"
                    className="d-block"
                    value={tenant?.company?.legalName}
                  />
                </Col>
              )}
              {tenant.company && (
                <Col xs={12} className="mt-2">
                  <ContentDefinition
                    label="ABN/ACN"
                    className="d-block"
                    value={tenant?.company?.taxNumber}
                  />
                </Col>
              )}
              <Col xs={12} sm={6}>
                <ContentDefinition label="Name">
                  <PropertyUserIcon
                    key={`user-${tenant.id}`}
                    className="mt-0"
                    disabled={false}
                    role={'tenant'}
                    user={tenant}
                  />
                </ContentDefinition>
              </Col>
              {canViewContactDetails && (
                <>
                  <Col xs={12} sm={6}>
                    <ContentDefinition
                      label="Mobile"
                      className="d-block"
                      value={phoneValue}>
                      {!isValidPhoneNumber && <span>{error}</span>}
                    </ContentDefinition>
                  </Col>
                  <Col xs={12} sm={6}>
                    <ContentDefinition
                      label="Email"
                      className="d-block mt-2 text-truncate">
                      <a href={`mailto:${tenant.email}`} className="btn-link">
                        {tenant.email}
                      </a>
                    </ContentDefinition>
                  </Col>
                  <Col xs={12} sm={6}>
                    <ContentDefinition
                      className="d-block mt-2"
                      label="Living in property since"
                      value={formatDate(tenantStartDate) || ''}
                    />
                  </Col>
                  <Col xs={12} className="mt-2">
                    <small className="font-weight-bold">Other tenants</small>
                    <FormPropertyTenants
                      isLoading={isLoading}
                      hasError={hasError}
                      onSubmit={isManager ? handleSubmitSecondaryTenants : null}
                      secondaryTenants={secondaryTenants}
                    />
                  </Col>
                </>
              )}
            </Row>
          ) : (
            <Row>
              <Col>
                {canCreateTenant ? (
                  <FormUser
                    user={tenant || {}}
                    helpText={
                      isLeaseCreated
                        ? undefined
                        : 'A lease must be created before adding the tenant.'
                    }
                    isDisabled={!isLeaseCreated}
                    isLoading={isLoading}
                    isLoadingLease={isLoadingLease}
                    hasError={hasError}
                    onSubmit={handleSubmitPrimaryTenant}
                    tenantType={tenantType}
                    type="tenant"
                    isSearchable
                  />
                ) : (
                  <p>Awaiting tenant.</p>
                )}
              </Col>
            </Row>
          )}
        </CardBody>
      </CardLight>
    </>
  );
};

PropertyTenantCard.propTypes = {
  canCreateTenant: PropTypes.bool.isRequired,
  canViewContactDetails: PropTypes.bool,
  hasError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  isLeaseCreated: PropTypes.bool,
  tenantStartDate: PropTypes.string,
  nextPaymentDate: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  secondaryTenants: PropTypes.array,
  tenant: PropTypes.object,
  isLoadingLease: PropTypes.bool,
  property: PropTypes.object,
};

PropertyTenantCard.defaultProps = {
  canViewContactDetails: false,
  isLoading: true,
  isLeaseCreated: false,
};
