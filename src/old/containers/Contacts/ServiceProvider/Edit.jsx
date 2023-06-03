import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Container } from 'reactstrap';

import { usePrevious } from '../../../hooks';
import { CardLight } from '../../../modules/Card';
import { ExternalCreditorFormDetails } from '../../../modules/ExternalCreditor';
import { Header } from '../../../modules/Header';
import { PaymentDisbursementV2 } from '../../../modules/Payment';
import { UploaderFiles } from '../../../modules/Uploader';
import { UserFormCompany } from '../../../modules/User';
import {
  createBank,
  destroyAccount,
  fetchAccounts,
  getBankAccounts,
  getDisbursementAccount,
  resetAccounts,
  setDisbursement,
} from '../../../redux/assembly';
import { fetchAttachments, getAttachments } from '../../../redux/attachment';
import {
  fetchCompany,
  getCompany,
  updateCompany,
} from '../../../redux/company';
import { hasError } from '../../../redux/notifier';
import { getProfile } from '../../../redux/profile';
import {
  EXTERNAL_CREDITOR_CLASSIFICATIONS,
  fetchServiceProvider,
  getExternalCreditor,
  updateCreditor,
} from '../../../redux/users';

/**
 * Edit page for Service Providers
 * Used when Managed Marketplace is enabled for an agency
 */
const ContainerComponent = (props) => {
  const {
    allAttachments,
    company,
    createBank,
    destroyAccount,
    disbursementAccount,
    disbursementAccounts,
    hasError,
    history,
    isLoadingAssembly,
    isLoadingUser,
    match,
    params,
    setDisbursement,
    updateCompany,
    updateCreditor,
    user,
    profile,
  } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const wasLoadingUser = usePrevious(isLoadingUser);

  const handleCancel = useCallback(
    () => history.push('/contacts/service-providers'),
    [history]
  );

  const handleCompany = useCallback(
    (values) => {
      setIsSubmitting(true);
      updateCompany(values);
    },
    [updateCompany]
  );

  const handleUpdateCreditor = useCallback(
    (values) => {
      setIsSubmitting(true);
      updateCreditor(values);
    },
    [updateCreditor]
  );

  const handleDestroyAccount = useCallback(
    (externalCreditorId) => (values) => {
      destroyAccount({ ...values, externalCreditorId });
    },
    [destroyAccount]
  );

  const handleDefaultAccount = useCallback(
    (externalCreditorId) => (values) => {
      setDisbursement({ ...values, externalCreditorId });
    },
    [setDisbursement]
  );

  const handleSubmitAccount = useCallback(
    (externalCreditorId) => (values) => {
      createBank({
        ...values,
        isDisbursement: true,
        isOnboarding: true,
        externalCreditorId,
      });
    },
    [createBank]
  );

  const handleClickFinancials = useCallback(
    () => history.push(`${match.url}/financials`),
    [history, match.url]
  );

  useEffect(() => {
    if (isSubmitting && wasLoadingUser && !isLoadingUser) {
      // Toggle isSubmitting when complete
      setIsSubmitting(false);
    }
  }, [isLoadingUser, isSubmitting, wasLoadingUser]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (user.id) {
      if (
        user.classification !==
        EXTERNAL_CREDITOR_CLASSIFICATIONS.serviceProvider
      ) {
        handleCancel();
      } else {
        props.fetchAttachments({
          attachableType: 'ExternalCreditor',
          attachableId: user.id,
        });

        if (user.isDisbursementAccountSet) {
          props.fetchAccounts({ externalCreditorId: user.id });
        }

        if (user.promisepayUserPromisepayCompanyLegalName) {
          props.fetchCompany({
            ownerId: params.id,
            ownerType: 'ExternalCreditor',
          });
        }
      }
    }
  }, [user.id]);

  useEffect(() => {
    if (params.id) {
      props.fetchServiceProvider(params);
    }
  }, [params.id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="wrapper" data-testid="container-contacts-service-provider">
      <Header title="Edit Service Provider">
        {user.id && (
          <Button
            className="text-capitalize"
            color="primary"
            size="sm"
            onClick={handleClickFinancials}>
            Financials
          </Button>
        )}
      </Header>
      <Container>
        <CardLight
          title="Personal Details"
          isLoading={isLoadingUser}
          className="mb-3">
          <ExternalCreditorFormDetails
            externalCreditor={user}
            hasError={hasError}
            isLoading={isLoadingUser}
            isMarketplaceEnabled={true}
            onSubmit={handleUpdateCreditor}
            onCancel={handleCancel}
          />
        </CardLight>
        {user.id && (
          <>
            <CardLight title="Company Details" className="mb-3">
              <UserFormCompany
                company={company}
                hasError={hasError}
                isLoading={isLoadingUser}
                onSubmit={handleCompany}
                onCancel={handleCancel}
              />
            </CardLight>
            <CardLight title="Insurance and License documents" className="mb-3">
              <UploaderFiles
                attachments={allAttachments}
                attachableType="ExternalCreditor"
                attachableId={user.id}
              />
            </CardLight>
          </>
        )}
        {user.id && !user.hasLogin && (
          <PaymentDisbursementV2
            account={disbursementAccount}
            accounts={disbursementAccounts}
            canEdit={true}
            hasError={hasError}
            isLoading={isLoadingAssembly}
            onDestroy={handleDestroyAccount(user.id)}
            onSetDefault={handleDefaultAccount(user.id)}
            onSubmit={handleSubmitAccount(user.id)}
            hostedFieldsEnv={profile.hostedFieldsEnv}
          />
        )}
      </Container>
    </div>
  );
};

