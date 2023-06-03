import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import * as Yup from 'yup';

import {
  MarketplaceFormJobCreate,
  MarketplaceFormJobEdit,
  useMarketplaceTags,
} from '@app/modules/Marketplace';
import { JOB_TYPE, createJob, updateJob } from '@app/redux/marketplace';
import { getProperty } from '@app/redux/property';

const JobForm = ({ job, onCancel, task, ...formikProps }) => {
  const { isValid, setFieldTouched, setFieldValue, values } = formikProps;
  const { marketplaceTagFormOptions } = useMarketplaceTags();
  const match = useRouteMatch('/property/:propertyId/tasks/:taskId');
  const dispatch = useDispatch();

  const limitCents = useSelector((state) => {
    return getProperty(state.property, task.propertyId).workOrderLimitCents;
  });

  const isWorkOrder = useMemo(() => {
    return values.jobType === JOB_TYPE.workOrder;
  }, [values.jobType]);

  const handleChange = useCallback(
    (field) => (value) => {
      setFieldTouched(field, true);
      setFieldValue(field, value);
    },
    [setFieldTouched, setFieldValue]
  );

  const handleSubmit = useCallback(() => {
    if (isValid) {
      const { budgetDollars, ...params } = values;

      if (budgetDollars) {
        params.budgetCents = budgetDollars * 100;
      }

      if (values.jobId) {
        dispatch(updateJob(params));
      } else {
        dispatch(createJob(params));
      }
    }
  }, [dispatch, isValid, values]);

  return values.jobId ? (
    <MarketplaceFormJobEdit
      isWorkOrder={isWorkOrder}
      limitCents={limitCents}
      onCancel={onCancel}
      onChange={handleChange}
      onSubmit={handleSubmit}
      tagOptions={marketplaceTagFormOptions}
      taskPath={match?.url}
      job={job}
      {...formikProps}
    />
  ) : (
    <MarketplaceFormJobCreate
      isWorkOrder={isWorkOrder}
      limitCents={limitCents}
      onChange={handleChange}
      onSubmit={handleSubmit}
      tagOptions={marketplaceTagFormOptions}
      task={task}
      taskPath={match?.url}
      {...formikProps}
    />
  );
};

JobForm.propTypes = {
  job: PropTypes.object,
  onCancel: PropTypes.func,
  task: PropTypes.object,
};

const formikEnhancer = withFormik({
  displayName: 'JobForm',

  mapPropsToValues: ({ task, job }) => {
    const {
      budgetCents,
      description = task.description,
      hasWorkOrder,
      id: jobId,
      propertyTaskId = task.id,
      tagIds,
      title = task.title,
    } = job || {};

    const budgetDollars = budgetCents ? budgetCents / 100 : undefined;

    const jobType = jobId
      ? hasWorkOrder
        ? JOB_TYPE.workOrder
        : JOB_TYPE.quote
      : undefined;

    return {
      budgetDollars,
      description,
      jobId,
      jobType,
      propertyTaskId,
      tagIds,
      title,
    };
  },

  validationSchema: Yup.object().shape({
    budgetDollars: Yup.number().when('jobType', {
      is: JOB_TYPE.workOrder,
      then: Yup.number()
        .required('Amount is required')
        .min(1, 'Amount must be equal to or greater than $1.00'),
    }),
    description: Yup.string().required('Description is required'),
    jobType: Yup.string().required('Type is required'),
    tagIds: Yup.array().test({
      test: (arr) => !!arr?.length,
      message: 'Type of job is required',
    }),
    title: Yup.string().required('Title is required'),
  }),
});

export const MarketplaceFormJob = formikEnhancer(JobForm);
