import { FieldArray, withFormik } from 'formik';
import camelCase from 'lodash/fp/camelCase';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import {
  FormButtons,
  FormField,
  FormFieldDate,
  FormLabel,
  FormOptionsList,
  FormTypeahead,
} from '.';
import { DEFAULT_FOLLOWERS } from '../../redux/task/constants';
import {
  dollarToCents,
  isInPast,
  joinKey,
  removeSeparators,
  splitKey,
  toDollars,
} from '../../utils';
import { BillieTaskSimilar } from '../Billie';
import { DividerDouble } from '../Divider';
import { withRouterHash } from '../Route/withRouterHash';
import { Payments } from './FieldsForPayment';
import { withOnComplete } from './withOnComplete';

const FormComponent = (props) => {
  const {
    attachment,
    creditorList,
    debtorList,
    handleChange,
    handleSubmit,
    hasAllowedBpayBillerAsCreditor,
    hasError,
    isLoading,
    isMarketplaceEnabled,
    isSubmitting,
    isValid,
    fetchBpayBillers,
    onCancel,
    onChangeInvoiceCategory,
    onChangeProperty,
    onClickTemplate,
    onSearchProperty,
    property,
    propertySearchResults,
    resetForm,
    setFieldValue,
    setHasPointerEvent,
    setSubmitting,
    task,
    taskMeta,
    tasksCompleted,
    tasksDrafted,
    values,
    userAgency,
    defaultBPayOutProvider,
  } = props;

  const [isDisabled, setIsDisabled] = useState(true);

  const [taskTemplateId, setTaskTemplateId] = useState(null);
  const [formMeta, setFormMeta] = useState({
    defaultFollowers: [],
    invoiceCategories: [],
    statuses: [],
  });

  const handleChangeInvoiceCategory = useCallback(
    (e) => {
      const { value } = e.currentTarget;
      if (
        value === 'advertising_for_tenants' &&
        values.payments.every(
          (payment) => dollarToCents(payment.amountDollars) === 100
        ) &&
        property.advertisingFeeCents
      ) {
        values.payments.forEach((_, index) =>
          setFieldValue(
            `values.payments[${index}].amountDollars`,
            toDollars(property.advertisingFeeCents)
          )
        );
      }
      onChangeInvoiceCategory(value);

      handleChange(e);
    },
    [
      values.payments,
      property.advertisingFeeCents,
      onChangeInvoiceCategory,
      handleChange,
      setFieldValue,
    ]
  );

  const handleClickTemplate = useCallback(
    (template, isUpdate) => () => {
      setTaskTemplateId(template.id);
      onClickTemplate(template, { isUpdate });
    },
    [onClickTemplate]
  );

  const handleMouseDown = useCallback(
    // Stops Preview embed from capturing pointer events
    (e) => setHasPointerEvent(false),
    [setHasPointerEvent]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Set task meta
    if (taskMeta) {
      const meta = taskMeta[camelCase(task.type)] || {};
      const statuses = meta.statuses || [];
      const defaultStatus = statuses[0];

      setFormMeta({
        defaultFollowers: DEFAULT_FOLLOWERS,
        invoiceCategories:
          (taskMeta['invoice'] && taskMeta['invoice'].categories) || [],
        statuses,
      });

      setFieldValue('status', defaultStatus);
    }
  }, [taskMeta]);

  useEffect(() => {
    // Set the default debtor
    if (!isDisabled && debtorList.length) {
      const onwer = debtorList.find(({ type }) => type === 'Owner');

      if (onwer && !values.payments[0].debtorKey) {
        setFieldValue('payments[0].debtorKey', joinKey(onwer.id, onwer.type));
      }
    }
  }, [values.debtorKey, debtorList]);

  useEffect(() => {
    // Reset default followers from taskMeta
    // - When a property has been selected
    // - When an attachment has been selected
    if (formMeta.defaultFollowers) {
      resetForm();
      setFieldValue('payments[0].followers', formMeta.defaultFollowers);
    }
  }, [property.id, values.attachmentId]);

  useEffect(() => {
    // This is to make Formik validation behave when prefilling a form
    task.title && setFieldValue('title', task.title);
  }, [task.title]);

  useEffect(() => {
    // Toggle form disable
    setIsDisabled(!property.id || !values.invoiceCategory);
  }, [property.id, values.invoiceCategory]);

  useEffect(() => {
    // Form submission
    if (isSubmitting && !isLoading) {
      hasError ? setSubmitting(false) : resetForm();
    }
  }, [isSubmitting, isLoading]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <FormGroup>
            <FormLabel for="Property" isRequired={true} />
            <FormTypeahead
              isLoading={false} // Force synchronous typeahead
              minLength={1}
              options={propertySearchResults}
              onChange={onChangeProperty}
              onMouseDown={handleMouseDown}
              onSearch={onSearchProperty}
              promptText="Search for a property..."
              property={property}
              attachment={attachment}
            />
          </FormGroup>
          <fieldset className={!property.id ? 'opacity-50' : null}>
            <FormGroup>
              <FormLabel for="assigneeId" isRequired>
                Assign task to
              </FormLabel>
              <FormField
                name="assigneeId"
                type="select"
                disabled={!property.id}>
                <FormOptionsList
                  hasBlank={true}
                  options={property.managers ? property.managers : []}
                  name="assigneeId"
                />
              </FormField>
            </FormGroup>
            <FormGroup>
              <FormLabel for="invoiceCategory" isRequired>
                Tax Category
              </FormLabel>
              <FormField
                name="invoiceCategory"
                type="select"
                onChange={handleChangeInvoiceCategory}
                disabled={!property.id}>
                <FormOptionsList
                  hasBlank={true}
                  options={formMeta.invoiceCategories}
                  name="invoiceCategories"
                />
              </FormField>
            </FormGroup>
          </fieldset>
          {tasksCompleted.length > 0 && (
            <FormGroup>
              <p className="mb-0">
                Would you like to auto fill from a previous task?
              </p>
              {tasksCompleted.map((task) => (
                <BillieTaskSimilar
                  isActive={task.id === taskTemplateId}
                  key={`task-${task.id}`}
                  onClick={handleClickTemplate(task, false)}
                  task={task}
                />
              ))}
            </FormGroup>
          )}
          {tasksDrafted.length > 0 && (
            <FormGroup>
              <p className="mb-0">
                Would you like to complete a task you’ve created?
              </p>
              {tasksDrafted.map((task) => (
                <BillieTaskSimilar
                  isActive={task.id === taskTemplateId}
                  key={`task-${task.id}`}
                  onClick={handleClickTemplate(task, true)}
                  task={task}
                />
              ))}
            </FormGroup>
          )}
          <DividerDouble />
          <fieldset className={isDisabled ? 'opacity-50' : null}>
            <FormGroup>
              <FormLabel for="title" isRequired>
                Title
              </FormLabel>
              <FormField
                name="title"
                disabled={isDisabled}
                onMouseDown={handleMouseDown}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel for="description" isRequired>
                Description
              </FormLabel>
              <FormField
                name="description"
                rows={6}
                type="textarea"
                disabled={isDisabled}
                onMouseDown={handleMouseDown}
              />
            </FormGroup>
            <Row>
              <Col xs={12} md={6}>
                <FormGroup>
                  <FormLabel for="dueDate">Due date</FormLabel>
                  <FormFieldDate name="dueDate" disabled={isDisabled} />
                </FormGroup>
              </Col>
              <Col xs={12} md={6}>
                <FormGroup>
                  <FormLabel for="reminderDate">Action date</FormLabel>
                  <FormFieldDate name="reminderDate" popperPlacement="auto" />
                </FormGroup>
              </Col>
            </Row>
            <FieldArray name="payments">
              {Payments({
                isMarketplaceEnabled,
                creditorList,
                debtorList,
                fetchBpayBillers,
                handleChange,
                hasAllowedBpayBillerAsCreditor,
                property,
                setFieldValue,
                setHasPointerEvent,
                values,
                isDisabled,
                userAgency,
                invoice: task.invoice,
                defaultBPayOutProvider,
              })}
            </FieldArray>
            <FormButtons
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              isValid={isValid}
            />
          </fieldset>
        </Col>
      </Row>
    </Form>
  );
};