ContainerComponent.propTypes = {
  allAttachments: PropTypes.array,
  company: PropTypes.object,
  createBank: PropTypes.func.isRequired,
  destroyAccount: PropTypes.func.isRequired,
  disbursementAccount: PropTypes.object,
  disbursementAccounts: PropTypes.array,
  fetchAccounts: PropTypes.func.isRequired,
  fetchAttachments: PropTypes.func.isRequired,
  fetchCompany: PropTypes.func.isRequired,
  fetchServiceProvider: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  history: PropTypes.object.isRequired,
  isLoadingAssembly: PropTypes.bool,
  isLoadingUser: PropTypes.bool,
  match: PropTypes.object,
  params: PropTypes.object,
  resetAccounts: PropTypes.func.isRequired,
  setDisbursement: PropTypes.func.isRequired,
  updateCompany: PropTypes.func.isRequired,
  updateCreditor: PropTypes.func.isRequired,
  user: PropTypes.object,
  profile: PropTypes.object,
};

ContainerComponent.defaultProps = {
  disbursementAccount: {},
  disbursementAccounts: [],
  hasError: false,
  isLoadingAssembly: true,
  isLoadingUser: true,
  params: {},
  user: {},
  company: {},
};

const mapStateToProps = (state, props) => {
  const { params } = props.match;

  return {
    allAttachments: getAttachments(state.attachment),
    disbursementAccount: getDisbursementAccount(state.assembly),
    disbursementAccounts: getBankAccounts(state.assembly),
    company: getCompany(state.company, 'ExternalCreditor', params.id),
    hasError: hasError(state),
    isLoadingAssembly: state.assembly.isLoading,
    isLoadingUser: state.company.isLoading || state.users.isLoading,
    params,
    user: getExternalCreditor(state.users, params.id),
    profile: getProfile(state.profile),
  };
};

const mapDispatchToProps = {
  createBank,
  destroyAccount,
  fetchAccounts,
  fetchAttachments,
  fetchCompany,
  fetchServiceProvider,
  resetAccounts,
  setDisbursement,
  updateCompany,
  updateCreditor,
};

export const ServiceProviderEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerComponent);
