import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Col, CustomInput, Form, FormGroup, Row } from 'reactstrap';

import { CardLight } from '../../Card';
import { FormButtons } from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';

export const TenantFormNotificationSettingsComponent = (props) => {
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
      data-testid="tenant-form-notification-settings"
      onSubmit={handleSubmit}>
      <FormGroup>
        <Row>
          <Col>
            <CardLight title={title || 'I would like to receive emails:'}>
              <h5 className="mb-3">Payments</h5>
              <CustomInput
                checked={!!values.paymentArrearsNotice}
                disabled
                id="paymentArrearsNotice"
                label="Arrears notice"
                name="paymentArrearsNotice"
                type="checkbox"
                onChange={handleOnChange}
              />
              <CustomInput
                checked={!!values.paymentRentDue}
                data-testid="setting-paymentRentDue"
                id="paymentRentDue"
                label="Just before rent is due"
                name="paymentRentDue"
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
                disabled
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
                disabled
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

TenantFormNotificationSettingsComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isInsetButtons: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  title: PropTypes.string,
  user: PropTypes.object,
  values: PropTypes.object.isRequired,
};

const config = {
  displayName: 'TenantFormNotificationSettings',
  enableReinitialize: true,

  mapPropsToValues: ({ user }) => {
    const {
      activityAddedAsTaskFollower,
      activityNewTaskMessage,
      paymentArrearsNotice,
      paymentFailed,
      paymentReceipt,
      paymentRentDue,
    } = user.userNotificationSetting || {};

    return {
      activityAddedAsTaskFollower,
      activityNewTaskMessage,
      paymentArrearsNotice,
      paymentFailed,
      paymentReceipt,
      paymentRentDue,
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

export const TenantFormNotificationSettings = compose(
  withFormik(config),
  withOnComplete
)(TenantFormNotificationSettingsComponent);
