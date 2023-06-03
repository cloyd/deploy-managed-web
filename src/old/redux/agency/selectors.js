import { createSelector } from 'reselect';

export const getAgency = (state) => state.agency;

export const getAgenciesRansackParams = () => {
  return {
    company_name: 'cont',
    licensee_name: 'cont',
    phone_number: 'cont',
    primary_contact_email: 'cont',
    primary_contact_first_name: 'cont',
    primary_contact_last_name: 'cont',
    primary_contact_mobile: 'cont',
    trading_name: 'cont',
    type_of: 'eq',
  };
};

export const selectAgency = createSelector(getAgency, (state) => state.agency);
export const selectAgencies = createSelector(
  getAgency,
  (state) => state.agencies
);

export const selectAgencyTradingName = createSelector(
  selectAgency,
  (agency) => agency.tradingName
);

export const selectIsLoadingAgency = createSelector(
  getAgency,
  (agency) => agency.isLoading
);
