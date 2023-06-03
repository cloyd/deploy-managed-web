import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Button } from 'reactstrap';

import { ButtonToggle } from '@app/modules/Button';
import { StepsCard, StepsCardBody, StepsCardFooter } from '@app/modules/Steps';
import { useTaskType } from '@app/modules/Task';
import { TYPE } from '@app/redux/task';

export const TaskFormStepOne = ({ values, onChange, onSubmit }) => {
  const { isMaintenance, isGeneral } = useTaskType(values);

  const handleChange = useCallback(
    (value) => () => {
      onChange('type', value);
    },
    [onChange]
  );

  return (
    <StepsCard>
      <StepsCardBody className="mb-4 mb-lg-5" title="How can we help?">
        <ButtonToggle
          className="mr-2 mr-lg-3"
          icon="screwdriver-wrench"
          isActive={isMaintenance}
          onClick={handleChange(TYPE.maintenance)}>
          Maintenance
        </ButtonToggle>
        <ButtonToggle
          className="ml-2 ml-lg-3"
          icon="circle-question"
          isActive={isGeneral}
          onClick={handleChange(TYPE.general)}>
          General Query
        </ButtonToggle>
      </StepsCardBody>
      <StepsCardFooter>
        <Button
          className="px-5"
          color="primary"
          size="lg"
          disabled={!values.type}
          onClick={onSubmit}>
          Next
        </Button>
      </StepsCardFooter>
    </StepsCard>
  );
};

TaskFormStepOne.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
