/* eslint-disable react/jsx-no-bind */
import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { Col, Form, FormGroup, Label, Row } from 'reactstrap';
import * as Yup from 'yup';

import {
  FormButtons,
  FormField,
  FormFieldLeases,
  FormFollowers,
  FormLabel,
  FormOptionsList,
} from '@app/modules/Form';
import { withOnComplete } from '@app/modules/Form/withOnComplete';
import { useRolesContext } from '@app/modules/Profile';
import { withRouterHash } from '@app/modules/Route';
import {
  TaskFieldsBill,
  TaskFieldsDefault,
  TaskFieldsMaintenance,
  mapBillFieldsProps,
  useTaskFormState,
  useTaskTypes,
  validationSchemaForBillFields,
  validationSchemaForFormDefaultFields,
} from '@app/modules/Task';
import { INSPECTION_TASK_TYPE, PRIORITIES } from '@app/redux/task';
import {
  ATTACHMENT_CATEGORIES,
  dollarToCents,
  removeSeparators,
  splitKey,
} from '@app/utils';

import { UploaderWidget } from '../../Uploader';

const FormComponent = ({
  creditorList,
  debtorList,
  fetchBpayBillers,
  handleChange,
  handleSubmit,
  hasAllowedBpayBillerAsCreditor,
  isBpayOut,
  isMarketplaceEnabled,
  isSubmitting,
  isValid,
  leases,
  onCancel,
  pastTenants,
  property,
  setFieldValue,
  taskMeta,
  upcomingTenants,
  values,
}) => {
  const { isCorporateUser, isManager } = useRolesContext();
  const taskTypes = useTaskTypes(taskMeta, isManager);

  const [state, actions] = useTaskFormState({
    handleChange,
    isCreate: true,
    setFieldValue,
    taskMeta,
    values,
  });

  const [categories, setCategories] = useState(state.categories);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (values.type === INSPECTION_TASK_TYPE && leases) {
      const activeLease = leases.find((lease) => lease.isActive === true);

      if (activeLease) {
        setFieldValue('leaseId', activeLease.id.toString());
        setCategories(state.categories);
      } else {
        setCategories(
          state.categories.filter(
            (category) =>
              category.key !== 'ingoing' && category.key !== 'outgoing'
          )
        );
      }
    } else {
      setCategories(state.categories);
    }
  }, [values.type, state.categories]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const showCategories = useMemo(
    () => categories.length > 0 && !values.isBill,
    [values.isBill, categories]
  );

  const showFollowers = useMemo(() => {
    return (
      !values.isBill &&
      state.defaultFollowers.length > 0 &&
      state.showDefaultFields
    );
  }, [values.isBill, state.defaultFollowers, state.showDefaultFields]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabel for="type" isRequired>
          Type of task
        </FormLabel>
        <FormField
          name="type"
          type="select"
          onChange={actions.handleChangeTaskType(debtorList)}>
          <FormOptionsList hasBlank={true} name="type" options={taskTypes} />
        </FormField>
      </FormGroup>
      {isManager && (
        <Row>
          <Col md={state.showDefaultFields && !values.isBill ? 6 : 12}>
            <FormGroup>
              <FormLabel for="assigneeId" isRequired>
                Assign task to
              </FormLabel>
              <FormField name="assigneeId" type="select">
                <FormOptionsList
                  hasBlank={true}
                  name="assigneeId"
                  options={property.managers}
                />
              </FormField>
            </FormGroup>
          </Col>
          {showFollowers && (
            <Col md={6}>
              <FormGroup>
                <FormLabel for="followers" isRequired>
                  Task followers
                </FormLabel>
                <FormFollowers
                  defaultValue={state.defaultFollowers}
                  name="followers"
                  onChange={actions.handleChangeFollowers}
                  value={values.followers}
                />
              </FormGroup>
            </Col>
          )}
        </Row>
      )}
      {showCategories && (
        <FormGroup>
          <FormLabel
            for="category"
            isRequired={values.type === INSPECTION_TASK_TYPE}>
            Category
          </FormLabel>
          <FormField
            name="category"
            type="select"
            disabled={state.categories.length === 0 || values.isBill}>
            <FormOptionsList
              hasBlank={true}
              name="category"
              options={categories.map((category) => category.key)}
            />
          </FormField>
        </FormGroup>
      )}
      {state.showDefaultFields && values.type === INSPECTION_TASK_TYPE && (
        <FormGroup>
          <FormLabel for="leaseId" isRequired>
            Lease
          </FormLabel>
          <FormFieldLeases
            defaultLabelText="Complete report with no tenancy"
            leases={leases}
            name="leaseId"
          />
        </FormGroup>
      )}
      {state.showDefaultFields && !values.isBill && (
        <FormGroup>
          <FormLabel for="priority">Priority</FormLabel>
          <FormField name="priority" type="select">
            <FormOptionsList name="priority" options={PRIORITIES} />
          </FormField>
        </FormGroup>
      )}
      {state.showDefaultFields && (
        <TaskFieldsDefault
          isCreate={true}
          isManager={isManager}
          setFieldValue={setFieldValue}
          statuses={state.statuses}
          values={values}
        />
      )}
      {values.isMaintenance && (
        <TaskFieldsMaintenance
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          isManager={isManager}
          values={values}
        />
      )}
      {isManager && values.isBill && (
        <TaskFieldsBill
          creditorList={creditorList}
          creditorType={state.creditorType}
          debtorList={debtorList}
          defaultFollowers={state.defaultFollowers}
          fetchBpayBillers={fetchBpayBillers}
          hasAllowedBpayBillerAsCreditor={hasAllowedBpayBillerAsCreditor}
          hasBpayOptions={!isBpayOut && !isCorporateUser}
          invoiceCategories={state.invoiceCategories}
          isMarketplaceEnabled={isMarketplaceEnabled}
          pastTenants={pastTenants}
          upcomingTenants={upcomingTenants}
          property={property}
          setFieldValue={setFieldValue}
          values={values}
          onChange={handleChange}
          onChangeFollowers={actions.handleChangeFollowers}
          onUpdateCreditor={actions.handleUpdateState('creditorType')}
        />
      )}
      <div style={isValid ? null : { opacity: 0.25 }}>
        <Label>Attachments</Label>
        <div className={isValid ? 'd-none' : 'd-block'}>
          (Please provide required fields before uploading a document.)
        </div>
        <input name="attachments" type="text" hidden />
        <div id="attachments" className="d-block">
          <UploaderWidget
            attachments={values?.attachments}
            attachableType="PropertyTask"
            attachableId={0}
            attachableCategory={ATTACHMENT_CATEGORIES.taskAttachment}
            setAttachments={(attachments) => {
              setFieldValue(
                'attachments',
                values?.attachments.concat(attachments)
              );
            }}
            onUploaderComplete={({ attachmentIds }) => {
              setFieldValue(
                'attachments',
                values.attachments.filter(
                  ({ id }) => !attachmentIds.includes(id)
                )
              );
            }}
            isAttachOnCreate
          />
        </div>
      </div>
      <FormButtons
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isValid={isValid}
        isOverlayed
      />
    </Form>
  );
};

