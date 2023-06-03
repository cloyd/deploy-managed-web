import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Button, Col, Row } from 'reactstrap';
import * as Yup from 'yup';

import { FormField } from '../../Form';

const AddLeaseItemComponent = (props) => {
  const {
    setFieldValue,
    setValues,
    handleAddLeaseItem,
    setTouched,
    isValid,
    handleShowAddLeaseForm,
    values,
  } = props;

  const clearAddFormInputs = useCallback(() => {
    setValues({
      inputTitle: '',
      inputAmount: 0,
      inputRefNumber: '',
    });
    setTouched({
      inputTitle: false,
      inputRefNumber: false,
      inputAmount: false,
    });
  }, [setValues, setTouched]);

  const onAddItemClick = useCallback(() => {
    const newLeaseItem = {
      title: values.inputTitle,
      amountCents: values.inputAmount * 100,
      referenceNumber: values.inputRefNumber,
    };
    handleAddLeaseItem(newLeaseItem);
    clearAddFormInputs();
  }, [
    values.inputTitle,
    values.inputRefNumber,
    values.inputAmount,
    handleAddLeaseItem,
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
    handleShowAddLeaseForm();
  }, [clearAddFormInputs, handleShowAddLeaseForm]);

  return (
    <div>
      <Row className="mt-2 mb-3 mr-3 no-gutters">
        <Col md={2} className="mt-2 pl-5 text-center">
          <FontAwesomeIcon
            icon={['fas', 'times-circle']}
            className="ml-3 fa-lg text-primary"
            type="button"
            onClick={handleCancelAddItem}
          />
        </Col>
        <Col key={`input-title`} md={3}>
          <FormField
            className="mr-2"
            data-testid="input-field-title"
            name="inputTitle"
            value={values.inputTitle || ''}
            onChange={handleChangeInputFormValue}
            placeholder="Enter Title"
          />
        </Col>
        <Col key={`input-amount`} md={3} className="text-center px-2">
          <FormField
            min="0"
            name="inputAmount"
            prepend="$"
            step="any"
            type="number"
            value={values.inputAmount || 0}
            onChange={handleChangeInputFormValue}
            placeholder="Enter Amount"
          />
        </Col>
        <Col key={`input-referenceNumber`} md={3} className="text-center px-2">
          <FormField
            data-testid="input-field-reference-number"
            name="inputRefNumber"
            value={values.inputRefNumber || ''}
            onChange={handleChangeInputFormValue}
            placeholder="Payment Reference"
          />
        </Col>
        <Col key={`add-item`} className="mt-1 text-center" md={1}>
          <Button
            color="primary"
            data-testid="add-lease-item-btn"
            onClick={onAddItemClick}
            disabled={!isValid}>
            SAVE
          </Button>
        </Col>
      </Row>
    </div>
  );
};

AddLeaseItemComponent.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object,
  touched: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired,
  isValid: PropTypes.bool,
  handleAddLeaseItem: PropTypes.func,
  handleShowAddLeaseForm: PropTypes.func,
};

const config = {
  displayName: 'AddLeaseItem',

  mapPropsToValues: () => ({}),

  validationSchema: () => {
    const validationSchemaForLeaseItem = {
      inputTitle: Yup.string()
        .required('Title is required')
        .matches(/^(\w|-|\s*)+$/, {
          message:
            'Title may only contain letters, numbers, space, underscores and hyphens',
        }),
      inputAmount: Yup.number()
        .required(`Amount is required`)
        .min(0, 'Amount must be equal or greater than 0'),
      inputRefNumber: Yup.string().matches(/^([A-Za-z0-9\s])*$/, {
        message: 'Payment Reference may only contain letters and numbers',
      }),
    };
    return Yup.object().shape(validationSchemaForLeaseItem);
  },
};

export const AddLeaseItem = withFormik(config)(AddLeaseItemComponent);
