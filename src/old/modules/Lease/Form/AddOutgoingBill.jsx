import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Button, Col, Row } from 'reactstrap';
import * as Yup from 'yup';

import { FormField } from '../../Form';

const AddOutgoingBillComponent = (props) => {
  const {
    setFieldValue,
    setValues,
    handleAddOutgoingBill,
    setTouched,
    isValid,
    handleShowAddOutgoingBillForm,
    values,
  } = props;

  const clearAddFormInputs = useCallback(() => {
    setValues({
      inputName: '',
      inputAnnualAmount: 0,
      inputTenantSplit: 0,
    });
    setTouched({
      inputName: false,
      inputAnnualAmount: false,
      inputTenantSplit: false,
    });
  }, [setValues, setTouched]);

  const onAddItemClick = useCallback(() => {
    const newOutgoingBill = {
      title: values.inputName,
      annualEstimateCents: values.inputAnnualAmount * 100,
      percentageTenantSplit: values.inputTenantSplit * 100, // BE requirement to multiply userEntered% * 100
    };
    handleAddOutgoingBill(newOutgoingBill);
    clearAddFormInputs();
  }, [
    values.inputName,
    values.inputAnnualAmount,
    values.inputTenantSplit,
    handleAddOutgoingBill,
    clearAddFormInputs,
  ]);

  const handleChangeInputFormValue = useCallback(
    (e) => {
      setFieldValue(e.target.name, e.target.value);
    },
    [setFieldValue]
  );

  const handleCancelAddItem = useCallback(() => {
    clearAddFormInputs();
    handleShowAddOutgoingBillForm();
  }, [clearAddFormInputs, handleShowAddOutgoingBillForm]);

  return (
    <div>
      <Row className="mt-2 mb-3 no-gutters">
        <Col md={1} className="mt-2 pl-3 text-center">
          <FontAwesomeIcon
            icon={['fas', 'times-circle']}
            className="ml-3 fa-lg text-primary"
            type="button"
            onClick={handleCancelAddItem}
            style={{ cursor: 'pointer' }}
          />
        </Col>
        <Col key={`input-name`} md={5}>
          <FormField
            className="mr-2"
            data-testid="input-field-title"
            name="inputName"
            value={values.inputName || ''}
            onChange={handleChangeInputFormValue}
            placeholder="Enter Bill Name"
          />
        </Col>
        <Col key={`input-annual-amount`} md={2} className="text-center px-2">
          <FormField
            min="0"
            name="inputAnnualAmount"
            prepend="$"
            step="any"
            type="number"
            value={values.inputAnnualAmount || 0}
            onChange={handleChangeInputFormValue}
            placeholder="Enter Annual Amount"
          />
        </Col>
        <Col key={`input-tenant-split`} md={2} className="text-center px-2">
          <FormField
            className="form-control"
            min="0"
            name="inputTenantSplit"
            step="any"
            type="number"
            value={values.inputTenantSplit || 0}
            onChange={handleChangeInputFormValue}
            placeholder="Enter Tenant Split"
          />
        </Col>
        <Col key={`add-item`} className="mt-1 text-center" md={2}>
          <Button
            color="primary"
            data-testid="add-outgoing-bill-item-btn"
            onClick={onAddItemClick}
            disabled={!isValid}>
            SAVE
          </Button>
        </Col>
      </Row>
    </div>
  );
};

AddOutgoingBillComponent.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object,
  touched: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired,
  isValid: PropTypes.bool,
  handleAddOutgoingBill: PropTypes.func,
  handleShowAddOutgoingBillForm: PropTypes.func,
};

const config = {
  displayName: 'AddOutgoingBill',

  mapPropsToValues: () => ({}),

  validationSchema: Yup.object().shape({
    inputName: Yup.string()
      .required('Bill Name is required')
      .matches(/^(\w|-|\s*)+$/, {
        message:
          'Bill Name may only contain letters, numbers, space, underscores and hyphens',
      }),
    inputAnnualAmount: Yup.number()
      .required(`Amount is required`)
      .min(0, 'Amount must be equal or greater than 0'),
    inputTenantSplit: Yup.number()
      .required(`Amount is required`)
      .min(0, 'Amount must be equal or greater than 0'),
  }),
};

export const AddOutgoingBill = withFormik(config)(AddOutgoingBillComponent);
