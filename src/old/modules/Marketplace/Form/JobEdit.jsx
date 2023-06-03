import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { usePrevious } from '@app/hooks';
import { FormButtons } from '@app/modules/Form';
import { MarketplaceFieldsDetails } from '@app/modules/Marketplace';

export const MarketplaceFormJobEdit = ({
  limitCents,
  isWorkOrder,
  job,
  onCancel,
  onChange,
  onSubmit,
  tagOptions,
  taskPath,
  ...formikProps
}) => {
  const { isValid } = formikProps;
  const history = useHistory();
  const updatedAt = usePrevious(job.updatedAt);

  const attachments = useMemo(() => {
    return [...job.attachments, ...job.taskAttachments];
  }, [job.attachments, job.taskAttachments]);

  // Redirect after saving
  useEffect(() => {
    if (!!updatedAt && updatedAt !== job.updatedAt) {
      history.push(`${taskPath}/job`);
    }
  }, [updatedAt, history, job.updatedAt, taskPath]);

  return (
    <div data-testid="form-job-edit">
      <MarketplaceFieldsDetails
        isWorkOrder={isWorkOrder}
        limitCents={limitCents}
        onChange={onChange}
        tagOptions={tagOptions}
        attachments={attachments}
        {...formikProps}
      />
      <div className="d-flex">
        <FormButtons
          isValid={isValid}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

MarketplaceFormJobEdit.propTypes = {
  limitCents: PropTypes.number,
  isWorkOrder: PropTypes.bool,
  job: PropTypes.object,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  tagOptions: PropTypes.array,
  taskPath: PropTypes.string,
};
