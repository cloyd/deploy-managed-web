import PropTypes from 'prop-types';
import React from 'react';

import { formatDate } from '../../utils';
import { CardLight } from '../Card';
import { ContentAddress, ContentDefinition } from '../Content';

export const UserKycPersonalCard = ({ title, user }) => {
  const address = user.address || {};

  return (
    <CardLight title={title} className="mb-3">
      <ContentDefinition
        label="Date of Birth"
        value={formatDate(user.dob)}
        className="d-block mb-2"
      />
      <ContentDefinition label="Address">
        <ContentAddress
          street={address.street}
          suburb={address.suburb}
          state={address.state}
          postcode={address.postcode}
        />
      </ContentDefinition>
    </CardLight>
  );
};

UserKycPersonalCard.propTypes = {
  title: PropTypes.string,
  user: PropTypes.object.isRequired,
};

UserKycPersonalCard.defaultProps = {
  title: 'Personal Details',
};
