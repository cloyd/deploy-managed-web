import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Col, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { isInPast } from '../../../utils';
import { ButtonSnooze } from '../../Button';
import { FormField, FormFieldDate, FormLabel } from '../../Form';

export const validationSchemaForFormDefaultFields = {
  description: Yup.string().required('Description is required'),

  title: Yup.string().required('Title is required'),

  type: Yup.string().required('Select a type of task'),

  reminderDate: Yup.string().when('isEditing', {
    is: false,
    then: Yup.string().test({
      name: 'reminderDate',
      message: 'Action date must be in the future',
      test: (value) => !isInPast(value),
    }),
  }),
};

export const TaskFieldsDefault = (props) => {
  const {
    isCreate,
    isManager,
    setFieldValue,
    statuses,
    values,
    isTenantOrOwner,
  } = props;

  const [showReminderDate, setShowReminderDate] = useState(false);

  const handleChangeDueDate = useCallback(
    (e) => {
      if (isInPast(e)) {
        setFieldValue('reminderDate', '');
        setShowReminderDate(false);
      } else {
        setShowReminderDate(true);
      }
    },
    [setFieldValue]
  );

  return (
    <>
      <FormGroup>
        <FormLabel for="title" isRequired>
          Title
        </FormLabel>
        <FormField name="title" disabled={isTenantOrOwner} />
      </FormGroup>
      <FormGroup>
        <FormLabel for="description" isRequired>
          Description
        </FormLabel>
        <FormField
          name="description"
          rows={6}
          type="textarea"
          disabled={isTenantOrOwner}
        />
      </FormGroup>
      <Row>
        <Col xs={6} md={3}>
          <FormGroup>
            <div className="d-flex flex-row justify-content-between">
              <FormLabel for="dueDate">Due date</FormLabel>
              <ButtonSnooze dueDate={values.dueDate} onClick={setFieldValue} />
            </div>
            <FormFieldDate
              name="dueDate"
              onChange={handleChangeDueDate}
              disabled={isTenantOrOwner}
            />
          </FormGroup>
        </Col>
        {isManager && (
          <>
            {showReminderDate && (
              <Col xs={6} md={3}>
                <FormGroup>
                  <FormLabel for="reminderDate">Action date</FormLabel>
                  <FormFieldDate name="reminderDate" />
                </FormGroup>
              </Col>
            )}
            {isCreate && (
              <Col md={6}>
                <FormGroup>
                  <FormLabel for="status">Status</FormLabel>
                  <FormField name="status" type="select">
                    {statuses.map((item) => (
                      <option key={`status-${item.key}`} value={item.key}>
                        {item.name}
                      </option>
                    ))}
                  </FormField>
                </FormGroup>
              </Col>
            )}
          </>
        )}
      </Row>
    </>
  );
};

TaskFieldsDefault.propTypes = {
  isCreate: PropTypes.bool,
  isManager: PropTypes.bool,
  setFieldValue: PropTypes.func.isRequired,
  statuses: PropTypes.array,
  values: PropTypes.object,
  isTenantOrOwner: PropTypes.bool,
};

TaskFieldsDefault.defaultProps = {
  isCreate: false,
  isManager: false,
  statuses: [],
  values: {},
};
