import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { Button, Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { useIsChangedRef, useIsOpen } from '../../../hooks';
import {
  inspectionAttachmentCategoryByRole,
  inspectionItemAttachableTypeByRole,
} from '../../../utils';
import {
  FormButtons,
  FormField,
  FormFieldCheckbox,
  FormLabel,
} from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { ModalConfirm } from '../../Modal';
import { useRolesContext } from '../../Profile';
import { UploaderWidget } from '../../Uploader';
import { InspectionFormFieldIsAgreed } from './FieldIsAgreed';

const InspectionFormAreaItemComponent = ({
  btnSubmit,
  canEditAreaItemStatus,
  canEditIsAgreed,
  canEditIsChecked,
  errors,
  handleChange,
  isDisagreeInvalid,
  item,
  role,
  validateForm,
  values,
  setValues,
  onCancel,
  onUploaderComplete,
  onSetHasError,
  handleSubmit,
  resetAreaItemCondition,
}) => {
  const { isManager, isPrincipal } = useRolesContext();

  const itemRole = item[role] || {};

  const hasAttachmentsUpdated = useIsChangedRef(
    itemRole.attachments?.length || []
  );

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  useEffect(() => {
    if (values.isAgreed === false || values.isAgreed === 'false') {
      validateForm();
    }
  }, [hasAttachmentsUpdated, isDisagreeInvalid, validateForm, values.isAgreed]);

  useEffect(() => {
    onSetHasError(!isValid);
  }, [isValid, onSetHasError]);

  const resetCondition = () => {
    setValues({
      isClean: true,
      isUndamaged: true,
      isWorking: true,
      isChecked: false,
      note: '',
    });
    resetAreaItemCondition(item);
  };

  const [isOpen, actions] = useIsOpen(resetCondition);

  return (
    <Form data-testid="form-inspection-area-item" onSubmit={handleSubmit}>
      {canEditAreaItemStatus && (
        <Row>
          <Col xs={12}>
            <p className="mb-2">Item Status</p>
          </Col>
          <Col sm={6} md={4}>
            <FormGroup>
              <FormLabel for="isClean" isRequired>
                Is Clean?
              </FormLabel>
              <FormField name="isClean" type="select">
                <option value="true">Yes</option>
                <option value="false">No</option>
                <option value="">-</option>
              </FormField>
            </FormGroup>
          </Col>
          <Col sm={6} md={4}>
            <FormGroup>
              <FormLabel for="isUndamaged" isRequired>
                Is Undamaged?
              </FormLabel>
              <FormField name="isUndamaged" type="select">
                <option value="true">Yes</option>
                <option value="false">No</option>
                <option value="">-</option>
              </FormField>
            </FormGroup>
          </Col>
          <Col sm={6} md={4}>
            <FormGroup>
              <FormLabel for="isWorking" isRequired>
                Is Working?
              </FormLabel>
              <FormField name="isWorking" type="select">
                <option value="true">Yes</option>
                <option value="false">No</option>
                <option value="">-</option>
              </FormField>
            </FormGroup>
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={12}>
          <FormGroup>
            <FormLabel for="note">Description</FormLabel>
            <FormField
              autoFocus={!!errors.note || values.isAgreed === false}
              name="note"
              rows={6}
              type="textarea"
            />
          </FormGroup>
        </Col>
        {onUploaderComplete && (
          <Col xs={12} className="my-3">
            <p className="mb-2">Attachments</p>
            <UploaderWidget
              attachments={itemRole.attachments}
              attachableId={
                // Tenants use a separate attachableId
                itemRole.attachableId ? itemRole.attachableId : item.id
              }
              attachableCategory={inspectionAttachmentCategoryByRole(role)}
              attachableType={inspectionItemAttachableTypeByRole(role)}
              error={errors.attachments}
              onUploaderComplete={onUploaderComplete('items', item.id)}
            />
          </Col>
        )}
        {canEditIsAgreed && (
          <Col xs={12}>
            <InspectionFormFieldIsAgreed
              id={item.id}
              value={values.isAgreed}
              onChange={handleChange}
            />
          </Col>
        )}
        {canEditIsChecked && (
          <Col xs={12}>
            <FormFieldCheckbox
              classNameLabel="text-normal"
              icon="check"
              isChecked={values.isChecked}
              fieldId={item.id}
              name="isChecked"
              text="Mark item as checked"
              onChange={handleChange}
            />
          </Col>
        )}
      </Row>
      <Row>
        {(isManager || isPrincipal) && (
          <Col>
            <Button color="primary" onClick={actions.handleOpen}>
              Reset Item
            </Button>
          </Col>
        )}
        <Col>
          <FormButtons
            btnSubmit={btnSubmit}
            isValid={isValid}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          />
        </Col>
      </Row>
      <ModalConfirm
        body="Are you sure you want to reset this item? (Attachments will be permanently deleted)."
        btnSubmit={{ color: 'danger', text: 'Yes' }}
        isOpen={isOpen}
        title="Are you sure?"
        onCancel={actions.handleClose}
        onSubmit={actions.handleSubmit}
      />
    </Form>
  );
};

InspectionFormAreaItemComponent.propTypes = {
  btnSubmit: PropTypes.object,
  canEditAreaItemStatus: PropTypes.bool,
  canEditIsAgreed: PropTypes.bool,
  canEditIsChecked: PropTypes.bool,
  errors: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isDisagreeInvalid: PropTypes.bool,
  isLoading: PropTypes.bool,
  isTestMode: PropTypes.bool,
  item: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onSetHasError: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  resetAreaItemCondition: PropTypes.func,
  role: PropTypes.string.isRequired,
  validateForm: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func,
};

InspectionFormAreaItemComponent.defaultProps = {
  canEditAreaItemStatus: false,
  canEditIsAgreed: false,
  canEditIsChecked: false,
  errors: {},
  isDisagreeInvalid: false,
};

const config = {
  displayName: 'InspectionFormAreaItem',

  mapPropsToValues: (props) => {
    const {
      canEditAreaItemStatus,
      canEditIsAgreed,
      canEditIsChecked,
      isDisagreeInvalid,
      item,
      role,
    } = props;
    let values = {};

    if (canEditAreaItemStatus) {
      values.isClean = item.isClean?.toString();
      values.isUndamaged = item.isUndamaged?.toString();
      values.isWorking = item.isWorking?.toString();
    }

    if (isDisagreeInvalid) {
      values.isAgreed = false;
    } else if (canEditIsAgreed && item[role]) {
      values.isAgreed = item[role].isAgreed;
    }

    if (canEditIsChecked) {
      values.isChecked = true;
    }

    return {
      ...values,
      note: item[role] && item[role].note ? item[role].note : '',
    };
  },

  validate: (values, props) => {
    const { isTestMode, item, role } = props;
    const attachments = item[role]?.attachments || [];
    let customValidation = {};

    // If tenant disagrees with the item, check that they have provided an image
    if (
      !isTestMode &&
      (values.isAgreed === false || values.isAgreed === 'false') &&
      attachments.length === 0
    ) {
      customValidation.attachments = 'An image is required to disagree';
    }

    return customValidation;
  },

  validationSchema: () => {
    const schema = {
      isAgreed: Yup.boolean(),
      isClean: Yup.boolean().nullable(),
      isUndamaged: Yup.boolean().nullable(),
      isWorking: Yup.boolean().nullable(),
      note: Yup.string().when('isAgreed', {
        is: false,
        then: Yup.string().required('A reason is required to disagree'),
      }),
    };

    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit({ ...values });
    setSubmitting(false);
  },
};

export const InspectionFormAreaItem = compose(
  withFormik(config),
  withOnComplete
)(InspectionFormAreaItemComponent);
