import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  generatePath,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import {
  MarketplaceFieldsDetails,
  MarketplaceFieldsType,
  MarketplaceFormStepsCard,
  MarketplaceFormStepsCardTradies,
} from '@app/modules/Marketplace';
import { StepsModal } from '@app/modules/Steps';

const STEPS = ['choose', 'details', 'tradies', 'complete'];

export const MarketplaceFormJobCreate = ({
  isWorkOrder,
  limitCents,
  onChange,
  onSubmit,
  tagOptions,
  task,
  taskPath,
  ...formikProps
}) => {
  const history = useHistory();
  const match = useRouteMatch();
  const { jobType, step } = useParams();
  const [hasSubmit, setHasSubmit] = useState(false);
  const { values } = formikProps;

  const jobId = useSelector((state) => {
    return state.marketplace.job.result;
  });

  const steps = useMemo(() => {
    const current = step || STEPS[0];
    const index = STEPS.indexOf(current) + 1;
    return { current, index, total: STEPS.length };
  }, [step]);

  const handleNext = useCallback(
    (step) => () => {
      const path = generatePath(match.path, {
        step,
        jobType: jobType || values?.jobType?.replace('_', '-'),
      });

      history.push(path);
    },
    [history, jobType, values, match.path]
  );

  const handleSubmit = useCallback(() => {
    setHasSubmit(true);
    onSubmit(values);
  }, [onSubmit, setHasSubmit, values]);

  // This can probably move to parent
  const handleClosed = useCallback(() => {
    if (jobId) {
      // Proper fix is fetching task after createJob completes within logic
      window.location.assign(`${taskPath}/job`);
    } else {
      history.push(taskPath);
    }
  }, [history, jobId, taskPath]);

  useEffect(() => {
    if (steps.current === 'details' && !values.jobType) {
      onChange('jobType')(jobType.replace('-', '_'));
    }

    if (steps.current === 'tradies' && !values.tagIds) {
      handleNext('details')();
    }

    if (steps.current === 'complete' && !jobId) {
      handleNext('tradies')();
    }
  }, [handleNext, jobId, jobType, onChange, steps, values]);

  useEffect(() => {
    if (hasSubmit && jobId) {
      setHasSubmit(false);
      handleNext('complete')();
    }
  }, [jobId, handleNext, hasSubmit, setHasSubmit]);

  return (
    <StepsModal
      step={steps.index}
      total={steps.total}
      onClosed={handleClosed}
      data-testid="form-job-create">
      {steps.current === 'choose' && (
        <MarketplaceFormStepsCard
          title="How can we help?"
          onSubmit={handleNext('details')}>
          <MarketplaceFieldsType
            isWorkOrder={isWorkOrder}
            onChange={onChange}
            {...formikProps}
          />
        </MarketplaceFormStepsCard>
      )}
      {steps.current === 'details' && (
        <MarketplaceFormStepsCard
          title="Additional info for tradie"
          isDisabled={!formikProps.isValid}
          onSubmit={handleNext('tradies')}>
          <MarketplaceFieldsDetails
            isWorkOrder={isWorkOrder}
            limitCents={limitCents}
            onChange={onChange}
            tagOptions={tagOptions}
            attachments={task.attachments}
            {...formikProps}
          />
        </MarketplaceFormStepsCard>
      )}
      {steps.current === 'tradies' && (
        <MarketplaceFormStepsCardTradies
          isWorkOrder={isWorkOrder}
          onChange={onChange}
          onSubmit={handleSubmit}
          propertyId={task.propertyId}
          {...formikProps}
        />
      )}
      {steps.current === 'complete' && (
        <MarketplaceFormStepsCard
          title="Request Sent!"
          icon={['fal', 'check-circle']}
          btnText="View Job"
          onSubmit={handleClosed}>
          <p className="mb-1">
            Your {isWorkOrder ? 'work order' : 'quote request'} has been sent to
            the tradie(s).
          </p>
          <p className="mb-4">
            You will receive an alert for any notifications or questions.
          </p>
        </MarketplaceFormStepsCard>
      )}
    </StepsModal>
  );
};

MarketplaceFormJobCreate.propTypes = {
  isWorkOrder: PropTypes.bool,
  limitCents: PropTypes.number,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  tagOptions: PropTypes.array,
  task: PropTypes.object,
  taskPath: PropTypes.string,
};