FormComponent.propTypes = {
  attachment: PropTypes.object.isRequired,
  creditorList: PropTypes.array,
  debtorList: PropTypes.array,
  defaultBPayOutProvider: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasAllowedBpayBillerAsCreditor: PropTypes.bool,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  userAgency: PropTypes.object,
  invoiceCategories: PropTypes.array,
  fetchBpayBillers: PropTypes.func,
  onCancel: PropTypes.func,
  onChangeInvoiceCategory: PropTypes.func,
  onChangeProperty: PropTypes.func.isRequired,
  onClickTemplate: PropTypes.func.isRequired,
  onSearchProperty: PropTypes.func.isRequired,
  property: PropTypes.object,
  propertySearchResults: PropTypes.array,
  resetForm: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setHasPointerEvent: PropTypes.func,
  setSubmitting: PropTypes.func.isRequired,
  statuses: PropTypes.array,
  task: PropTypes.object,
  taskMeta: PropTypes.object.isRequired,
  tasksCompleted: PropTypes.array,
  tasksDrafted: PropTypes.array,
  tenant: PropTypes.object,
  values: PropTypes.object.isRequired,
};

FormComponent.defaultProps = {
  creditorList: [],
  debtorList: [],
  hasError: false,
  isLoading: true,
  isSubmitting: false,
  isValid: false,
  userAgency: {},
  propertySearchResults: [],
};

