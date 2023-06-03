import get from 'lodash/fp/get';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, CustomInput, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { FORM_NINE_ENTRY_GROUNDS } from '../../../redux/task';
import { isInPast } from '../../../utils';
import { DividerDouble } from '../../Divider';
import { FormField, FormFieldDate, FormLabel } from '../../Form';

export const mapFormNineFieldsProps = (
  formNine = {},
  user = {},
  agency = {}
) => {
  const nameDefault = `${user.firstName} ${user.lastName}`;
  const phoneNumberDefault = user.phoneNumber || agency.phoneNumber;

  return {
    formNine: {
      firstEnteringPerson: {
        name: nameDefault || '',
        phoneNumber: phoneNumberDefault || '',
      },
      groundForEntry: formNine.groundForEntry || {},
      isTwoHourPeriod: formNine.isTwoHourPeriod || false,
      timeOfEntry: formNine.timeOfEntry || '',
    },
  };
};

export const validationSchemaForFormNineFields = {
  formNine: Yup.object({
    firstEnteringPerson: Yup.object({
      name: Yup.string().required('Name is required'),
      phoneNumber: Yup.string().required('Phone number is required'),
    }),
    timeOfEntry: Yup.string()
      .test({
        name: 'formNine.timeOfEntry',
        message: 'Time of Entry must be in the future',
        test: (value) => !isInPast(value),
      })
      .required('Time of Entry is required'),
  }),
};

export const TaskFieldsFormNine = (props) => {
  const { handleChange, isCompactView, values } = props;

  return (
    <>
      <DividerDouble className="my-4" />
      <Row>
        <Col xs={12} className="mb-2">
          <strong>Details of all people entering</strong>
        </Col>
        <Col md={isCompactView ? 12 : 4}>
          <EnteringPersonFields
            field="firstEnteringPerson"
            isRequired={true}
            title="Person 1"
          />
        </Col>
        <Col md={isCompactView ? 12 : 4}>
          <EnteringPersonFields field="secondEnteringPerson" title="Person 2" />
        </Col>
        <Col md={isCompactView ? 12 : 4}>
          <EnteringPersonFields field="thirdEnteringPerson" title="Person 3" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <strong className="d-flex mb-2">
            Entry is sought under the following grounds
          </strong>
          {Object.keys(FORM_NINE_ENTRY_GROUNDS).map((field) => (
            <EntryGroundInput
              key={`formNine-${field}`}
              field={field}
              handleChange={handleChange}
              values={values}
            />
          ))}
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="mt-3">
          <strong className="d-flex">
            Entry to the property by the property owner/manager or other
            authorised person
          </strong>
          <p className="mb-2">
            Entry on Sundays, public holidays or after 6pm, and before 8am, is
            only allowed if the tenant agrees.
          </p>
          <FormGroup>
            <FormLabel
              for="formNine.timeOfEntry"
              isRequired={true}
              className="mb-2">
              Time of entry
            </FormLabel>
            <FormFieldDate isDateTime={true} name="formNine.timeOfEntry" />
            <div className="mt-2">
              <CustomInput
                checked={!!get('formNine.isTwoHourPeriod', values)}
                className="custom-control-sm"
                id="formNine.isTwoHourPeriod"
                inline={true}
                label="Entry will be within 2h of stated time **"
                name="formNine.isTwoHourPeriod"
                type="checkbox"
                onChange={handleChange}
              />
            </div>
            <small className="d-flex mt-2">
              ** If entry is by property owner/manager only, a maximum two hour
              period during which entry will commence must be nominated.
            </small>
          </FormGroup>
        </Col>
      </Row>
      <DividerDouble className="my-4" />
    </>
  );
};

TaskFieldsFormNine.propTypes = {
  handleChange: PropTypes.func,
  isCompactView: PropTypes.bool,
  values: PropTypes.object,
};

const EnteringPersonFields = ({ isRequired, field, title }) => (
  <>
    <p className="mb-1">{title}</p>
    <FormGroup>
      <FormLabel for={`formNine.${field}.name`} isRequired={isRequired}>
        Full name / trading name
      </FormLabel>
      <FormField name={`formNine.${field}.name`} className="mb-2" />
      <FormLabel for={`formNine.${field}.phoneNumber`} isRequired={isRequired}>
        Phone Number
      </FormLabel>
      <FormField name={`formNine.${field}.phoneNumber`} />
    </FormGroup>
  </>
);

EnteringPersonFields.propTypes = {
  field: PropTypes.string,
  isRequired: PropTypes.bool,
  title: PropTypes.string,
};

const EntryGroundInput = (props) => {
  const { field, handleChange, values } = props;
  const fieldName = `formNine.groundForEntry.${field}`;

  return (
    <div className="mb-2">
      <CustomInput
        checked={!!get(fieldName, values)}
        className="custom-control-sm"
        id={fieldName}
        inline={true}
        label={FORM_NINE_ENTRY_GROUNDS[field]}
        name={fieldName}
        type="checkbox"
        onChange={handleChange}
      />
    </div>
  );
};

EntryGroundInput.propTypes = {
  field: PropTypes.string,
  handleChange: PropTypes.func,
  values: PropTypes.object,
};
