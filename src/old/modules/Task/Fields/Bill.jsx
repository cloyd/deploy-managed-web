import { FieldArray } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Col, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { DEFAULT_FOLLOWERS } from '../../../redux/task';
import { dollarToCents, joinKey, toDollars } from '../../../utils';
import { DividerDouble } from '../../Divider';
import { FormField, FormLabel, FormOptionsList } from '../../Form';
import { Payments } from './Payments';

export const mapBillFieldsProps = (
  invoice = {},
  debtorList = [],
  acceptedQuote
) => {
  const debtorOwner = debtorList.find((debtor) => debtor.type === 'Owner');

  return {
    payments: [
      {
        amountDollars: toDollars(
          (invoice?.isIntentionTriggered && invoice?.amountCents) ||
            acceptedQuote?.bidCents ||
            acceptedQuote?.limitCents ||
            invoice?.amountCents ||
            100
        ),
        bpayBillerCode: invoice?.bpayBillerCode || '',
        bpayReference: invoice?.bpayReference || '',
        creditorKey: invoice?.creditorId
          ? joinKey(invoice?.creditorId, invoice?.creditorType)
          : acceptedQuote?.tradie?.id
          ? joinKey(acceptedQuote?.tradie?.id, 'ExternalCreditor')
          : '',
        debtorKey: invoice?.debtorId
          ? joinKey(invoice?.debtorId, invoice?.debtorType)
          : debtorOwner?.id
          ? joinKey(debtorOwner.id, 'Owner')
          : null,
        gstIncluded:
          typeof invoice?.gstIncluded !== 'undefined'
            ? invoice?.gstIncluded
            : acceptedQuote?.tradie?.id
            ? acceptedQuote?.tradie?.gstIncluded
            : false,
        isBpayBiller: !!invoice?.bpayBillerCode,
        isAgencyCoveringFees: invoice?.isAgencyCoveringFees || false,
        referenceNumber: invoice?.referenceNumber || '',
        followers: DEFAULT_FOLLOWERS,
      },
    ],
    invoiceCategory: invoice?.category
      ? invoice?.category
      : acceptedQuote?.id
      ? 'maintenance'
      : '',
  };
};

export const validationSchemaForBillFields = {
  invoiceCategory: Yup.string().when('isBill', {
    is: true,
    then: Yup.string().required(`Select a tax category`),
  }),
  isBill: Yup.bool(),

  payments: Yup.array().when('isBill', {
    is: true,
    then: Yup.array().of(
      Yup.object().shape({
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
        creditorKey: Yup.string().required(`Select who's paying`),
        debtorKey: Yup.string().required(`Select who to pay`),
        isBpayBiller: Yup.bool(),
        referenceNumber: Yup.string().matches(/^([A-Za-z0-9\s])*$/, {
          message: 'Payment Reference may only contain letters and numbers',
        }),
      })
    ),
  }),
};

export const TaskFieldsBill = (props) => {
  const {
    creditorList,
    creditorType,
    debtorList,
    defaultFollowers,
    fetchBpayBillers,
    hasAllowedBpayBillerAsCreditor,
    hasBpayOptions,
    invoice,
    invoiceCategories,
    isEditPage,
    isMarketplaceEnabled,
    onChange,
    onChangeFollowers,
    onUpdateCreditor,
    pastTenants,
    property,
    setFieldValue,
    values,
    upcomingTenants,
  } = props;

  /* eslint-enable react-hooks/exhaustive-deps */

  const onChangeInvoiceCategory = useCallback(
    (e) => {
      if (
        e.currentTarget.value === 'advertising_for_tenants' &&
        values.payments.every(
          (payment) => dollarToCents(payment.amountDollars) === 100
        )
      ) {
        values.payments.forEach((_, index) =>
          setFieldValue(
            `values.payments[${index}].amountDollars`,
            toDollars(property.advertisingFeeCents)
          )
        );
      }
      onChange(e);
    },
    [onChange, property.advertisingFeeCents, setFieldValue, values.payments]
  );

  return (
    <div id="add" className="pt-4 my-4">
      <DividerDouble />
      {values.isMaintenance && (
        <p className="ml-1 font-weight-bold">
          Add a bill to this maintenance task
        </p>
      )}
      <Row>
        <Col md={12} lg={12}>
          <FormGroup>
            <FormLabel for="invoiceCategory" isRequired>
              Tax Category
            </FormLabel>
            <FormField
              name="invoiceCategory"
              type="select"
              onChange={onChangeInvoiceCategory}
              disabled={invoiceCategories.length === 0}>
              <FormOptionsList
                hasBlank={true}
                name="invoiceCategory"
                options={invoiceCategories}
              />
            </FormField>
          </FormGroup>
        </Col>
      </Row>
      <FieldArray name="payments">
        {Payments({
          isMarketplaceEnabled,
          creditorList,
          debtorList,
          defaultFollowers,
          onChange,
          setFieldValue,
          values,
          invoice,
          pastTenants,
          upcomingTenants,
          onChangeFollowers,
          onUpdateCreditor,
          creditorType,
          hasBpayOptions,
          property,
          hasAllowedBpayBillerAsCreditor,
          fetchBpayBillers,
          isEditPage,
        })}
      </FieldArray>
      <DividerDouble />
    </div>
  );
};

TaskFieldsBill.propTypes = {
  creditorList: PropTypes.array,
  creditorType: PropTypes.array,
  debtorList: PropTypes.array,
  defaultFollowers: PropTypes.array,
  fetchBpayBillers: PropTypes.func.isRequired,
  hasAllowedBpayBillerAsCreditor: PropTypes.bool,
  hasBpayOptions: PropTypes.bool,
  invoice: PropTypes.object,
  invoiceCategories: PropTypes.array,
  isEditPage: PropTypes.bool,
  isMarketplaceEnabled: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeFollowers: PropTypes.func,
  onUpdateCreditor: PropTypes.func.isRequired,
  pastTenants: PropTypes.array,
  property: PropTypes.object,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object,
  upcomingTenants: PropTypes.array,
};

TaskFieldsBill.defaultProps = {
  creditorList: [],
  creditorType: '',
  debtorList: [],
  invoiceCategories: [],
  pastTenants: [],
  property: {},
  values: {},
  upcomingTenants: [],
};
