import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';

import { ProfilePlan } from '@app/modules/Profile';

const MIN_TRADIE_SERVICE_FEE = 6.6;

function formattedFee(percent = 0, type) {
  let value = percent / 100;

  if (value === 0 && type === 'revenue_share') {
    return MIN_TRADIE_SERVICE_FEE;
  }

  return value;
}

export const ProfilePlanWithFormik = ({ onSubmit, ...props }) => {
  const initialValues = useMemo(() => {
    const { type, tradieAdminFeeCents, percentageTradieServiceFee } =
      props.plan;

    const tradieAdminFee = formattedFee(tradieAdminFeeCents);
    const tradieServiceFee = formattedFee(percentageTradieServiceFee, type);

    return {
      action: props.plan.id ? 'delete' : 'post',
      id: props.plan.id,
      managedPlus: props.plan.managedPlus,
      status: props.plan.status,
      type,
      tradieAdminFee,
      tradieServiceFee,
    };
  }, [props.plan]);

  const validationSchema = Yup.object().shape({
    tradieAdminFee: Yup.number().min(0),
    tradieServiceFee: Yup.number()
      .required()
      .when('type', {
        is: 'revenue_share',
        then: Yup.number().min(
          MIN_TRADIE_SERVICE_FEE,
          `Min of ${MIN_TRADIE_SERVICE_FEE}%.`
        ),
      }),
  });

  const handleSubmit = useCallback(
    async (values, formik) => {
      let { action, tradieAdminFee, tradieServiceFee, ...params } = values;

      params.tradieAdminFeeCents = tradieAdminFee * 100;
      params.percentageTradieServiceFee = tradieServiceFee * 100;

      if (action === 'delete') {
        params = undefined;
      }

      await onSubmit(action, params);

      formik.resetForm(values);
    },
    [onSubmit]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {(formik) => (
        <ProfilePlan
          {...props}
          minTradieServiceFee={MIN_TRADIE_SERVICE_FEE}
          formik={formik}
        />
      )}
    </Formik>
  );
};

ProfilePlanWithFormik.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  plan: PropTypes.object.isRequired,
  hasScheduled: PropTypes.bool.isRequired,
};
