import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';
import * as Yup from 'yup';

import { httpClient, toCents, toDollarAmount, toDollars } from '../../../utils';
import { ButtonIcon } from '../../Button';
import { FormButtons, FormField, FormLabel } from '../../Form';
import { ModalDeleteItem } from '../../Modal';
import { AddLeaseItem } from './AddLeaseItem';

const validationSchemaForLeaseItem = {
  title: Yup.string().required('Title is required'),
  amountCents: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be equal or greater than 0'),
  referenceNumber: Yup.string().matches(/^([A-Za-z0-9\s])*$/, {
    message: 'Payment Reference may only contain letters and numbers',
  }),
};

const config = {
  displayName: 'LeaseFormTask',
  mapPropsToValues: (props) => {
    const { leaseItems } = props;
    return {
      leaseItems: leaseItems,
    };
  },

  validationSchema: () => {
    return Yup.object().shape({
      leaseItems: Yup.array().of(
        Yup.object().shape(validationSchemaForLeaseItem)
      ),
    });
  },
};

const LeaseFormTaskComponent = (props) => {
  const {
    className,
    isSubmitting,
    onCancel,
    onSubmit,
    values,
    setValues,
    touched,
    errors,
    leaseItems,
    handleActivationTasks,
    propertyId,
    leaseId,
  } = props;

  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [isShowAddItem, setIsShowAddItem] = useState(false);
  const [leaseItemEdit, setLeaseItemEdit] = useState();

  const handleShowDeleteConfirmation = useCallback(
    (item) => () => {
      setDeleteItem(item);
      setIsShowDeleteModal(!isShowDeleteModal);
    },
    [isShowDeleteModal]
  );

  const deleteLeaseItem = useCallback(
    (leaseItem) => () => {
      if (leaseItem.id) {
        httpClient
          .delete(`/properties/${propertyId}/tasks/${leaseItem.id}`)
          .then((response) => {
            const filteredLeaseItems = values.leaseItems.filter(
              (item) => item.id !== leaseItem.id
            );
            setValues({ leaseItems: filteredLeaseItems });
          });
      }
      setIsShowDeleteModal(false);
      setDeleteItem({});
    },
    [
      values.leaseItems,
      propertyId,
      setIsShowDeleteModal,
      setDeleteItem,
      setValues,
    ]
  );

  useEffect(() => {
    if (values.leaseItems) {
      handleActivationTasks(values.leaseItems);
    }
  }, [values, handleActivationTasks]);

  useEffect(() => {
    setValues({ leaseItems: leaseItems });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaseItems]);

  const handleAddLeaseItem = useCallback(
    (newLeaseItem) => {
      httpClient
        .post(`/properties/${propertyId}/tasks/create-lease-activation-task`, {
          leaseId: leaseId,
          leaseItem: newLeaseItem,
        })
        .then((response) => {
          handleActivationTasks(response.data.leaseItems);
          setValues({ leaseItems: response.data.leaseItems });
          setIsShowAddItem(false);
        })
        .catch((error) => {
          console.log('Internal Server error. Please contact Support', error);
        });
    },
    [setValues, handleActivationTasks, leaseId, propertyId, setIsShowAddItem]
  );

  const handleUpdateLeaseItem = useCallback(
    (item) => () => {
      if (item) {
        httpClient
          .patch(
            `/properties/${propertyId}/tasks/${item.id}/update-lease-activation-task`,
            {
              leaseId: leaseId,
              leaseItem: {
                title: item.title,
                amountCents: item.amountCents,
                referenceNumber: item.referenceNumber,
              },
            }
          )
          .then((response) => {
            const changedItems = values.leaseItems.map((item) =>
              item.id === response.data.leaseItem.id
                ? { ...response.data.leaseItem }
                : item
            );
            setValues({ leaseItems: changedItems });
            setLeaseItemEdit({});
          })
          .catch((error) => {
            console.log('Internal Server error. Please contact Support', error);
            cancelEditingLeaseItem();
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propertyId, leaseId, values.leaseItems]
  );

  const editLeaseItem = useCallback(
    (item) => () => {
      if (leaseItemEdit && leaseItemEdit?.id !== item.id) {
        // previous edit was not finished - clear the previous edited data by resetting the values.leaseItems.
        const changedItems = values.leaseItems.map((item) =>
          item.id === leaseItemEdit.id ? leaseItemEdit : item
        );
        setValues({ leaseItems: changedItems });
      }
      setLeaseItemEdit(item);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leaseItemEdit, values.leaseItems]
  );

  const cancelEditingLeaseItem = useCallback(
    (leaseItem) => () => {
      if (leaseItem) {
        const changedItems = values.leaseItems.map((item) =>
          item.id === leaseItem.id ? leaseItemEdit : item
        );
        setValues({ leaseItems: changedItems });
        setLeaseItemEdit({});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leaseItemEdit, values.leaseItems]
  );

  const onChangeAmount = useCallback(
    (id) => (e) => {
      if (id) {
        const changedItems = values.leaseItems.map((item) =>
          item.id === id
            ? { ...item, amountCents: toCents(e.target.value) }
            : item
        );
        setValues({ leaseItems: changedItems });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.leaseItems]
  );

  const onChangeReference = useCallback(
    (id) => (e) => {
      if (id) {
        const changedItems = values.leaseItems.map((item) =>
          item.id === id
            ? {
                ...item,
                referenceNumber: e.target.value,
              }
            : item
        );
        setValues({ leaseItems: changedItems });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.leaseItems]
  );

  const onChangeTitle = useCallback(
    (id) => (e) => {
      if (id) {
        const changedItems = values.leaseItems.map((item) =>
          item.id === id
            ? {
                ...item,
                title: e.target.value,
              }
            : item
        );
        setValues({ leaseItems: changedItems });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.leaseItems]
  );

  const handleShowAddLeaseForm = useCallback(
    (type) => () => {
      type === 'add' ? setIsShowAddItem(true) : setIsShowAddItem(false);
    },
    [setIsShowAddItem]
  );

  const calculateTotalAmount = useMemo(
    () => values.leaseItems.reduce((acc, item) => acc + item.amountCents, 0),
    [values.leaseItems]
  );

  const checkErrorOnLeaseItem = useCallback(
    (index) => {
      const errorObj =
        errors && errors?.leaseItems && errors?.leaseItems[index];
      return errorObj && Object.keys(errorObj).length > 0;
    },
    [errors]
  );

  const checkError = useCallback(
    (type, index) => {
      const leaseItemErrorsObj =
        errors && errors?.leaseItems && errors?.leaseItems[index];
      switch (type) {
        case 'title':
          return leaseItemErrorsObj?.title;
        case 'amountCents':
          return leaseItemErrorsObj?.amountCents;
        case 'referenceNumber':
          return leaseItemErrorsObj?.referenceNumber;
        default:
          return '';
      }
    },
    [errors]
  );

  return (
    <Form onSubmit={onSubmit} className={className}>
      <Row className="align-items-center text-center mb-1 no-gutters">
        <Col
          md={1}
          style={{
            backgroundColor: '#A791D0',
            height: '2.5rem',
            lineHeight: '2.5rem',
          }}
        />
        <Col
          md={1}
          style={{
            backgroundColor: '#A791D0',
            height: '2.5rem',
            lineHeight: '2.5rem',
          }}
        />
        <Col
          md={3}
          style={{
            paddingLeft: '0.2rem',
            backgroundColor: '#A791D0',
            height: '2.5rem',
            lineHeight: '2.5rem',
            textAlign: 'left',
          }}>
          {' '}
          <strong>Bill Title</strong>{' '}
        </Col>
        <Col
          md={3}
          style={{
            backgroundColor: '#d0c2ea',
            height: '2.5rem',
            lineHeight: '2.5rem',
            borderLeft: '1px solid white',
          }}>
          <strong>Amount</strong>
        </Col>
        <Col
          md={3}
          style={{
            backgroundColor: '#d0c2ea',
            height: '2.5rem',
            lineHeight: '2.5rem',
            borderLeft: '1px solid white',
          }}>
          <strong>Payment Reference</strong>
        </Col>
        <Col
          md={1}
          style={{
            backgroundColor: '#d0c2ea',
            height: '2.5rem',
          }}
        />
      </Row>
      <FormGroup style={{ maxHeight: '50vh', overflow: 'scroll' }}>
        {values.leaseItems.map(
          ({ id, title, amountCents, referenceNumber }, index) => (
            <Row
              key={`leaseItem-${id}`}
              className="align-items-center mt-3 mb-3 mr-3 no-gutters">
              <Col md={1} className="text-center">
                <FontAwesomeIcon
                  onClick={handleShowDeleteConfirmation({
                    title,
                    amountCents,
                    referenceNumber,
                    id,
                  })}
                  icon={['far', 'trash-alt']}
                  className="ml-1 fa-lg text-danger"
                  style={{ cursor: 'pointer' }}
                  type="button"
                />
              </Col>
              <Col md={1} className="text-center">
                {leaseItemEdit?.id === id ? (
                  <FontAwesomeIcon
                    onClick={cancelEditingLeaseItem({
                      id,
                      title,
                      amountCents,
                      referenceNumber,
                    })}
                    icon={['fas', 'times-circle']}
                    className="fa-lg text-primary"
                    style={{ cursor: 'pointer' }}
                    type="button"
                  />
                ) : (
                  <FontAwesomeIcon
                    onClick={editLeaseItem({
                      id,
                      title,
                      amountCents,
                      referenceNumber,
                    })}
                    icon={['fas', 'edit']}
                    className="ml-1 fa-lg text-primary"
                    style={{ cursor: 'pointer' }}
                    type="button"
                  />
                )}
              </Col>
              <>
                <Col md={3}>
                  {leaseItemEdit?.id === id ? (
                    <FormField
                      className={`form-control mr-2 ${
                        checkError('title', index) ? 'is-invalid' : ''
                      }`}
                      data-testid={`lease-item-title-${id}`}
                      name="title"
                      placeholder="Title"
                      value={title}
                      onChange={onChangeTitle(id)}
                      errors={checkError('title', index)}
                      touched={
                        touched &&
                        touched.leaseItems &&
                        touched?.leaseItems[index]?.title
                      }
                    />
                  ) : (
                    <FormLabel for="title" id={'tooltipTitleName-' + id}>
                      {title.length > 18 ? title.slice(0, 16) + '...' : title}
                    </FormLabel>
                  )}
                </Col>
                {leaseItemEdit?.id !== id && title.length > 18 ? (
                  <UncontrolledTooltip
                    target={'tooltipTitleName-' + id}
                    placement="bottom">
                    {title}
                  </UncontrolledTooltip>
                ) : null}
              </>
              <Col md={3} className="text-center px-2">
                {leaseItemEdit?.id === id ? (
                  <FormField
                    min="1"
                    name="amountCents"
                    prepend="$"
                    step="any"
                    type="number"
                    value={toDollarAmount(amountCents)}
                    onChange={onChangeAmount(id)}
                    errors={checkError('amountCents', index)}
                    touched={
                      touched &&
                      touched.leaseItems &&
                      touched?.leaseItems[index]?.amountCents
                    }
                  />
                ) : (
                  toDollars(amountCents)
                )}
              </Col>
              <>
                <Col md={3} className="text-center px-2">
                  {leaseItemEdit?.id === id ? (
                    <FormField
                      className={`form-control ${
                        checkError('referenceNumber', index) ? 'is-invalid' : ''
                      }`}
                      data-testid={`field-reference-number-${id}`}
                      name="referenceNumber"
                      placeholder="Payment Reference"
                      value={referenceNumber}
                      onChange={onChangeReference(id)}
                      errors={checkError('referenceNumber', index)}
                      touched={
                        touched &&
                        touched.leaseItems &&
                        touched?.leaseItems[index]?.referenceNumber
                      }
                    />
                  ) : (
                    <FormLabel
                      for="referenceNumber"
                      id={'tooltipReferenceNumber-' + id}>
                      {referenceNumber.length > 18
                        ? referenceNumber.slice(0, 16) + '...'
                        : referenceNumber}
                    </FormLabel>
                  )}
                </Col>
                {leaseItemEdit?.id !== id && referenceNumber.length > 18 ? (
                  <UncontrolledTooltip
                    target={'tooltipReferenceNumber-' + id}
                    placement="bottom">
                    {referenceNumber}
                  </UncontrolledTooltip>
                ) : null}
              </>
              <Col md={1} className="text-center">
                <Button
                  className={`w-100 ${
                    leaseItemEdit?.id !== id || checkErrorOnLeaseItem(index)
                      ? 'text-muted border-400'
                      : 'primary'
                  }`}
                  style={{
                    pointerEvents:
                      leaseItemEdit?.id !== id || checkErrorOnLeaseItem(index)
                        ? 'none'
                        : 'all',
                  }}
                  color={
                    leaseItemEdit?.id !== id || checkErrorOnLeaseItem(index)
                      ? 'text-muted'
                      : 'primary'
                  }
                  outline
                  disabled={
                    leaseItemEdit?.id !== id || checkErrorOnLeaseItem(index)
                  }
                  onClick={handleUpdateLeaseItem({
                    id,
                    title,
                    amountCents,
                    referenceNumber,
                  })}>
                  Save
                </Button>
              </Col>
            </Row>
          )
        )}
      </FormGroup>
      {isShowAddItem && (
        <AddLeaseItem
          handleAddLeaseItem={handleAddLeaseItem}
          handleShowAddLeaseForm={handleShowAddLeaseForm('cancel')}
        />
      )}
      <div className="mb-5 d-flex">
        <Col md={5} className="px-1">
          <ButtonIcon
            buttonColor="primary"
            style={{ border: '1px solid' }}
            icon={['fas', 'plus-circle']}
            size="lg"
            className={isShowAddItem ? 'text-muted' : 'white'}
            outline
            disabled={isShowAddItem}
            onClick={handleShowAddLeaseForm('add')}>
            <span className="ml-2 font-weight-bold">Add Bill</span>
          </ButtonIcon>
        </Col>
        {values.leaseItems.length > 0 && (
          <Col className="ml-2">Total : {toDollars(calculateTotalAmount)}</Col>
        )}
      </div>
      <FormButtons
        btnSubmit={{ text: 'Continue' }}
        btnCancel={{ text: 'Restore Defaults', color: 'danger' }}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isValid={
          Object.keys(errors).length === 0 &&
          !(leaseItemEdit && leaseItemEdit?.id)
        }
        isFormButtonsJustifyBetween={true}
      />
      {/* Modal for delete confirmation */}
      <ModalDeleteItem
        isOpen={isShowDeleteModal}
        title={'Are you sure?'}
        bodyText={'This bill will be removed'}
        onSubmit={deleteLeaseItem(deleteItem)}
        onCancel={handleShowDeleteConfirmation({})}
      />
    </Form>
  );
};

LeaseFormTaskComponent.propTypes = {
  className: PropTypes.string,
  handleChange: PropTypes.func,
  isSubmitting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  property: PropTypes.object,
  setFieldValue: PropTypes.func.isRequired,
  lease: PropTypes.object,
  values: PropTypes.object,
  setValues: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  isValid: PropTypes.bool,
  leaseItems: PropTypes.array.isRequired,
  isShowDeleteModal: PropTypes.bool,
  handleActivationTasks: PropTypes.func,
  propertyId: PropTypes.number,
  leaseId: PropTypes.number,
};

export const LeaseFormTask = withFormik(config)(LeaseFormTaskComponent);
