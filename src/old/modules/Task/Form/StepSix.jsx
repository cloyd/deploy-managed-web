import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, CustomInput, FormGroup, Input } from 'reactstrap';

import { FormFieldRadio } from '@app/modules/Form';
import { StepsCard, StepsCardBody, StepsCardFooter } from '@app/modules/Steps';

const HAS_ACCCESS_KEYS = [
  'alarmCode',
  'accessInstructions',
  'hasAlarmCode',
  'hasDogs',
  'keysChanged',
];

// hasAccess means use the agency keys. But it's usage is reversed for the tenant
// lodging this form. Confusing hey!!!
export const TaskFormStepSix = ({ values, onChange, onSubmit }) => {
  const [isDisabled, setIsDisabled] = useState(true);

  const { hasAccess, hasAlarmCode } = useMemo(() => {
    return values;
  }, [values]);

  const handleChange = useCallback(
    (event) => {
      let { name, checked, value } = event.currentTarget;

      if (value === 'on') {
        value = checked;
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }

      onChange(name, value);
      setIsDisabled(false);
    },
    [onChange]
  );

  useEffect(() => {
    if (hasAccess) {
      HAS_ACCCESS_KEYS.forEach((key) => {
        onChange(key, undefined);
      });
    }
  }, [hasAccess, onChange]);

  return (
    <StepsCard>
      <StepsCardBody title="How would you like the tradie to gain access?">
        <div className="text-left mb-2 py-3 px-1 bg-200 rounded-lg">
          <FormFieldRadio
            id="has-access-true"
            name="hasAccess"
            classNameLabel="mb-0 text-primary font-weight-bold"
            isChecked={!isDisabled && !hasAccess}
            title="I will allow access"
            value={false}
            onChange={handleChange}
          />
          {hasAccess === false && (
            <div className="pl-3 pl-lg-5">
              <FormGroup className="mb-0">
                <CustomInput
                  className="mt-2"
                  id="hasDogs"
                  label="There are dogs on the premises?"
                  name="hasDogs"
                  type="checkbox"
                  onChange={handleChange}
                  disabled={isDisabled}
                />
                <CustomInput
                  className="mt-2"
                  id="keysChanged"
                  label="Have the keys changed?"
                  name="keysChanged"
                  type="checkbox"
                  onChange={handleChange}
                  disabled={isDisabled}
                />
                <CustomInput
                  className="mt-2"
                  id="hasAlarmCode"
                  label="Is there an alarm code?"
                  name="hasAlarmCode"
                  type="checkbox"
                  onChange={handleChange}
                  disabled={isDisabled}
                />
                {hasAlarmCode && (
                  <div className="mt-3 mr-3 mr-lg-5">
                    <Input
                      name="alarmCode"
                      placeholder="Enter code"
                      onBlur={handleChange}
                      disabled={isDisabled}
                    />
                  </div>
                )}
                <div className="mt-3 mr-3 mr-lg-5">
                  <Input
                    name="accessInstructions"
                    placeholder="Please give instructions if required"
                    type="textarea"
                    rows={4}
                    onBlur={handleChange}
                    disabled={isDisabled}
                  />
                </div>
              </FormGroup>
            </div>
          )}
        </div>
        <div className="text-left mb-4 py-3 px-1 bg-200 rounded-lg">
          <FormFieldRadio
            id="has-access-false"
            name="hasAccess"
            classNameLabel="mb-0 text-primary font-weight-bold"
            isChecked={!isDisabled && hasAccess}
            title="I can't allow access"
            value={true}
            onChange={handleChange}
          />
          <div className="mx-5">
            Agency will contact you to discuss access options.
          </div>
        </div>
      </StepsCardBody>
      <StepsCardFooter>
        <Button
          className="px-5 ml-3"
          color="primary"
          size="lg"
          disabled={isDisabled}
          onClick={onSubmit}>
          Submit task
        </Button>
      </StepsCardFooter>
    </StepsCard>
  );
};

TaskFormStepSix.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
