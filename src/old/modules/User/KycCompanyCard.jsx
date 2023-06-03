import PropTypes from 'prop-types';
import React from 'react';

import { CardLight } from '../Card';
import { ContentAddress, ContentDefinition } from '../Content';

export const UserKycCompanyCard = ({ company, title }) => {
  return (
    <CardLight title={title} className="mb-3">
      <ContentDefinition
        label="Legal Trading Name"
        value={company.legalName}
        className="d-block mb-2"
      />
      <ContentDefinition
        label="ABN / Tax File Number"
        value={company.taxNumber}
        className="d-block mb-2"
      />
      <ContentDefinition label="Address">
        <ContentAddress
          street={company.addressLine1}
          suburb={company.city}
          state={company.state}
          postcode={company.zip}
        />
      </ContentDefinition>
    </CardLight>
  );
};

UserKycCompanyCard.propTypes = {
  company: PropTypes.object.isRequired,
  title: PropTypes.string,
};

UserKycCompanyCard.defaultProps = {
  title: 'Company Details',
};