const toNull = (value) => (value === '' ? null : value);

const formatValues = (values, props) => {
  // Extract params we dont need for bills
  const {
    followers,
    invoiceCategory,
    isBill,
    isBpayBiller,
    payments,
    ...params
  } = values;

  // If we're not attached, add the attachment to the
  // Billie attachment ID list
  if (!props.attachment.isAttached) {
    params.billieAttachmentIds = [params.attachmentId];
  }

  let invoiceData = {};
  if (!!props.task.id && !!props.task.invoice && !!props.task.invoice.id) {
    invoiceData = {
      id: props.task.invoice.id,
      propertyTaskId: props.task.id,
    };
  }

  if (invoiceCategory) {
    invoiceData['category'] = invoiceCategory;
  }

  const invoiceAttributes =
    isBill || props.task.taskType.key === 'maintenance'
      ? payments.map(
          ({
            creditorKey,
            debtorKey,
            isBpayBiller,
            bpayBillerCode: paymentbBpayBillerCode,
            bpayBillerId,
            bpayReference: paymentBpayReference,
            referenceNumber: paymentReferenceNumber,
            amountDollars,
            gstIncluded,
            isAgencyCoveringFees,
            isScheduledForAutoPayment,
            followers,
          }) => {
            const [creditorId, creditorType] = splitKey(creditorKey);
            const [debtorId, debtorType] = creditorId
              ? splitKey(debtorKey)
              : [];

            // Rails throws an error if these are saved as empty strings instead of null.
            const bpayBillerCode = isBpayBiller
              ? toNull(removeSeparators(paymentbBpayBillerCode, ' '))
              : null;
            const bpayReference = isBpayBiller
              ? toNull(removeSeparators(paymentBpayReference, ' '))
              : null;

            const referenceNumber = !isBpayBiller
              ? toNull(removeSeparators(paymentReferenceNumber, ' '))
              : null;

            // Convert dollars back to cents. Set to 0 if there is no debtor.
            const amountCents =
              creditorId && debtorId ? dollarToCents(amountDollars) : 0;

            return {
              ...invoiceData,
              amountCents,
              bpayBillerCode,
              bpayReference,
              creditorId:
                creditorId !== 'PayViaBpay' ? creditorId : bpayBillerId,
              creditorType,
              debtorId,
              debtorType,
              followers,
              gstIncluded,
              isAgencyCoveringFees,
              isScheduledForAutoPayment,
              referenceNumber,
            };
          }
        )
      : null;

  return {
    ...params,
    invoiceAttributes,
  };
};

