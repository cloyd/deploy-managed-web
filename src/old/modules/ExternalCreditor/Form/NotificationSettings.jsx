import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Col, CustomInput, Form, FormGroup, Row } from 'reactstrap';

import { CardLight } from '../../Card';
import { FormButtons } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';

export const ExternalCreditorFormNotificationSettingsComponent = (props) => {
  const {
    handleSubmit,
    isInsetButtons,
    onCancel,
    setFieldValue,
    title,
    values,
  } = props;

  const handleChange = useCallback(
    (e) => setFieldValue(e.target.name, e.target.checked),
    [setFieldValue]
  );

  return (
    <Form
      data-testid="external-creditor-form-notification-settings"
      onSubmit={handleSubmit}>
      <FormGroup>
        <Row>
          <Col>
            <CardLight title={title || 'I would like to receive emails:'}>
              <h5 className="mb-3">Marketplace</h5>
              <CustomInput
                checked={!!values.jobsAvailable}
                data-testid="setting-jobsAvailable"
                id="jobsAvailable"
                label="When jobs are available in my area"
                name="jobsAvailable"
                type="checkbox"
                onChange={handleChange}
              />

              <hr />

              <h5 className="mb-3">Jobs</h5>
              <CustomInput
                checked={!!values.newWorkOrder}
                id="newWorkOrder"
                label="When I receive a new work order"
                name="newWorkOrder"
                type="checkbox"
                onChange={handleChange}
              />
              <CustomInput
                checked={!!values.newQuoteRequest}
                id="newQuoteRequest"
                label="When I receive a new quote request"
                name="newQuoteRequest"
                type="checkbox"
                onChange={handleChange}
              />
              <CustomInput
                checked={!!values.unquotedJobReminder}
                id="unquotedJobReminder"
                label="Reminders for outstanding requests"
                name="unquotedJobReminder"
                type="checkbox"
                onChange={handleChange}
              />

              <hr />

              <h5 className="mb-3">Payments</h5>
              <CustomInput
                checked={!!values.jobPaid}
                id="jobPaid"
                label="When I am paid for a job"
                name="jobPaid"
                type="checkbox"
                onChange={handleChange}
              />

              {isInsetButtons && <FormButtons onCancel={onCancel} />}
            </CardLight>
          </Col>
        </Row>
      </FormGroup>
      {!isInsetButtons && <FormButtons onCancel={onCancel} />}
    </Form>
  );
};

ExternalCreditorFormNotificationSettingsComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isInsetButtons: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  title: PropTypes.string,
  user: PropTypes.object,
  values: PropTypes.object.isRequired,
};

const config = {
  displayName: 'ExternalCreditorFormNotificationSettings',
  enableReinitialize: true,

  mapPropsToValues: ({ user }) => {
    const {
      jobsAvailable,
      newWorkOrder,
      newQuoteRequest,
      unquotedJobReminder,
      jobPaid,
    } = user.userNotificationSetting || {};

    return {
      jobsAvailable,
      newWorkOrder,
      newQuoteRequest,
      unquotedJobReminder,
      jobPaid,
    };
  },

  handleSubmit: (values, { props }) => {
    const { onSubmit, user } = props;

    return (
      user.userNotificationSetting &&
      onSubmit({
        userNotificationSettingAttributes: {
          id: props.user.userNotificationSetting.id,
          ...values,
        },
      })
    );
  },
};

export const ExternalCreditorFormNotificationSettings = compose(
  withFormik(config),
  withOnComplete
)(ExternalCreditorFormNotificationSettingsComponent);
