import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Col, CustomInput, FormGroup } from 'reactstrap';

import { FormField, FormLabel } from '@app/modules/Form';
import { TaskFieldsAppointments } from '@app/modules/Task';
import { DEFAULT_APPOINTMENT, LOCATIONS } from '@app/redux/task';

export const mapMaintenanceFieldsProps = (task) => ({
  alarmCode: task?.alarmCode || '',
  appointments: task?.appointments || [DEFAULT_APPOINTMENT],
  category: task?.taskCategory?.key || '',
  keysChanged: task?.keysChanged ?? false,
  hasAccess: task?.hasAccess ?? false,
  hasDogs: task?.hasDogs ?? false,
  location: task?.location || '',
});

export const TaskFieldsMaintenance = ({
  handleChange,
  isDisabled,
  values,
  setFieldValue,
}) => {
  const [hasAlarmCode, setHasAlarmCode] = useState(!!values.alarmCode);

  const handleToggleAlarm = useCallback(
    (e) => {
      setHasAlarmCode(e.currentTarget.checked);
    },
    [setHasAlarmCode]
  );

  const handleChangeAccess = useCallback(() => {
    setFieldValue('hasAccess', !values.hasAccess);
  }, [setFieldValue, values]);

  return (
    <>
      <Col lg={6} className="px-0">
        <FormGroup>
          <FormLabel for="location">Location of issue</FormLabel>
          <FormField name="location" type="select" disabled={isDisabled}>
            <option value="">-- Select --</option>
            {LOCATIONS.map((item) => (
              <option key={`location-${item}`} value={item}>
                {startCase(item)}
              </option>
            ))}
          </FormField>
        </FormGroup>
      </Col>
      <FormGroup>
        <FormLabel for="appointments">
          When is a good time for someone to attend?
        </FormLabel>
        <TaskFieldsAppointments
          appointments={values.appointments}
          isDisabled={isDisabled}
        />
      </FormGroup>
      <FormGroup>
        <CustomInput
          checked={!values.hasAccess}
          id="hasAccess"
          label="Hide tenant details from a tradie. Tradie will be prompted to contact the agency to organize access"
          name="hasAccess"
          type="checkbox"
          value={values.hasAccess}
          onChange={handleChangeAccess}
          disabled={isDisabled}
        />
      </FormGroup>
      <FormGroup>
        <CustomInput
          checked={values.keysChanged}
          id="keysChanged"
          label="Have the keys changed?"
          name="keysChanged"
          type="checkbox"
          value={values.keysChanged}
          onChange={handleChange}
          disabled={isDisabled}
        />
      </FormGroup>
      <FormGroup>
        <CustomInput
          checked={hasAlarmCode}
          id="hasAlarmCode"
          label="Is there an alarm code?"
          name="hasAlarmCode"
          type="checkbox"
          value={hasAlarmCode}
          onChange={handleToggleAlarm}
          disabled={isDisabled}
        />
        {hasAlarmCode && (
          <div className="col-6 col-sm-4 col-lg-3 p-0 mt-1">
            <FormField
              name="alarmCode"
              placeholder="Enter code"
              disabled={isDisabled}
            />
          </div>
        )}
      </FormGroup>
      <FormGroup>
        <CustomInput
          checked={values.hasDogs}
          id="hasDogs"
          label="Dogs on the premises?"
          name="hasDogs"
          type="checkbox"
          value={values.hasDogs}
          onChange={handleChange}
          disabled={isDisabled}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel for="accessInstructions">Access Instructions</FormLabel>
        <FormField
          name="accessInstructions"
          rows={4}
          type="textarea"
          placeholder="Please give instructions if required"
          disabled={isDisabled}
        />
      </FormGroup>
    </>
  );
};

TaskFieldsMaintenance.propTypes = {
  handleChange: PropTypes.func,
  setFieldValue: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  values: PropTypes.object,
};

TaskFieldsMaintenance.defaultProps = {
  isDisabled: false,
  values: {},
};
