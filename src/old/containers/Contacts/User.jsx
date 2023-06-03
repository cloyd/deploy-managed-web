import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Button,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Row,
} from 'reactstrap';

import { useDownloadLinks, useIsChanged } from '../../hooks';
import { ButtonEdit } from '../../modules/Button';
import {
  CardDisbursementFrequency,
  CardLight,
  CardWalletBalance,
} from '../../modules/Card';
import {
  formatUserTypeParam,
  useContactRole,
} from '../../modules/Contacts/hooks';
import { Header } from '../../modules/Header';
import {
  PaymentBankValue,
  PaymentBpayIcon,
  PaymentBpayValue,
  PaymentCardValue,
  PaymentVirtualAccountIcon,
  PaymentVirtualAccountValue,
} from '../../modules/Payment';
import { useRolesContext } from '../../modules/Profile';
import { PropertyCardOwner, PropertyCardTenant } from '../../modules/Property';
import { DownloadReport } from '../../modules/Report';
import {
  UserCardHeader,
  UserKycCompanyCard,
  UserKycPersonalCard,
} from '../../modules/User';
import {
  fetchAccounts,
  getBankAccountsKeyed,
  getCardAccountsKeyed,
  getPaymentAccount,
  isBpayPayment,
} from '../../redux/assembly';
import { fetchCompany, getOwnerCompany } from '../../redux/company';
import {
  fetchProperty,
  getPropertiesFromIds,
  getPropertyOwnershipsFromIds,
} from '../../redux/property';
import {
  createVirtualAccount,
  fetchUser,
  getUserByType,
  getUserPropertyAccountIds,
  getUserPropertyIds,
} from '../../redux/users';
import { formatPhoneNumber } from '../../utils';

