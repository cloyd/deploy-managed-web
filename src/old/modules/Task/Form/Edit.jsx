import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Form, FormGroup, Label, Row } from 'reactstrap';
import * as Yup from 'yup';

import {
  BILLABLE_TYPES,
  INSPECTION_TASK_TYPE,
  PRIORITIES,
} from '../../../redux/task';
import {
  ATTACHMENT_CATEGORIES,
  dollarToCents,
  removeSeparators,
  splitKey,
} from '../../../utils';
import {
  FormButtons,
  FormField,
  FormFieldLeases,
  FormFollowers,
  FormLabel,
  FormOptionsList,
} from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { useRolesContext } from '../../Profile';
import { withRouterHash } from '../../Route/withRouterHash';
import { UploaderWidget } from '../../Uploader';
import {
  TaskFieldsBill,
  TaskFieldsDefault,
  TaskFieldsMaintenance,
  mapBillFieldsProps,
  mapMaintenanceFieldsProps,
  validationSchemaForBillFields,
  validationSchemaForFormDefaultFields,
} from '../Fields';
import { useTaskFormState, useTaskTypes } from '../hooks';

const FormComponent = (props) => {
  const {
    fetchBpayBillers,
    handleChange,
    handleSubmit,
    hasAllowedBpayBillerAsCreditor,
    isSubmitting,
    isValid,
    onUploaderComplete,
    property,
    setFieldValue,
    task,
    taskMeta,
    values,
  } = props;

  const { isCorporateUser, isManager, isOwner, isTenant } = useRolesContext();
  const taskTypes = useTaskTypes(taskMeta, isManager);

  const [state, actions] = useTaskFormState({
    handleChange,
    setFieldValue,
    taskMeta,
    values,
  });

  const isTenantOrOwner = isOwner || isTenant;

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabel for="type" isRequired>
          Type of task
        </FormLabel>
        <FormField
          disabled
          name="type"
          type="select"
          onChange={actions.handleChangeTaskType}>
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
          {!values.isBill &&
            state.showDefaultFields &&
            state.defaultFollowers.length && (
              <Col md={6}>
                <FormGroup>
                  <FormLabel for="followers" isRequired>
                    Task followers
                  </FormLabel>
                  <FormFollowers
                    defaultValue={values.followers}
                    name="followers"
                    onChange={actions.handleChangeFollowers}
                    value={values.followers}
                  />
                </FormGroup>
              </Col>
            )}
        </Row>
      )}
      <FormGroup>
        <FormLabel
          for="category"
          isRequired={values.type === INSPECTION_TASK_TYPE}>
          Category
        </FormLabel>
        <FormField
          name="category"
          type="select"
          disabled={
            state.categories.length === 0 || values.isBill || isTenantOrOwner
          }>
          <FormOptionsList
            hasBlank={true}
            name="category"
            options={state.categories.map((category) => category.key)}
          />
        </FormField>
      </FormGroup>
      {state.showDefaultFields && values.type === INSPECTION_TASK_TYPE && (
        <FormGroup>
          <FormLabel for="leaseId" isRequired>
            Lease
          </FormLabel>
          <FormFieldLeases
            defaultLabelText="Complete report with no tenancy"
            disabled={true}
            leases={props.leases}
            name="leaseId"
          />
        </FormGroup>
      )}
      {state.showDefaultFields && !values.isBill && (
        <FormGroup>
          <FormLabel for="priority">Priority</FormLabel>
          <FormField name="priority" type="select" disabled={isTenantOrOwner}>
            <FormOptionsList name="priority" options={PRIORITIES} />
          </FormField>
        </FormGroup>
      )}
      {state.showDefaultFields && (
        <TaskFieldsDefault
          isManager={isManager}
          setFieldValue={setFieldValue}
          statuses={state.statuses}
          values={values}
          isTenantOrOwner={isTenantOrOwner}
        />
      )}
      {values.isMaintenance && (
        <TaskFieldsMaintenance
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          isManager={isManager}
          values={values}
          isDisabled={isTenantOrOwner}
        />
      )}
      {isManager && values.isBill && (
        <TaskFieldsBill
          creditorList={props.creditorList}
          creditorType={state.creditorType}
          debtorList={props.debtorList}
          fetchBpayBillers={fetchBpayBillers}
          hasAllowedBpayBillerAsCreditor={hasAllowedBpayBillerAsCreditor}
          hasBpayOptions={!props.isBpayOut && !isCorporateUser}
          invoice={task.invoice}
          invoiceCategories={state.invoiceCategories}
          isEditPage
          isMarketplaceEnabled={props.isMarketplaceEnabled}
          pastTenants={props.pastTenants}
          upcomingTenants={props.upcomingTenants}
          property={property}
          setFieldValue={setFieldValue}
          values={values}
          onChange={handleChange}
          onChangeFollowers={actions.handleChangeFollowers}
          onUpdateCreditor={actions.handleUpdateState('creditorType')}
        />
      )}
      {state.showDefaultFields && (
        <div style={task.id ? null : { opacity: 0.25 }}>
          <Label>Attachments</Label>
          <div className={task.id ? 'd-none' : 'd-block'}>
            (Please save before adding attachments to the task.)
          </div>
          <div id="attachments" className={task.id ? 'd-block' : 'd-none'}>
            <UploaderWidget
              attachments={task.attachments}
              attachableType="PropertyTask"
              attachableId={task.id}
              attachableCategory={ATTACHMENT_CATEGORIES.taskAttachment}
              onUploaderComplete={onUploaderComplete}
            />
          </div>
        </div>
      )}
      <FormButtons
        onCancel={props.onCancel}
        isSubmitting={isSubmitting}
        isValid={isValid}
        isOverlayed
      />
    </Form>
  );
};

FormComponent.propTypes = {
  acceptedQuote: PropTypes.object,
  creditorList: PropTypes.array,
  debtorList: PropTypes.array,
  fetchBpayBillers: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasAllowedBpayBillerAsCreditor: PropTypes.bool,
  hasError: PropTypes.bool,
  isBill: PropTypes.bool.isRequired,
  isBpayOut: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  leases: PropTypes.array,
  onCancel: PropTypes.func,
  onComplete: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  pastTenants: PropTypes.array,
  property: PropTypes.object,
  setFieldValue: PropTypes.func.isRequired,
  task: PropTypes.object,
  taskMeta: PropTypes.object.isRequired,
  types: PropTypes.array,
  values: PropTypes.object.isRequired,
  upcomingTenants: PropTypes.array,
};

FormComponent.defaultProps = {
  hasError: false,
  isBpayOut: true,
  isLoading: true,
  isSubmitting: false,
  isValid: false,
  property: {},
  task: {},
  types: [],
};

const config = {
  displayName: 'TaskFormEdit',
  enableReinitialize: true,

  mapPropsToValues: (props) => {
    const { acceptedQuote, debtorList, property, task } = props;
    const followers = [];

    if (task.followedByOwner) {
      followers.push({ label: 'Owners', value: 'owners' });
    }

    if (task.followedByTenant) {
      followers.push({ label: 'Tenants', value: 'tenants' });
    }

    const isBill = !!(
      task.taskType?.key === 'bill' ||
      task.invoice?.id ||
      (props.isBill && BILLABLE_TYPES.includes(task.taskType?.key))
    );

    return {
      // Default fields
      isEditing: true, // Used to conditionally validate fields
      assigneeId: task.assigneeId || property.assigneeId,
      attachmentIds: task.attachmentIds || [],
      category: task?.taskCategory?.key || '',
      description: task.description || '',
      dueDate: task.dueDate || '',
      followers,
      leaseId: task.leaseId || '',
      priority: task.priority || 'normal',
      propertyId: property.id || '',
      reminderDate: task.reminderDate || '',
      title: task.title || '',
      type: task.taskType?.key || '',

      // type: Bill
      isBill,
      ...(isBill &&
        mapBillFieldsProps(task.invoice, debtorList, acceptedQuote)),

      // type: Maintenance
      isMaintenance: task?.isMaintenance,
      ...(task?.isMaintenance && mapMaintenanceFieldsProps(task)),
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
      invoiceCategory,
      isBill,
      isEditing,
      isMaintenance,
      leaseId,
      payments,
      ...params
    } = values;
    const { task } = props;
    let followers = values.followers;

    if (isBill) {
      const {
        creditorKey,
        debtorKey,
        isBpayBiller,
        amountDollars,
        bpayBillerId,
        bpayBillerCode: invoiceBpayBillerCode,
        bpayReference: invoiceBpayReference,
        gstIncluded,
        isAgencyCoveringFees,
        referenceNumber,
      } = payments[0];

      followers = payments[0].followers;
      const [creditorId, creditorType] = splitKey(creditorKey);
      const [debtorId, debtorType] = creditorId ? splitKey(debtorKey) : [];

      // Rails throws an error if these are saved as empty strings instead of null.
      const bpayBillerCode =
        isBpayBiller && !!invoiceBpayBillerCode
          ? removeSeparators(invoiceBpayBillerCode, ' ')
          : null;

      const formattedBpayReference = removeSeparators(
        invoiceBpayReference,
        ' '
      );

      const bpayReference =
        isBpayBiller && !!formattedBpayReference
          ? formattedBpayReference
          : null;

      // Convert dollars back to cents. Set to 0 if there is no debtor.
      const amountCents =
        creditorId && debtorId ? dollarToCents(amountDollars) : 0;

      const hasInvoice = task.id && task.invoice?.id;

      invoiceAttributes =
        amountCents !== 0
          ? {
              amountCents,
              bpayBillerCode,
              bpayReference,
              creditorId:
                creditorId !== 'PayViaBpay' ? creditorId : bpayBillerId,
              creditorType:
                creditorType === 'BpayBiller'
                  ? bpayBillerId
                    ? creditorType
                    : ''
                  : creditorType,
              debtorId,
              debtorType,
              gstIncluded,
              isAgencyCoveringFees,
              referenceNumber,
              ...(invoiceCategory && { category: invoiceCategory }),
              ...(hasInvoice && {
                id: task.invoice?.id,
                propertyTaskId: task.id,
              }),
            }
          : null;
    }

    props.onSubmit({
      ...params,
      followedByOwner: !!followers.find(({ value }) => value === 'owners'),
      followedByTenant: !!followers.find(({ value }) => value === 'tenants'),
      taskId: task.id,
      ...(invoiceAttributes && { invoiceAttributes }),
    });
  },
};

export const TaskFormEdit = compose(
  withRouterHash,
  withFormik(config),
  withOnComplete
)(FormComponent);
