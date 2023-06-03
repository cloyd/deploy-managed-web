import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';

import { CardLight } from '../../modules/Card';
import { ExternalCreditorFormMarketplaceDetails } from '../../modules/ExternalCreditor';
import { FormTwoFactorAuth } from '../../modules/Form';
import { useMarketplaceTags } from '../../modules/Marketplace/hooks';
import { UploaderButton, UploaderFiles } from '../../modules/Uploader';
import { UserFormCompany } from '../../modules/User';
import {
  fetchAttachments,
  getAttachments,
  updateAttachments,
} from '../../redux/attachment';
import { fetchCompany, getCompany, updateCompany } from '../../redux/company';
import {
  fetchMarketplaceTags,
  getMarketplaceTags,
} from '../../redux/marketplace';
import { hasError } from '../../redux/notifier';
import {
  disableAuthy,
  enableAuthy,
  getProfile,
  requestAuthySMS,
} from '../../redux/profile';
import { fetchUser, getUser, updateCreditor } from '../../redux/users';
import { ATTACHMENT_CATEGORIES, isInsuranceLicenseDocument } from '../../utils';

const ProfileExternalCreditorFormComponent = (props) => {
  const {
    allAttachments,
    company,
    fetchAttachments,
    fetchCompany,
    fetchUser,
    hasError,
    isLoadingCompany,
    isLoadingUser,
    disableAuthy,
    enableAuthy,
    isTwoFactorFeatureEnabled,
    requestAuthySMS,
    profile,
    updateAttachments,
    updateCompany,
    updateCreditor,
    user,
  } = props;

  const { marketplaceTagFormOptions } = useMarketplaceTags(
    props.marketplaceTags,
    props.fetchMarketplaceTags
  );

  const attachments = useMemo(
    () => (allAttachments || []).filter(isInsuranceLicenseDocument),
    [allAttachments]
  );

  const handleSubmitExternalCreditor = useCallback(
    (values) => updateCreditor(values),
    [updateCreditor]
  );

  const handleSubmitCompany = useCallback(
    (values) => updateCompany(values),
    [updateCompany]
  );

  const handleEnableAuthy = useCallback(
    (values) => {
      enableAuthy(values);
    },
    [enableAuthy]
  );

  const handleRequestAuthySMS = useCallback(() => {
    requestAuthySMS(user.email);
  }, [requestAuthySMS, user.email]);

  const handleDisableAuthy = useCallback(
    (values) => {
      disableAuthy(values);
    },
    [disableAuthy]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (profile.id) {
      fetchUser({ id: profile.id, type: profile.role });

      fetchCompany({
        ownerId: profile.id,
        ownerType: 'ExternalCreditor',
      });

      fetchAttachments({
        attachableType: 'ExternalCreditor',
        attachableId: profile.id,
      });
    }
  }, [profile.id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div data-testid="external-creditor-profile-form">
      <CardLight
        title="Primary Contact Details"
        isLoading={isLoadingUser}
        className="mb-3">
        <ExternalCreditorFormMarketplaceDetails
          externalCreditor={user}
          hasError={hasError}
          isLoading={isLoadingUser}
          isTestMode={props.isTestMode}
          marketplaceTagFormOptions={marketplaceTagFormOptions}
          onSubmit={handleSubmitExternalCreditor}
        />
      </CardLight>
      <CardLight
        title="Company Details"
        isLoading={isLoadingCompany}
        className="mb-3">
        <UserFormCompany
          company={company}
          hasError={hasError}
          hasServiceRadius={true}
          isLoading={isLoadingCompany}
          onSubmit={handleSubmitCompany}
        />
      </CardLight>
      {isTwoFactorFeatureEnabled && (
        <CardLight title="Two-factor authentication" className="mb-3">
          <FormTwoFactorAuth
            user={profile}
            hasError={hasError}
            btnText="Enable two-factor authentication"
            disable2FABtnText="Disable two-factor authentication"
            isLoading={isLoadingUser}
            isDisable2FAEnabled
            onSubmit={handleEnableAuthy}
            onDisableAuthy={handleDisableAuthy}
            onRequestAuthySMS={handleRequestAuthySMS}
          />
        </CardLight>
      )}
      <CardLight title="Insurance and License documents" className="mb-3">
        <UploaderFiles
          attachments={attachments}
          attachableType="ExternalCreditor"
          attachableId={profile.id}
          onDestroyComplete={updateAttachments}
        />
        <UploaderButton
          attachableType="ExternalCreditor"
          attachableId={profile.id}
          attachableCategory={ATTACHMENT_CATEGORIES.insuranceLicenseDocument}
          onComplete={updateAttachments}
        />
      </CardLight>
    </div>
  );
};

ProfileExternalCreditorFormComponent.propTypes = {
  allAttachments: PropTypes.array,
  company: PropTypes.object,
  fetchAttachments: PropTypes.func.isRequired,
  fetchCompany: PropTypes.func.isRequired,
  fetchMarketplaceTags: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  isLoadingCompany: PropTypes.bool.isRequired,
  isLoadingUser: PropTypes.bool.isRequired,
  disableAuthy: PropTypes.func.isRequired,
  enableAuthy: PropTypes.func,
  isTwoFactorFeatureEnabled: PropTypes.bool,
  requestAuthySMS: PropTypes.func.isRequired,
  isTestMode: PropTypes.bool,
  marketplaceTags: PropTypes.array,
  profile: PropTypes.object.isRequired,
  updateAttachments: PropTypes.func.isRequired,
  updateCompany: PropTypes.func.isRequired,
  updateCreditor: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const profile = getProfile(state.profile);
  const user = getUser(state.users, profile);

  return {
    allAttachments: getAttachments(state.attachment),
    company: getCompany(state.company, 'ExternalCreditor', profile.id),
    hasError: hasError(state),
    isLoadingCompany: state.company.isLoading,
    isLoadingUser: state.profile.isLoading,
    isTwoFactorFeatureEnabled: state.settings.authyEnabled,
    marketplaceTags: getMarketplaceTags(state.marketplace),
    profile,
    user,
  };
};

const mapDispatchToProps = {
  disableAuthy,
  enableAuthy,
  requestAuthySMS,
  fetchAttachments,
  fetchCompany,
  fetchMarketplaceTags,
  fetchUser,
  updateAttachments,
  updateCompany,
  updateCreditor,
};

export const ProfileExternalCreditorForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileExternalCreditorFormComponent);
