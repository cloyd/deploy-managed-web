import PropTypes from 'prop-types';
import React from 'react';

import {
  MarketplaceFieldsAttachments,
  MarketplaceFieldsBudget,
  MarketplaceFieldsInfo,
} from '@app/modules/Marketplace';

export const MarketplaceFieldsDetails = ({
  attachments,
  isWorkOrder,
  limitCents,
  onChange,
  tagOptions,
  ...formikProps
}) => {
  const { errors, touched, values } = formikProps;

  return (
    <>
      <MarketplaceFieldsInfo
        errors={errors}
        values={values}
        onChange={onChange}
        tagOptions={tagOptions}
        touched={touched}
      />
      <MarketplaceFieldsAttachments
        attachments={attachments}
        onChange={onChange}
      />
      <MarketplaceFieldsBudget
        isWorkOrder={isWorkOrder}
        limitCents={limitCents}
      />
    </>
  );
};

MarketplaceFieldsDetails.propTypes = {
  attachments: PropTypes.array,
  limitCents: PropTypes.number,
  isWorkOrder: PropTypes.bool,
  onChange: PropTypes.func,
  tagOptions: PropTypes.array,
};
