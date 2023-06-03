import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Container } from 'reactstrap';

import { ContentDetail } from '../../modules/Content';
import { NavPlain } from '../../modules/Nav';
import { useRolesContext } from '../../modules/Profile';
import { fetchLeases, getLeaseUpcoming } from '../../redux/lease';
import { getProfile, markOnboarded } from '../../redux/profile';
import { fetchProperties, getProperty } from '../../redux/property';
import { getUser } from '../../redux/users';
import { Alert as NotifierAlert } from '../Alert';

const ConfirmInviteComponent = (props) => {
  const {
    fetchLeases,
    fetchProperties,
    isLoading,
    lease,
    markOnboarded,
    property,
    user,
  } = props;

  const { isExternalCreditor, isOwner, isTenant } = useRolesContext();

  const showRentDetails = property.id && lease.id && isTenant;

  useEffect(() => {
    if (!isExternalCreditor) {
      fetchLeases();
      fetchProperties();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [isExternalCreditor]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      <NavPlain />
      <NotifierAlert className="mt-0" />
      <Container
        className="py-lg-5 filter-blur"
        data-testid="confirm-invite-congrats-section">
        <h1 className="text-primary">Congratulations - all good to go</h1>
        <hr className="my-4" />
        <h3>Your details</h3>
        <ContentDetail title="Name">
          {user.firstName} {user.lastName}
        </ContentDetail>
        <ContentDetail title="Email" value={user.email} />
        <ContentDetail title="Phone number" value={user.phoneNumber} />
        <hr className="my-4" />
        {showRentDetails && (
          <>
            <h3 data-testid="heading-rent-details">Rent details</h3>
            {property.address && (
              <ContentDetail title="Address">
                {property.address.street}, {property.address.suburb},&nbsp;
                {property.address.state} {property.address.postcode}
              </ContentDetail>
            )}
            {lease.amountDollars && (
              <ContentDetail
                title="Rent amount"
                value={lease.amountDollars[lease.payFrequency]}
              />
            )}
            <ContentDetail
              title="Payment frequency"
              value={lease.payFrequency}
            />
            <hr className="my-4" />
          </>
        )}
        <p>If you need to make any changes you can do that in your settings.</p>
        {isOwner && (
          <Alert color="primary">
            Please remember to go into each property &#8594;{' '}
            <span className="font-italic font-weight-bold">Settings </span> tab
            and select the correct disbursement and payment accounts.
          </Alert>
        )}
        <p>
          <Button
            color="primary"
            data-testid="button-confirm-invite"
            disabled={isLoading}
            size="lg"
            onClick={markOnboarded}>
            Confirm
          </Button>
        </p>
      </Container>
    </>
  );
};

ConfirmInviteComponent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  fetchLeases: PropTypes.func.isRequired,
  fetchProperties: PropTypes.func.isRequired,
  lease: PropTypes.object,
  markOnboarded: PropTypes.func.isRequired,
  property: PropTypes.object,
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  const lease = getLeaseUpcoming(state.lease);

  return {
    isLoading: state.profile.isLoading,
    lease,
    property: getProperty(state.property, lease.propertyId),
    user: getUser(state.users, getProfile(state.profile)),
  };
};

const mapDispatchToProps = {
  fetchLeases,
  fetchProperties,
  markOnboarded,
};

export const ConfirmInvite = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmInviteComponent);
