import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { EofyReports } from '../../modules/Property/EofyReports';
import { MonthlyStatements } from '../../modules/Property/MonthlyStatements';
import { getProfile } from '../../redux/profile';

const PropertyReportsComponent = ({ isLoading, property, user }) => (
  <>
    <MonthlyStatements isLoading={isLoading} property={property} user={user} />
    {property.showEofyReports && (
      <EofyReports isLoading={isLoading} property={property} />
    )}
  </>
);

PropertyReportsComponent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  property: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.property.isLoading,
    user: getProfile(state.profile),
  };
};

export const PropertyReports = connect(mapStateToProps)(
  PropertyReportsComponent
);
