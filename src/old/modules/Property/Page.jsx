import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert } from 'reactstrap';

import { useRolesContext } from '@app/modules/Profile';
import { featurePropertyImage, httpClient, imageSrcLarge } from '@app/utils';

import {
  PropertyHeader,
  PropertyImage,
  PropertySubmissionPartnerTout,
} from '.';

export const PropertyPage = ({
  children,
  hasImage,
  headerClassname,
  lease,
  leaseUpcoming,
  property,
  tenant,
}) => {
  const { isManager, isOwner, isPrincipal, isCorporateUser, isTenant } =
    useRolesContext();
  const isAgencyUser = useMemo(
    () => isManager || isPrincipal || isCorporateUser,
    [isManager, isPrincipal, isCorporateUser]
  );

  const [message, setMessage] = useState();
  const [isEnabled, setIsEnabled] = useState(false);

  const showSubmissionPartner = useMemo(() => {
    return (
      lease.showSubmissionPartner &&
      lease.showSubmissionPartner === true &&
      isTenant &&
      !isEnabled
    );
  }, [isEnabled, isTenant, lease]);

  const handleSubmit = useCallback(async () => {
    const response = await httpClient.post(
      `/leases/${lease.id}/enable-submission-partner`
    );

    if (response.status < 300) {
      setIsEnabled(true);
      setMessage(
        'Thanks for getting connected! Someone from ConnectNow will reach out to you shortly.'
      );
    }
  }, [lease.id, setIsEnabled, setMessage]);

  return (
    <div className="mb-3">
      <Alert
        className="mb-0"
        color="success"
        data-testid="no-payment-method-alert"
        isOpen={isEnabled}>
        {message}
      </Alert>
      {showSubmissionPartner && (
        <PropertySubmissionPartnerTout handleSubmit={handleSubmit} />
      )}
      {hasImage ? (
        <div className="brand-default d-flex justify-content-center position-relative">
          <PropertyImage
            src={imageSrcLarge(featurePropertyImage(property.attachments))}
            alertText={isAgencyUser ? property.bannerAlert : ''}
          />
        </div>
      ) : (
        <PropertyHeader
          className={headerClassname}
          isOwner={isOwner}
          isManager={isManager}
          lease={lease.id ? lease : leaseUpcoming}
          property={property}
          tenant={tenant}
        />
      )}
      <div style={hasImage && { marginTop: '-100px' }}>{children}</div>
    </div>
  );
};

PropertyPage.propTypes = {
  children: PropTypes.node.isRequired,
  hasImage: PropTypes.bool,
  headerClassname: PropTypes.string,
  lease: PropTypes.object,
  leaseUpcoming: PropTypes.object,
  property: PropTypes.object.isRequired,
  tenant: PropTypes.object.isRequired,
};