const ContactsUserComponent = (props) => {
  const {
    agencyId,
    bankAccounts,
    cardAccounts,
    company,
    propertyAccountIds,
    fetchAccounts,
    fetchCompany,
    fetchProperty,
    fetchUser,
    history,
    isLoading,
    isShowBpay,
    ownerId,
    params,
    paymentAccount,
    properties,
    propertyOwnerships,
    propertyIds,
    type,
    user,
    createVirtualAccount,
  } = props;
  const isChangedPropertyIds = useIsChanged(propertyIds);
  const ownerType = agencyId ? 'Agency' : type;

  const downloadLinks = useDownloadLinks(
    `/api/tenants/${params.id}/pay-in-report`,
    `${user.firstName} ${user.lastName}_pay-in-report`
  );

  const { isManager, isPrincipal, isCorporateUser } = useRolesContext();

  const contactRole = useContactRole(type);

  const show = useMemo(() => {
    const hasPaymentAccount =
      !!paymentAccount && Object.keys(paymentAccount).length > 0;
    const paymentCardAccount =
      !contactRole.isOwner && hasPaymentAccount && !!paymentAccount.type;
    const paymentBankAccount =
      !contactRole.isOwner && hasPaymentAccount && !!paymentAccount.accountType;
    const bpayDetails =
      !isLoading &&
      contactRole.isTenant &&
      (user.isPrimaryTenant || user.isPrimaryTenantOfSomeTerminatedLease) &&
      (isManager || isShowBpay);

    return {
      bpayDetails,
      paymentBankAccount,
      paymentCardAccount,
      agencyAccess: contactRole.isManager && isPrincipal,
      bpayReports: contactRole.isTenant,
      kycPersonal: contactRole.isOwner,
      kycCompany: contactRole.isOwner && !!company.legalName,
      paymentsHeading: bpayDetails || paymentBankAccount || paymentCardAccount,
      properties:
        !isLoading && properties && Object.keys(properties).length > 0,
      wallet: contactRole.isOwner || contactRole.isTenant,
      disbursementFrequency: contactRole.isOwner,
      // Logged in user should be (isManager || isPrincipal || isCorporateUser) and the type of contact should be tenant or owner
      agencyNotes:
        (isManager || isPrincipal || isCorporateUser) &&
        (contactRole.isOwner || contactRole.isTenant),
      autoPaySelection: (isManager || isPrincipal) && contactRole.isTenant,
    };
  }, [
    company.legalName,
    contactRole,
    isLoading,
    isManager,
    isPrincipal,
    isShowBpay,
    paymentAccount,
    properties,
    user.isPrimaryTenant,
    user.isPrimaryTenantOfSomeTerminatedLease,
    isCorporateUser,
  ]);

  const getOwnerPercentageSplit = useCallback(
    (propertyId, ownerId) => {
      const propertyOwnership = propertyOwnerships[propertyId] || {};
      const ownership = propertyOwnership[ownerId] || {};
      return ownership.percentageSplit || 0;
    },
    [propertyOwnerships]
  );

  const disbursementAccount = useCallback(
    (propertyAccountIds, bankAccounts) => (propertyId, ownerId) => {
      const propertyAccounts = propertyAccountIds[propertyId] || {};
      const { disbursementAccounts } = propertyAccounts;

      const ownerAccount =
        disbursementAccounts &&
        disbursementAccounts.find((a) => a.ownerId === ownerId);

      return ownerAccount && ownerAccount.disbursementAccountId
        ? bankAccounts[ownerAccount.disbursementAccountId]
        : null;
    },
    []
  )(propertyAccountIds, bankAccounts);

  const handleEdit = useCallback(
    () => history.push(`/contacts/${params.type}/${params.id}/edit`),
    [history, params.id, params.type]
  );

  const handleProperty = useCallback(
    (property) => () => history.push(`/property/${property.id}`),
    [history]
  );

  const handleGenerateDetails = useCallback(() => {
    contactRole.isTenant && createVirtualAccount({ tenantId: user.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, contactRole.isTenant]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isChangedPropertyIds) {
      // Check that property data exists, else fetch it
      propertyIds.forEach((id) => {
        if (Object.keys(properties[id]).length === 0) {
          fetchProperty({ propertyId: id });
        }
      });
    }
  }, [isChangedPropertyIds, properties, propertyIds]);

  useEffect(() => {
    if (params.id) {
      contactRole.isOwner && fetchAccounts({ ownerId: params.id });
      contactRole.isTenant && fetchAccounts({ tenantId: params.id });
    }
  }, [params.id]);

  useEffect(() => {
    if (contactRole.isOwner && ownerId && ownerType) {
      fetchCompany({ ownerId, ownerType });
    }
  }, [ownerId]);

  useEffect(() => {
    fetchUser(params);
  }, [params.type, params.id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const autoPaymentSelection = useMemo(
    () => [
      { title: 'Automatically pay my rent', value: user.autoRentPayment },
      { title: 'Automatically pay my bill', value: user.autoBillPayment },
    ],
    [user.autoBillPayment, user.autoRentPayment]
  );

  return (
    <>
      <Header title={startCase(type)}>
        {contactRole.isOwner && ownerId && (
          <Link
            className="btn btn-primary btn-sm"
            to={`/contacts/owners/${ownerId}/financials`}>
            Financials
          </Link>
        )}
        <ButtonEdit color="primary" onClick={handleEdit}>
          Edit
        </ButtonEdit>
      </Header>
      <Container>
        {show.wallet && (
          <CardWalletBalance
            amountCents={user.walletBalanceAmountCents}
            isOwner={contactRole.isOwner}
          />
        )}
        {show.disbursementFrequency && (
          <CardDisbursementFrequency
            frequency={user.withdrawalFrequency}
            ownerId={ownerId}
          />
        )}
        {!contactRole.isBpay && (
          <CardLight className="mb-3" data-testid="contact-account-details">
            <UserCardHeader user={user} type={type} />
            <CardBody>
              <Row>
                {user.kind === 'company' && user?.company?.legalName && (
                  <Col xs={6}>
                    <p className="mb-1">
                      <strong>Company Name</strong>
                    </p>
                    <p>{user.company.legalName}</p>
                  </Col>
                )}
                {user.kind === 'company' && user?.company?.taxNumber && (
                  <Col xs={6}>
                    <p className="mb-1">
                      <strong>ABN/ACN</strong>
                    </p>
                    <p>{user.company.taxNumber}</p>
                  </Col>
                )}
                <Col xs={6}>
                  <p className="mb-1">
                    <strong>
                      {user.kind === 'company'
                        ? 'Contact First Name'
                        : 'First Name'}
                    </strong>
                  </p>
                  <p>{user.firstName}</p>
                </Col>
                <Col xs={6}>
                  <p className="mb-1">
                    <strong>
                      {user.kind === 'company'
                        ? 'Contact Last Name'
                        : 'Last Name'}
                    </strong>
                  </p>
                  <p>{user.lastName}</p>
                </Col>
                <Col xs={6} className="mb-3">
                  <p className="mb-1">
                    <strong>Email</strong>
                  </p>
                  <a className="text-primary" href={`mailto:${user.email}`}>
                    {user.email}
                  </a>
                </Col>
                <Col xs={6} className="mb-3">
                  <p className="mb-1">
                    <strong>Mobile</strong>
                  </p>
                  <a className="text-primary" href={`tel:${user.phoneNumber}`}>
                    {formatPhoneNumber(user.phoneNumber)}
                  </a>
                </Col>
                {show.agencyNotes && (
                  <Col xs={12} className="mb-3">
                    <p className="mb-1">
                      <strong>Agency Notes</strong>
                    </p>
                    <p>{user?.agencyNote?.body || '-'}</p>
                  </Col>
                )}
              </Row>
            </CardBody>
          </CardLight>
        )}
        {show.autoPaySelection && (
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <CardLight
                className="mb-3 h-100"
                data-testid="show-autopayment-selection"
                title="Automate my payments">
                {autoPaymentSelection.map(({ title, value }) => (
                  <div key={`autopay-selection-${title}`}>
                    <FontAwesomeIcon
                      className={`mr-1 ${
                        value ? 'text-success' : 'text-danger'
                      }`}
                      icon={['far', value ? 'check-circle' : 'times-circle']}
                    />
                    {title}
                  </div>
                ))}
              </CardLight>
            </Col>
            <Col xs={12} md={6}>
              {show.bpayReports && (
                <DownloadReport
                  className="h-100"
                  title="Tenant PAY in Report"
                  downloadLinks={downloadLinks}
                />
              )}
            </Col>
          </Row>
        )}

        {contactRole.isBpay && (
          <CardLight className="mb-3">
            <CardHeader className="d-flex justify-content-between bg-white border-400">
              <CardTitle className="mb-0" tag="h5">
                Bpay Details
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col sm={4}>
                  <p className="mb-1">
                    <strong>Biller Name</strong>
                  </p>
                  <p>{user.name}</p>
                </Col>
                <Col sm={4}>
                  <p className="mb-1">
                    <strong>Biller Code</strong>
                  </p>
                  <p>{user.billerCode}</p>
                </Col>
                <Col sm={4}>
                  <p className="mb-1">
                    <strong>Collects GST?</strong>
                  </p>
                  <p>{user.gstIncluded ? 'Yes' : 'No'}</p>
                </Col>
              </Row>
            </CardBody>
          </CardLight>
        )}
        {user.id && show.agencyAccess && (
          <CardLight
            className="mb-3"
            data-testid="contact-agency-access"
            title="This manager has access to the following agencies:">
            {user.managerAgencies.map((agency) => (
              <p
                key={agency.tradingName}
                data-testid="contact-agency-access-agency">
                {agency.tradingName}
              </p>
            ))}
          </CardLight>
        )}
        {show.kycPersonal && <UserKycPersonalCard user={user} />}
        {show.kycCompany && <UserKycCompanyCard company={company} />}
        {show.paymentsHeading && (
          <h5 className="border-bottom pt-2 pb-3">Payment Method</h5>
        )}
        {show.paymentCardAccount && (
          <PaymentCardValue account={paymentAccount} hasDefaultBadge={true} />
        )}
        {show.paymentBankAccount && (
          <PaymentBankValue account={paymentAccount} hasDefaultBadge={true} />
        )}
        {show.bpayDetails && (
          <CardLight className="mt-2 mb-3" data-testid="contact-bpay-details">
            <CardBody>
              <Row className="d-flex">
                <Col className="col-6">
                  <PaymentBpayIcon>
                    <PaymentBpayValue
                      bpayBillerCode={user.bpayBillerCode}
                      bpayReference={user.bpayReference}
                    />
                  </PaymentBpayIcon>
                </Col>
                <Col className="col-6">
                  {(user.virtualAccount || user.canGenerateVirtualAccount) && (
                    <PaymentVirtualAccountIcon
                      className={!user?.virtualAccount?.status && 'text-center'}
                      title={
                        user?.virtualAccount?.status
                          ? 'Direct Payment'
                          : 'Direct payment to a unique BSB and Account Number'
                      }
                      virtualAccountStatus={user?.virtualAccount?.status}>
                      {!user.canGenerateVirtualAccount ? (
                        <PaymentVirtualAccountValue
                          virtualAccountBsb={user.virtualAccount?.routingNumber}
                          virtualAccountNumber={
                            user.virtualAccount?.accountNumber
                          }
                        />
                      ) : (
                        <Button
                          color="primary"
                          className="mt-1"
                          onClick={handleGenerateDetails}>
                          Generate Details
                        </Button>
                      )}
                    </PaymentVirtualAccountIcon>
                  )}
                </Col>
              </Row>
            </CardBody>
          </CardLight>
        )}
        {show.properties && (
          <>
            <h5 className="border-bottom pt-2 pb-3">
              {contactRole.isTenant ? 'Leases' : 'Properties'}
            </h5>
            {contactRole.isOwner &&
              propertyIds.map(
                (id) =>
                  properties[id] &&
                  properties[id].archivedAt === null && (
                    <PropertyCardOwner
                      key={`property-${id}`}
                      ownerId={ownerId}
                      ownerPercentageSplit={getOwnerPercentageSplit(
                        id,
                        ownerId
                      )}
                      disbursementAccount={disbursementAccount(id, ownerId)}
                      paymentAccount={
                        propertyAccountIds[id] &&
                        propertyAccountIds[id].paymentBankAccountId
                          ? bankAccounts[
                              propertyAccountIds[id].paymentBankAccountId
                            ]
                          : cardAccounts[
                              propertyAccountIds[id].paymentCardAccountId
                            ]
                      }
                      property={properties[id]}
                      handleProperty={handleProperty}
                    />
                  )
              )}
            {contactRole.isTenant &&
              propertyIds.map(
                (id) =>
                  properties[id] && (
                    <PropertyCardTenant
                      key={`property-${id}`}
                      property={properties[id]}
                      handleProperty={handleProperty}
                    />
                  )
              )}
          </>
        )}
      </Container>
    </>
  );
};

ContactsUserComponent.propTypes = {
  agencyId: PropTypes.number,
  bankAccounts: PropTypes.object,
  cardAccounts: PropTypes.object,
  company: PropTypes.object,
  fetchAccounts: PropTypes.func.isRequired,
  fetchCompany: PropTypes.func.isRequired,
  fetchProperty: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  history: PropTypes.object,
  isLoading: PropTypes.bool,
  isShowBpay: PropTypes.bool,
  ownerId: PropTypes.number,
  params: PropTypes.object,
  paymentAccount: PropTypes.object,
  properties: PropTypes.object,
  propertyOwnerships: PropTypes.object,
  propertyAccountIds: PropTypes.object,
  propertyIds: PropTypes.array,
  type: PropTypes.string,
  user: PropTypes.object,
  createVirtualAccount: PropTypes.func.isRequired,
};

ContactsUserComponent.defaultProps = {
  bankAccounts: {},
  cardAccounts: {},
  company: {},
  isLoading: false,
  isShowBpay: false,
  paymentAccount: {},
  propertyAccountIds: {},
  propertyOwnerships: {},
  properties: [],
  propertyIds: [],
  user: {},
};

const mapStateToProps = (state, props) => {
  const { params } = props.match || {};
  const type = formatUserTypeParam(params.type);
  const user = getUserByType(state.users, params.id, type);

  // Owner property disbursement IDs
  const propertyAccountIds = getUserPropertyAccountIds(
    state.users,
    params.id,
    type
  );

  // Owner and tenant associated property IDs
  const propertyIds = getUserPropertyIds(state.users, params.id, type);

  const agencyId = user.agency && user.agency.id;
  const ownerId = agencyId || user.id;

  return {
    agencyId,
    bankAccounts: getBankAccountsKeyed(state.assembly),
    cardAccounts: getCardAccountsKeyed(state.assembly),
    company: getOwnerCompany(state.company, ownerId),
    isLoading:
      state.users.isLoading ||
      state.assembly.isLoading ||
      state.property.isLoading,
    isShowBpay: isBpayPayment(state.assembly),
    ownerId,
    params,
    paymentAccount: getPaymentAccount(state.assembly), // For Owners & Tenants
    properties: getPropertiesFromIds(state.property, propertyIds),
    propertyOwnerships: getPropertyOwnershipsFromIds(
      state.property,
      propertyIds
    ),
    propertyAccountIds,
    propertyIds,
    type,
    user,
  };
};

const mapDispatchToProps = {
  fetchAccounts,
  fetchCompany,
  fetchProperty,
  fetchUser,
  createVirtualAccount,
};

export const ContactsUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsUserComponent);
