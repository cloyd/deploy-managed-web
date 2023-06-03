import PropTypes from 'prop-types';
import React from 'react';

import { CardLight } from '../Card';

export const PropertyLeaseModificationsCard = ({ lease, modifications }) => {
  const renderItem = (modification) => {
    const classNames = ['d-flex', 'align-items-center'];
    modification !== modifications[modifications.length - 1] &&
      classNames.push('border-bottom', 'pb-2', 'mb-2');

    return (
      <div
        key={`modification-${modification.id}`}
        className={classNames.join(' ')}>
        <span>Commencing: {modification.effectiveDateFormatted}</span>
        <span className="ml-auto">
          Change to {modification.amountDollars[lease.payFrequency]}
        </span>
        {/*
          <button type="button" className="btn btn-link py-0">
            Delete
          </button>
        */}
      </div>
    );
  };

  return (
    <CardLight title="Upcoming rent adjustments" className="mb-4">
      {modifications.map(renderItem)}
    </CardLight>
  );
};

PropertyLeaseModificationsCard.propTypes = {
  lease: PropTypes.object.isRequired,
  modifications: PropTypes.array.isRequired,
};
