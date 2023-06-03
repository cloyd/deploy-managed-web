import { withFormik } from 'formik';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form } from 'reactstrap';

import { StepsModal } from '@app/modules/Steps';
import {
  TaskFormStepDone,
  TaskFormStepFive,
  TaskFormStepFour,
  TaskFormStepOne,
  TaskFormStepSix,
  TaskFormStepThree,
  TaskFormStepTwo,
  useTaskType,
} from '@app/modules/Task';
import { LOCATIONS, PRIORITIES, createTask, updateTask } from '@app/redux/task';

const toCollection = (value) => {
  return [value, startCase(value)];
};

const priorities = PRIORITIES.map(toCollection);
const locations = LOCATIONS.map(toCollection);

export const CreateSteps = ({
  onCancel,
  property,
  resetForm,
  setFieldValue,
  taskId,
  values,
}) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const { isGeneral, isMaintenance } = useTaskType(values);

  const handleChangeType = useCallback(
    (key, value) => {
      resetForm();
      setFieldValue(key, value);
    },
    [resetForm, setFieldValue]
  );

  const handleNext = useCallback(() => {
    const generalSteps = { 1: 3, 4: 7 };

    setStep((step) => {
      const generalStep = generalSteps[step];

      if (isGeneral && generalStep) {
        return generalStep;
      } else {
        return step + 1;
      }
    });
  }, [isGeneral, setStep]);

  const handlePrev = useCallback(() => {
    const generalSteps = { 3: 1, 7: 4 };

    setStep((step) => {
      const generalStep = generalSteps[step];

      if (isGeneral && generalStep) {
        return generalStep;
      } else {
        return step - 1;
      }
    });
  }, [isGeneral, setStep]);

  const handleCreate = useCallback(() => {
    dispatch(createTask(values));
    handleNext();
  }, [dispatch, handleNext, values]);

  const handleUpdate = useCallback(() => {
    const params = { ...values, taskId };
    delete params.attachments;

    dispatch(updateTask(params));
    handleNext();
  }, [dispatch, handleNext, taskId, values]);

  useEffect(() => {
    if (step === 6 || (step === 4 && isGeneral)) {
      setFieldValue('status', 'entered');
    }
  }, [isGeneral, setFieldValue, step]);

  return (
    <StepsModal step={step} total={7} onClosed={onCancel}>
      <Form>
        {step === 1 && (
          <TaskFormStepOne
            values={values}
            onChange={handleChangeType}
            onSubmit={handleNext}
          />
        )}
        {step === 2 && (
          <TaskFormStepTwo
            values={values}
            priorities={priorities}
            onCancel={handlePrev}
            onChange={setFieldValue}
            onSubmit={handleNext}
          />
        )}
        {step === 3 && (
          <TaskFormStepThree
            values={values}
            locations={locations}
            onCancel={handlePrev}
            onChange={setFieldValue}
            onSubmit={handleCreate}
          />
        )}
        {step === 4 && taskId && (
          <TaskFormStepFour
            isRequired={isMaintenance}
            values={values}
            taskId={taskId}
            onCancel={handlePrev}
            onChange={setFieldValue}
            onSubmit={handleUpdate}
          />
        )}
        {step === 5 && taskId && (
          <TaskFormStepFive
            values={values}
            onCancel={handlePrev}
            onChange={setFieldValue}
            onSubmit={handleUpdate}
          />
        )}
        {step === 6 && taskId && (
          <TaskFormStepSix
            values={values}
            onCancel={handlePrev}
            onChange={setFieldValue}
            onSubmit={handleUpdate}
          />
        )}
        {step === 7 && taskId && (
          <TaskFormStepDone
            title={property.agency.tradingName}
            onSubmit={onCancel}
          />
        )}
      </Form>
    </StepsModal>
  );
};

CreateSteps.propTypes = {
  onCancel: PropTypes.func,
  resetForm: PropTypes.func,
  setFieldValue: PropTypes.func,
  taskId: PropTypes.number,
  taskMeta: PropTypes.object,
  values: PropTypes.object,
  property: PropTypes.object,
};

const formikEnhancer = withFormik({
  displayName: 'TaskFormCreateSteps',
  mapPropsToValues: (props) => {
    return {
      propertyId: props.property.id,
      assigneeId: props.property.managerId || props.property.managers[0]?.id,
      status: 'entered',
    };
  },
});

export const TaskFormCreateSteps = formikEnhancer(CreateSteps);
