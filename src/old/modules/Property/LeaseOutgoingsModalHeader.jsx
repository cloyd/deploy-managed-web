import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { CustomInput } from 'reactstrap';

import { httpClient } from '../../utils';

export const PropertyLeaseOutgoingsModalHeader = ({
  title,
  subTitle,
  isGstIncluded,
  leaseId,
  outgoingsEstimateId,
  canEditGst,
}) => {
  const [isGstIncludedOutgoings, setIsGstIncludedOutgoings] = useState(
    isGstIncluded ?? false
  );

  const handleChangeGst = useCallback(
    (e) => {
      // Call api to update gst
      let checkedValue = e.target.checked;
      setIsGstIncludedOutgoings(checkedValue);
      httpClient
        .put(
          `/leases/${leaseId}/commercial/outgoings_estimates/${outgoingsEstimateId}`,
          {
            gstIncluded: checkedValue,
          }
        )
        .then((response) => {
          return null;
        })
        .catch((error) => {
          setIsGstIncludedOutgoings(!checkedValue);
          console.log('Internal Server error. Please contact Support', error);
        });
    },
    [leaseId, outgoingsEstimateId]
  );

  return (
    <div className="w-100">
      <div>{title}</div>
      <div className="d-inline-flex w-100 align-items-center justify-content-between">
        <div className="h6 text-muted mt-2">{subTitle}</div>
        {canEditGst && (
          <CustomInput
            className="ml-1 text-small"
            checked={isGstIncludedOutgoings}
            id="gstIncluded"
            label="GST Included"
            name="gstIncluded"
            type="checkbox"
            onChange={handleChangeGst}
          />
        )}
      </div>
    </div>
  );
};

PropertyLeaseOutgoingsModalHeader.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  isGstIncluded: PropTypes.bool,
  leaseId: PropTypes.number.isRequired,
  outgoingsEstimateId: PropTypes.number.isRequired,
  canEditGst: PropTypes.bool,
};

PropertyLeaseOutgoingsModalHeader.defaultProps = {
  isGstIncluded: false,
  title: 'Outgoings Estimate Bill',
  subTitle: 'This will automatically generate in monthly instalments.',
  canEditGst: false,
};
