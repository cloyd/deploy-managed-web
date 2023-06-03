import { FieldArray } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Button } from 'reactstrap';

import { FormFieldDateRange } from '@app/modules/Form';
import { DEFAULT_APPOINTMENT } from '@app/redux/task';

export const TaskFieldsAppointments = ({
  appointments,
  className,
  isDisabled,
  onChange,
}) => {
  const renderAppointment = useCallback(
    (arrayHelpers) => {
      const handleAction = (index) => () => {
        if (index === undefined) {
          arrayHelpers.push(DEFAULT_APPOINTMENT);
        } else if (index === 0) {
          arrayHelpers.replace(index, DEFAULT_APPOINTMENT);
        } else {
          arrayHelpers.remove(index);
        }
      };

      const canAdd =
        !isDisabled && appointments[0]?.startsAt && appointments[0]?.endsAt;

      return (
        <>
          {appointments.map((_, i) => {
            return (
              <div key={`appointments-${i}`} className={className}>
                <FormFieldDateRange
                  name={`appointments[${i}]`}
                  disabled={isDisabled}
                  onRemove={handleAction(i)}
                  onChange={onChange}
                />
              </div>
            );
          })}
          {canAdd && (
            <Button color="link" onClick={handleAction()}>
              + Add another preference
            </Button>
          )}
        </>
      );
    },
    [appointments, className, isDisabled, onChange]
  );

  return <FieldArray name="appointments" render={renderAppointment} />;
};

TaskFieldsAppointments.propTypes = {
  isDisabled: PropTypes.bool,
  appointments: PropTypes.array,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

TaskFieldsAppointments.defaultProps = {
  isDisabled: true,
  appointments: [{ startsAt: undefined, endsAt: undefined }],
  className: 'mb-2',
};
