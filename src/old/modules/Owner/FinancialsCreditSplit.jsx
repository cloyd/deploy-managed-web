import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { fullAddress, fullName, toPercentAmount } from '../../utils';

class DataAdapter {
  constructor({ ownerCreditSplits, owners, properties }) {
    this.splits = ownerCreditSplits;
    this.ownersMap = owners;
    this.propertiesMap = properties;
  }

  splitPercent({ propertyId, ownerId }) {
    const { percentageSplit } = this.splits[propertyId][ownerId];
    return `${toPercentAmount(percentageSplit, 0)}%`;
  }

  propertyAddress(propertyId) {
    return fullAddress(this.property(propertyId).address);
  }

  ownerFullName(ownerId) {
    return fullName(this.owner(ownerId));
  }

  property(propertyId) {
    return this.propertiesMap[propertyId];
  }

  ownerIds(propertyId) {
    return Object.keys(this.splits[propertyId]).filter(
      (ownerId) =>
        this.ownersMap.hasOwnProperty(ownerId) &&
        this.ownersMap[ownerId].hasOwnProperty('id')
    );
  }

  owner(ownerId) {
    return this.ownersMap[ownerId];
  }

  get propertyIds() {
    return Object.keys(this.splits);
  }

  get hasFractional() {
    // some splits are between 0% and 100%
    return Object.values(this.splits).some((ownerships) =>
      Object.values(ownerships).some(
        ({ percentageSplit }) => percentageSplit > 0 && percentageSplit < 10000
      )
    );
  }
}

export const OwnerFinancialsCreditSplit = ({
  ownerCreditSplits,
  owners,
  properties,
}) => {
  const dataAdapter = new DataAdapter({
    ownerCreditSplits,
    owners,
    properties,
  });
  const isShowCreditSplit = dataAdapter.hasFractional;

  return (
    isShowCreditSplit && (
      <Table responsive>
        <thead>
          <tr>
            <th>Property</th>
            <th>Owner</th>
            <th>Ownership %</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {dataAdapter.propertyIds.map((propertyId) => (
            <tr key={propertyId}>
              <td>{dataAdapter.propertyAddress(propertyId)}</td>
              <td>
                {dataAdapter.ownerIds(propertyId).map((ownerId) => (
                  <React.Fragment key={`${propertyId}-${ownerId}`}>
                    {dataAdapter.ownerFullName(ownerId)}
                    <br />
                  </React.Fragment>
                ))}
              </td>
              <td>
                {dataAdapter.ownerIds(propertyId).map((ownerId) => (
                  <React.Fragment key={`${propertyId}-${ownerId}`}>
                    {dataAdapter.splitPercent({ propertyId, ownerId })}
                    <br />
                  </React.Fragment>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  );
};

OwnerFinancialsCreditSplit.propTypes = {
  properties: PropTypes.object,
  owners: PropTypes.object,
  ownerCreditSplits: PropTypes.object,
};
