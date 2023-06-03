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
  createCreditor,
  fetchExternalCreditor,
  getExternalCreditor,
  updateCreditor,
} from '../../../redux/users';

/**
 * Create/Edit/Show page for non-global External Creditors
 * Used when Managed Marketplace is disabled for an agency
 */
const ContactsCreditorComponent = (props) => {
  const {
    allAttachments,
    company,
    createBank,
    createCreditor,
    createdUserId,
    destroyAccount,
    disbursementAccount,
    disbursementAccounts,
    fetchAttachments,
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
  const isCreate = params.id === 'create';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const wasLoadingUser = usePrevious(isLoadingUser);

  const handleCancel = useCallback(
    () => history.push('/contacts/creditors'),
    [history]
  );

  const handleCompany = useCallback(
    (params) => {
      setIsSubmitting(true);
      updateCompany(params);
    },
    [updateCompany]
  );

  const handleCreditor = useCallback(
    (params) => {
      const onSubmit = isCreate ? createCreditor : updateCreditor;
      setIsSubmitting(true);
      onSubmit(params);
    },
    [createCreditor, isCreate, updateCreditor]
  );

  const handleDestroyAccount = useCallback(
    (externalCreditorId) => (params) => {
      destroyAccount({ ...params, externalCreditorId });
    },
    [destroyAccount]
  );

  const handleDefaultAccount = useCallback(
    (externalCreditorId) => (params) => {
      setDisbursement({ ...params, externalCreditorId });
    },
    [setDisbursement]
  );

  const handleSubmitAccount = useCallback(
    (externalCreditorId) => (params) => {
      createBank({
        ...params,
        isDisbursement: true,
        isOnboarding: true,
        externalCreditorId,
      });
    },
    [createBank]
  );

  const handleClickFinancials = useCallback(() => {
    history.push(`${match.url}/financials`);
  }, [history, match.url]);

  useEffect(() => {
    if (isSubmitting && wasLoadingUser && !isLoadingUser) {
      // Toggle isSubmitting when complete
      setIsSubmitting(false);

      if (createdUserId) {
        history.push(`/contacts/creditors/${createdUserId}`);
      }
    }
  }, [createdUserId, history, isLoadingUser, isSubmitting, wasLoadingUser]);

  useEffect(() => {
    if (user.bpayOutProvider) {
      handleCancel();
    }
  }, [handleCancel, user.bpayOutProvider]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (user.id) {
      fetchAttachments({
        attachableType: 'ExternalCreditor',
        attachableId: user.id,
      });

      if (!isCreate && !user.hasLogin && !createdUserId) {
        // Fetch the assembly account if creditor doesn't have login
        props.fetchAccounts({ externalCreditorId: user.id });
      }
    }
  }, [user.id]);

  useEffect(() => {
    if (isCreate || createdUserId) {
      // If create reset assembly
      props.resetAccounts();
    } else {
      // Fetch the user
      props.fetchExternalCreditor(params);

      // Fetch the promisepay company
      if (!company.id) {
        props.fetchCompany({
          ownerId: params.id,
          ownerType: 'ExternalCreditor',
        });
      }
    }
  }, [params.id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="wrapper" data-testid="container-contacts-creditor">
      <Header title={`${isCreate ? 'Invite' : 'Edit'} an external creditor`}>
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
            isMarketplaceEnabled={false}
            onSubmit={handleCreditor}
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
            canEdit={!isCreate}
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

ContactsCreditorComponent.propTypes = {
  allAttachments: PropTypes.array,
  company: PropTypes.object,
  createCreditor: PropTypes.func.isRequired,
  createdUserId: PropTypes.number,
  createBank: PropTypes.func.isRequired,
  destroyAccount: PropTypes.func.isRequired,
  disbursementAccount: PropTypes.object,
  disbursementAccounts: PropTypes.array,
  fetchAccounts: PropTypes.func.isRequired,
  fetchAttachments: PropTypes.func.isRequired,
  fetchCompany: PropTypes.func.isRequired,
  fetchExternalCreditor: PropTypes.func.isRequired,
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

ContactsCreditorComponent.defaultProps = {
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
    createdUserId: state.users.result,
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
  createCreditor,
  destroyAccount,
  fetchAccounts,
  fetchAttachments,
  fetchCompany,
  fetchExternalCreditor,
  resetAccounts,
  setDisbursement,
  updateCompany,
  updateCreditor,
};

export const ContactsCreditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsCreditorComponent);
