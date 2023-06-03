import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'reactstrap';

import { FormFieldRadio } from '@app/modules/Form';
import { StepsCard, StepsCardBody, StepsCardFooter } from '@app/modules/Steps';
import { TaskFieldsAppointments } from '@app/modules/Task';

const OPTIONS = [
  ['anytime', 'Any day and time'],
  ['preference', 'Preferred day and times'],
];

export const TaskFormStepFive = ({ values, onCancel, onChange, onSubmit }) => {
  const [option, setOption] = useState();

  const { appointments } = useMemo(() => {
    return values;
  }, [values]);

  const isPreference = useMemo(() => {
    return option === 'preference';
  }, [option]);

  const isDisabled = useMemo(() => {
    if (option) {
      return isPreference && !appointments?.length;
    }

    return true;
  }, [appointments, isPreference, option]);

  const clearAppointments = useCallback(() => {
    onChange('appointments', undefined);
  }, [onChange]);

  const handleChangeOption = useCallback(
    (event) => {
      const { value } = event.currentTarget;

      if (isPreference) {
        clearAppointments();
      }

      setOption(value);
    },
    [clearAppointments, isPreference, setOption]
  );

  const handleBack = useCallback(() => {
    clearAppointments();
    onCancel();
  }, [clearAppointments, onCancel]);

  return (
    <StepsCard>
      <StepsCardBody title="When is a good time for someone to attend?">
        {OPTIONS.map(([value, title], index) => (
          <FormFieldRadio
            id={`option-${index}`}
            key={`option-${index}`}
            name="option"
            className="border-top py-3 pl-1 text-left"
            classNameLabel="mb-0 text-primary font-weight-bold"
            isChecked={value === option}
            title={title}
            value={value}
            onChange={handleChangeOption}
          />
        ))}
        {isPreference && (
          <div className="mb-4 text-left">
            <TaskFieldsAppointments
              appointments={appointments}
              onChange={onChange}
              isDisabled={false}
              className="mb-2 py-3 pl-2 pr-3 bg-200 rounded-lg"
            />
          </div>
        )}
      </StepsCardBody>
      <StepsCardFooter>
        <Button
          className="px-5 mr-3"
          color="primary"
          size="lg"
          onClick={handleBack}
          outline>
          Back
        </Button>
        <Button
          className="px-5 ml-3"
          color="primary"
          size="lg"
          disabled={isDisabled}
          onClick={onSubmit}>
          Next
        </Button>
      </StepsCardFooter>
    </StepsCard>
  );
};

TaskFormStepFive.propTypes = {
  values: PropTypes.object,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