const config = {
  displayName: 'FormBillieTask',
  enableReinitialize: true,

  mapPropsToValues: (props) => {
    const {
      attachment,
      defaultBPayOutProvider,
      hasAllowedBpayBillerAsCreditor,
      property,
      task,
      userAgency,
    } = props;
    const invoice = task.invoice || {};
    // spread DEFAULT_FOLLOWERS to prevent if from being mutated
    const followers = [...DEFAULT_FOLLOWERS];

    const creditorKey =
      // If Agency is set to BPay Out, then set creditor to default BPay Out provider
      invoice.isCreditorBpayOutProvider &&
      userAgency?.isBpayOutViaAssembly &&
      !hasAllowedBpayBillerAsCreditor
        ? joinKey(defaultBPayOutProvider.id, invoice.creditorType)
        : invoice.creditorId
        ? joinKey(invoice.creditorId, invoice.creditorType)
        : '';

    if (task.followedByOwner) {
      followers.push({ label: 'Owners', value: 'owners' });
    }

    if (task.followedByTenant) {
      followers.push({ label: 'Tenants', value: 'tenants' });
    }

    return {
      // Title is handled by setFieldValue in an effect
      assigneeId: property.managerId || '',
      attachmentIds: task.attachmentIds || [],
      attachmentId: attachment.id,
      description: task.description || '',
      type: task.type || '',
      priority: task.priority || 'normal',
      status: task.status || 'draft',

      // type: Bill
      dueDate: task.dueDate || '',
      reminderDate: task.reminderDate || '',
      isBill: true,
      isBpayBiller: !!invoice?.bpayBillerCode,
      invoiceCategory: invoice.category || '',
      payments: [
        {
          debtorKey: invoice.debtorId
            ? joinKey(invoice.debtorId, invoice.debtorType)
            : '',
          amountDollars: toDollars(invoice.amountCents || 100),
          creditorKey: invoice.isToBpayBiller
            ? 'PayViaBpay::BpayBiller'
            : creditorKey,
          gstIncluded: invoice.gstIncluded || false,
          isAgencyCoveringFees: invoice.isAgencyCoveringFees || false,
          bpayBillerCode: invoice.bpayBillerCode || '',
          bpayReference: invoice.bpayReference || '',
          referenceNumber: invoice.referenceNumber || '',
          isScheduledForAutoPayment: props.isScheduledForAutoPayment || false,
          isBpayBiller: invoice.isToBpayBiller,
          followers,
        },
      ],
    };
  },

  validationSchema: Yup.object().shape({
    assigneeId: Yup.string().required('Task assignee is required'),

    invoiceCategory: Yup.string().when('isBill', {
      is: true,
      then: Yup.string().required('Select a tax category'),
    }),

    description: Yup.string().required('Description is required'),

    title: Yup.string().required('Title is required'),

    payments: Yup.array().of(
      Yup.object().shape({
        creditorKey: Yup.string().required(`Select who's paying`),
        debtorKey: Yup.string().required('Select who to pay'),
        amountDollars: Yup.number()
          .min(1, 'Amount must be equal to or greater than $1')
          .required('Amount is required'),
        bpayBillerCode: Yup.string().when('isBpayBiller', {
          is: true,
          then: Yup.string().required('BPay biller code is required'),
        }),
        bpayReference: Yup.string().when('isBpayBiller', {
          is: true,
          then: Yup.string().required('BPay reference is required'),
        }),
        isBpayBiller: Yup.bool(),
        referenceNumber: Yup.string().matches(/^([A-Za-z0-9\s])*$/, {
          message: 'Payment Reference may only contain letters and numbers',
        }),
      })
    ),

    reminderDate: Yup.string().test({
      name: 'reminderDate',
      message: 'Action date must be in the future',
      test: (value) => !isInPast(value),
    }),
  }),

  handleSubmit: (values, { props }) => {
    props.onSubmit({
      ...formatValues(values, props),
      propertyId: props.property.id,
      taskId: props.task.id,
    });
  },
};

export const FormBillieTask = compose(
  withRouterHash,
  withFormik(config),
  withOnComplete
)(FormComponent);
