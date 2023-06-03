import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Container } from 'reactstrap';

import { CardLight } from '@app/modules/Card';
import { ExternalCreditorBanner } from '@app/modules/ExternalCreditor';
import { Header } from '@app/modules/Header';
import { Link } from '@app/modules/Link';
import { OptionItem, useAsyncSendTradieInvite } from '@app/modules/User';

import { MarketplaceFormInviteTradie } from './';

export const InviteTradie = ({ isPreferred = false }) => {
  const history = useHistory();

  const [sendInvite, { invitedTradie, errorInvitedTradie, isLoading }] =
    useAsyncSendTradieInvite();

  const handleBack = useCallback(() => history.goBack(), [history]);

  const link = isPreferred ? '/contacts/preferred-tradies' : '/marketplace';

  const handleClickOption = useCallback(
    ({ id }) =>
      () =>
        history.push(`${link}/tradie/${id}`),
    [history, link]
  );

  return (
    <>
      <Header className="mb-0" title="Invite a Tradie" isLoading={isLoading}>
        <Link to={link}>
          Back to {isPreferred ? 'Preferred Tradies' : 'Marketplace'}
        </Link>
      </Header>
      <ExternalCreditorBanner />
      <Container className="py-4">
        <CardLight
          className="mb-3"
          isLoading={isLoading}
          title="Send invite to">
          <MarketplaceFormInviteTradie
            hasError={!!errorInvitedTradie}
            isLoading={isLoading}
            onCancel={handleBack}
            onSubmit={sendInvite}
            isPreferred={isPreferred}
          />
        </CardLight>
        {invitedTradie ? (
          <Alert color="success">
            <h5>Successfully added tradie</h5>
            <p>Click here to view profile</p>
            <OptionItem
              className="border rounded mt-3 bg-white"
              option={invitedTradie}
              onClick={handleClickOption}
            />
          </Alert>
        ) : errorInvitedTradie ? (
          <Alert color="warning">
            {typeof errorInvitedTradie === 'string' ? (
              <h5>{errorInvitedTradie}</h5>
            ) : (
              <>
                <h5>Is this the tradie you were looking for?</h5>
                <p>Click here to view profile</p>
                <OptionItem
                  className="border rounded mt-3 bg-white"
                  option={errorInvitedTradie}
                  onClick={handleClickOption}
                />
              </>
            )}
          </Alert>
        ) : null}
      </Container>
    </>
  );
};

InviteTradie.propTypes = {
  isPreferred: PropTypes.bool,
};

InviteTradie.defaultProps = {
  isPreferred: false,
};

export default InviteTradie;
