import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { Alert, Button } from 'reactstrap';

import { FormFieldRadio } from '@app/modules/Form';
import { StepsCard, StepsCardBody, StepsCardFooter } from '@app/modules/Steps';

export const TaskFormStepTwo = ({
  values,
  priorities,
  onCancel,
  onChange,
  onSubmit,
}) => {
  const isEmergency = useMemo(() => {
    return values.priority === 'emergency';
  }, [values]);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.currentTarget;
      onChange(name, value);
    },
    [onChange]
  );

  return (
    <StepsCard>
      <StepsCardBody title="What priority is your maintenance request?">
        {priorities.map(([value, title], index) => (
          <FormFieldRadio
            id={`task-${index}`}
            key={`task-${index}`}
            name="priority"
            className="border-top py-3 pl-1 text-left"
            classNameLabel="mb-0 text-primary font-weight-bold"
            isChecked={value === values.priority}
            title={title}
            value={value}
            onChange={handleChange}
          />
        ))}
        {isEmergency && (
          <Alert color="primary" className="d-flex mt-1 mb-3">
            <FontAwesomeIcon
              icon={['far', 'exclamation-circle']}
              className="mt-1 mr-2"
            />
            <div className="text-dark">
              If you cannot reach your property manager, and the repairs are
              urgent, please check the tenancy agreement or the agency&apos;s
              website for a list of preferred tradies.
              <br />
              <a
                href="https://support.managedapp.com.au/en/articles/6513693-what-is-an-emergency-or-urgent-repair"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary pointer">
                What is an urgent repair?
              </a>
            </div>
          </Alert>
        )}
      </StepsCardBody>
      <StepsCardFooter>
        <Button
          className="px-5 mr-3"
          color="primary"
          size="lg"
          onClick={onCancel}
          outline>
          Back
        </Button>
        <Button
          className="px-5 ml-3"
          color="primary"
          size="lg"
          disabled={!values.priority}
          onClick={onSubmit}>
          Next
        </Button>
      </StepsCardFooter>
    </StepsCard>
  );
};

TaskFormStepTwo.propTypes = {
  values: PropTypes.object,
  priorities: PropTypes.array,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
