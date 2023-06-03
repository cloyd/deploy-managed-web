import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Col, CustomInput, Form, FormGroup, Row } from 'reactstrap';

import { CardLight } from '../../Card';
import { FormButtons } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';

export const OwnerFormNotificationSettingsComponent = (props) => {
  const {
    handleSubmit,
    isInsetButtons,
    onCancel,
    setFieldValue,
    title,
    values,
  } = props;

  const handleOnChange = useCallback(
    (e) => setFieldValue(e.target.name, e.target.checked),
    [setFieldValue]
  );

  return (
    <Form
      data-testid="owner-form-notification-settings"
      onSubmit={handleSubmit}>
      <FormGroup>
        <Row>
          <Col>
            <CardLight title={title || 'I would like to receive emails:'}>
              <h5 className="mb-3">Statements</h5>
              <CustomInput
                checked={!!values.statementMonthly}
                data-testid="setting-statementMonthly"
                id="statementMonthly"
                label="When my monthly statement is ready"
                name="statementMonthly"
                type="checkbox"
                onChange={handleOnChange}
              />
              <CustomInput
                checked={!!values.consolidateStatement}
                id="consolidateStatement"
                label="With Consolidated statements from all my properties"
                name="consolidateStatement"
                type="checkbox"
                onChange={handleOnChange}
              />
              <hr />
              <h5 className="mb-3">Payments</h5>
              <CustomInput
                checked={!!values.paymentRentPaid}
                id="paymentRentPaid"
                label="When rent has been paid"
                name="paymentRentPaid"
                type="checkbox"
                onChange={handleOnChange}
              />
              <CustomInput
                checked={!!values.paymentBillReminder}
                id="paymentBillReminder"
                label="Just before a bill is about to be paid"
                name="paymentBillReminder"
                type="checkbox"
                onChange={handleOnChange}
              />
              <CustomInput
                checked={!!values.paymentDepositTaken}
                id="paymentDepositTaken"
                label="When the tenants pay their deposit"
                name="paymentDepositTaken"
                type="checkbox"
                onChange={handleOnChange}
              />
              <CustomInput
                checked={!!values.paymentReceipt}
                id="paymentReceipt"
                label="A payment receipt"
                name="paymentReceipt"
                type="checkbox"
                onChange={handleOnChange}
              />
              <CustomInput
                checked={!!values.paymentFailed}
                id="paymentFailed"
                label="When a payment has failed / been declined"
                name="paymentFailed"
                type="checkbox"
                onChange={handleOnChange}
              />
              <hr />
              <h5 className="mb-3">Activity</h5>
              <CustomInput
                checked={!!values.activityAddedAsTaskFollower}
                id="activityAddedAsTaskFollower"
                label="When I am added to a task"
                name="activityAddedAsTaskFollower"
                type="checkbox"
                onChange={handleOnChange}
              />
              <CustomInput
                checked={!!values.activityNewTaskMessage}
                disabled
                id="activityNewTaskMessage"
                label="When I have a reply or message"
                name="activityNewTaskMessage"
                type="checkbox"
                onChange={handleOnChange}
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

OwnerFormNotificationSettingsComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isInsetButtons: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  title: PropTypes.string,
  user: PropTypes.object,
  values: PropTypes.object.isRequired,
};

const config = {
  displayName: 'OwnerFormNotificationSettings',
  enableReinitialize: true,

  mapPropsToValues: ({ user }) => {
    const {
      contactMethod,
      statementMonthly,
      paymentRentPaid,
      paymentBillReminder,
      paymentReceipt,
      paymentDepositTaken,
      paymentFailed,
      activityAddedAsTaskFollower,
      activityTaskStatusChange,
      activityNewTaskMessage,
      consolidateStatement,
    } = user.userNotificationSetting || {};

    return {
      contactMethod,
      statementMonthly,
      paymentRentPaid,
      paymentBillReminder,
      paymentReceipt,
      paymentDepositTaken,
      paymentFailed,
      activityAddedAsTaskFollower,
      activityTaskStatusChange,
      activityNewTaskMessage,
      consolidateStatement,
    };
  },

  handleSubmit: (values, { props }) => {
    const { onSubmit, user } = props;

    return (
      user.userNotificationSetting &&
      onSubmit({
        userNotificationSettingAttributes: {
          id: user.userNotificationSetting.id,
          ...values,
        },
      })
    );
  },
};

export const OwnerFormNotificationSettings = compose(
  withFormik(config),
  withOnComplete
)(OwnerFormNotificationSettingsComponent);
