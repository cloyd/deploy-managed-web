import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Button, Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { useIsOpen } from '../../../hooks';
import {
  inspectionAreaAttachableTypeByRole,
  inspectionAttachmentCategoryByRole,
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

const InspectionFormAreaOverviewComponent = (props) => {
  const { area, errors, role, values, resetOverviewCondition, setValues } =
    props;
  const areaRole = area[role] || { attachments: [] };
  const { isManager, isPrincipal } = useRolesContext();

  const resetCondition = useCallback(() => {
    setValues({
      isChecked: false,
      note: '',
    });
    resetOverviewCondition();
  }, [resetOverviewCondition, setValues]);

  const [isOpen, actions] = useIsOpen(resetCondition);

  return (
    <Form
      data-testid="form-inspection-area-overview"
      onSubmit={props.handleSubmit}>
      <Row>
        <Col xs={12}>
          <FormGroup>
            <FormLabel for="note">Description</FormLabel>
            <FormField name="note" rows={6} type="textarea" />
          </FormGroup>
        </Col>
        {props.onUploaderComplete && (
          <Col xs={12} className="my-3">
            <p className="mb-2">Attachments</p>
            <UploaderWidget
              attachments={areaRole.attachments}
              attachableId={
                // Tenants use a separate attachableId
                areaRole.attachableId ? areaRole.attachableId : area.id
              }
              attachableCategory={inspectionAttachmentCategoryByRole(role)}
              attachableType={inspectionAreaAttachableTypeByRole(role)}
              onUploaderComplete={props.onUploaderComplete('areas', area.id)}
            />
          </Col>
        )}
        {props.canEditIsChecked && (
          <Col xs={12}>
            <FormFieldCheckbox
              classNameLabel="text-normal"
              icon="check"
              isChecked={values.isChecked}
              fieldId={area.id}
              name="isChecked"
              text="Mark item as checked"
              onChange={props.handleChange}
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
            btnSubmit={props.btnSubmit}
            isValid={Object.keys(errors).length === 0}
            onSubmit={props.handleSubmit}
            onCancel={props.onCancel}
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

InspectionFormAreaOverviewComponent.propTypes = {
  area: PropTypes.object.isRequired,
  btnSubmit: PropTypes.object,
  canEditIsChecked: PropTypes.bool,
  errors: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  onUploaderComplete: PropTypes.func,
  resetOverviewCondition: PropTypes.func,
  role: PropTypes.string.isRequired,
  setValues: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

InspectionFormAreaOverviewComponent.defaultProps = {
  errors: {},
};

const config = {
  displayName: 'InspectionFormAreaItem',

  mapPropsToValues: (props) => {
    const { area, canEditIsChecked, role } = props;
    let values = {};

    if (canEditIsChecked) {
      values.isChecked = true;
    }

    return {
      ...values,
      note: area[role] && area[role].note ? area[role].note : '',
    };
  },

  validationSchema: () => {
    const schema = {
      note: Yup.string(),
    };

    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props, setSubmitting }) => {
    props.onSubmit({ ...values });
    setSubmitting(false);
  },
};

export const InspectionFormAreaOverview = compose(
  withFormik(config),
  withOnComplete
)(InspectionFormAreaOverviewComponent);