FormComponent.propTypes = {
  creditorList: PropTypes.array,
  debtorList: PropTypes.array,
  fetchBpayBillers: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasAllowedBpayBillerAsCreditor: PropTypes.bool,
  hasError: PropTypes.bool,
  isBill: PropTypes.bool,
  isBpayOut: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  leases: PropTypes.array,
  onCancel: PropTypes.func,
  onComplete: PropTypes.func,
  pastTenants: PropTypes.array,
  property: PropTypes.object,
  setFieldValue: PropTypes.func.isRequired,
  taskMeta: PropTypes.object.isRequired,
  types: PropTypes.array,
  values: PropTypes.object.isRequired,
  upcomingTenants: PropTypes.array,
  taskId: PropTypes.number,
  onUploaderComplete: PropTypes.func,
};

FormComponent.defaultProps = {
  hasError: false,
  isBill: false,
  isBpayOut: true,
  isLoading: true,
  isSubmitting: false,
  isValid: false,
  property: {},
  types: [],
};

const config = {
  displayName: 'TaskFormCreate',
  enableReinitialize: true,

  mapPropsToValues: (props) => {
    const { debtorList, isBill, property } = props;

    return {
      // Default fields
      isEditing: false, // Used to conditionally validate fields
      assigneeId: property.assigneeId,
      type: isBill ? 'bill' : '',
      propertyId: property.id || '',

      // type: Bill
      isBill,
      attachments: [],
      ...(isBill && mapBillFieldsProps({}, debtorList)),
    };
  },

  validationSchema: Yup.object().shape({
    isEditing: Yup.bool(),
    assigneeId: Yup.string().required('Task assignee is required'),
    category: Yup.string().when('type', {
      is: INSPECTION_TASK_TYPE,
      then: Yup.string().required('Category is required'),
    }),
    leaseId: Yup.string().when('type', {
      is: INSPECTION_TASK_TYPE,
      then: Yup.string().required('Lease is required'),
    }),
    ...validationSchemaForFormDefaultFields,
    ...validationSchemaForBillFields,
  }),

  handleSubmit: (values, { props }) => {
    let invoiceAttributes;
    const {
      followers,
      invoiceCategory,
      isBill,
      isEditing,
      isMaintenance,
      payments,
      bpayBillerId,
      ...params
    } = values;

    if (isBill) {
      invoiceAttributes = payments.map(
        ({
          creditorKey,
          debtorKey,
          isBpayBiller,
          amountDollars,
          bpayBillerId,
          bpayBillerCode: paymentBpayBillerCode,
          bpayReference: paymentBpayReference,
          followers,
          gstIncluded,
          isAgencyCoveringFees,
          referenceNumber,
        }) => {
          const [creditorId, creditorType] = splitKey(creditorKey);
          const [debtorId, debtorType] = creditorId ? splitKey(debtorKey) : [];

          // Rails throws an error if these are saved as empty strings instead of null.
          const bpayBillerCode =
            isBpayBiller && !!paymentBpayBillerCode
              ? removeSeparators(paymentBpayBillerCode, ' ')
              : null;

          const formattedBpayReference = removeSeparators(
            paymentBpayReference,
            ' '
          );

          const bpayReference =
            isBpayBiller && !!formattedBpayReference
              ? formattedBpayReference
              : null;

          // Convert dollars back to cents. Set to 0 if there is no debtor.
          const amountCents =
            creditorId && debtorId ? dollarToCents(amountDollars) : 0;

          return {
            amountCents,
            bpayBillerCode,
            bpayReference,
            creditorId: creditorId !== 'PayViaBpay' ? creditorId : bpayBillerId,
            creditorType,
            debtorId,
            debtorType,
            followers,
            gstIncluded,
            isAgencyCoveringFees,
            referenceNumber,
            ...(invoiceCategory && { category: invoiceCategory }),
          };
        }
      );
    }

    props.onSubmit({
      ...params,
      ...(!isBill && {
        followedByOwner: !!followers.find(({ value }) => value === 'owners'),
        followedByTenant: !!followers.find(({ value }) => value === 'tenants'),
      }),
      ...(invoiceAttributes && { invoiceAttributes }),
    });
  },
};

export const TaskFormCreate = compose(
  withRouterHash,
  withFormik(config),
  withOnComplete
)(FormComponent);
