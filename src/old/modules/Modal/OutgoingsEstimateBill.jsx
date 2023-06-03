import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';
import * as Yup from 'yup';

import { httpClient, toCents, toDollarAmount, toDollars } from '../../utils';
import { ButtonIcon } from '../Button';
import { FormButtons, FormField, FormLabel } from '../Form';
import { AddOutgoingBill } from '../Lease/Form/AddOutgoingBill';
import { ModalDeleteItem } from '../Modal';
import {
  PropertyLeaseOutgoingsModalHeader,
  PropertyLeaseOutgoingsTotals,
} from '../Property';
import '../Property/styles.scss';

const validationSchemaForOutgoingBill = {
  title: Yup.string().required('Title is required'),
  annualEstimateCents: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be equal or greater than 0'),
  percentageTenantSplit: Yup.number()
    .required('tenant Split is required')
    .min(0, 'Split must be equal or greater than 0')
    .max(100, 'Split must be equal or less than 100'),
};

const config = {
  displayName: 'ModalOutgoingsEstimateBill',
  mapPropsToValues: (props) => {
    const { outgoingsEstimate } = props;
    return {
      outgoingsBills: outgoingsEstimate?.items ? outgoingsEstimate?.items : [],
    };
  },

  validationSchema: Yup.object().shape({
    outgoingsBills: Yup.array().of(
      Yup.object().shape(validationSchemaForOutgoingBill)
    ),
  }),
};

export const ModalOutgoingsEstimateBillFormComponent = ({
  isOpen,
  title,
  subTitle,
  onClose,
  size,
  outgoingsEstimate,
  values,
  setValues,
  touched,
  errors,
  isSubmitting,
  className,
  lease,
  handleSetOutgoings,
}) => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState({});
  const [isShowAddItem, setIsShowAddItem] = useState(false);
  const [outgoingBillEdit, setOutgoingBillEdit] = useState({});

  useEffect(() => {
    setValues({ outgoingsBills: outgoingsEstimate.items });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outgoingsEstimate]);

  const handleShowAddOutgoingBillForm = useCallback(
    (type) => () => {
      type === 'add' ? setIsShowAddItem(true) : setIsShowAddItem(false);
    },
    [setIsShowAddItem]
  );

  const handleShowDeleteConfirmation = useCallback(
    (item) => () => {
      setDeleteItem(item);
      setIsShowDeleteModal(!isShowDeleteModal);
    },
    [isShowDeleteModal]
  );

  const handleAddOutgoingBill = useCallback(
    (newOutgoingBill) => {
      httpClient
        .post(`/leases/${lease.id}/commercial/outgoings_estimate_items`, {
          leaseId: lease.id,
          outgoingsEstimateItem: newOutgoingBill,
        })
        .then((response) => {
          handleSetOutgoings(response.data.outgoingsEstimate);
          setIsShowAddItem(false);
        })
        .catch((error) => {
          console.log('Internal Server error. Please contact Support', error);
        });
    },
    [lease.id, setIsShowAddItem, handleSetOutgoings]
  );

  const deleteOutgoingBill = useCallback(
    (bill) => () => {
      if (bill?.id) {
        httpClient
          .delete(
            `/leases/${lease.id}/commercial/outgoings_estimate_items/${bill.id}`
          )
          .then((response) => {
            handleSetOutgoings(response.data.outgoingsEstimate);
          });
      }
      setIsShowDeleteModal(false);
      setDeleteItem({});
    },
    [lease.id, setIsShowDeleteModal, setDeleteItem, handleSetOutgoings]
  );

  const editOutgoingBill = useCallback(
    (item) => () => {
      if (outgoingBillEdit && outgoingBillEdit?.id !== item.id) {
        // if previous edit was not finished - clear the previous edited data by resetting the values.outgoingsBills.
        // else save the edit values into values.outgoingsBills for the editing item.
        const changedItems = values.outgoingsBills.map((item) =>
          item.id === outgoingBillEdit.id ? outgoingBillEdit : item
        );
        setValues({ outgoingsBills: changedItems });
      }
      setOutgoingBillEdit(item);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [outgoingBillEdit, values.outgoingsBills]
  );

  const cancelEditingOutgoingBill = useCallback(
    (item) => () => {
      if (item) {
        const changedItems = values.outgoingsBills.map((item) =>
          item.id === outgoingBillEdit.id ? outgoingBillEdit : item
        );
        setValues({ outgoingsBills: changedItems });
        setOutgoingBillEdit({});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [outgoingBillEdit, values.outgoingsBills]
  );

  const handleUpdateOutgoingBill = useCallback(
    (item) => () => {
      if (item) {
        httpClient
          .put(
            `/leases/${lease.id}/commercial/outgoings_estimate_items/${item.id}`,
            {
              leaseId: lease.id,
              outgoingsEstimateItem: {
                title: item.title,
                annualEstimateCents: item.annualEstimateCents,
                percentageTenantSplit: item.percentageTenantSplit * 100, // BE requirement to multiply userEntered% * 100
              },
            }
          )
          .then((response) => {
            handleSetOutgoings(response.data.outgoingsEstimate);
            setOutgoingBillEdit({});
          })
          .catch((error) => {
            console.log('Internal Server error. Please contact Support', error);
            cancelEditingOutgoingBill();
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lease.id, handleSetOutgoings]
  );

  const checkErrorOnOutgoingBill = useCallback(
    (index) => {
      // check errors on all the outgoings items.
      const errorObj =
        errors && errors?.outgoingsBills && errors?.outgoingsBills[index];
      return errorObj && Object.keys(errorObj).length > 0;
    },
    [errors]
  );

  const checkError = useCallback(
    (type, index) => {
      const outgoingsBillErrorsObj =
        errors && errors?.outgoingsBills && errors?.outgoingsBills[index];
      switch (type) {
        case 'title':
          return outgoingsBillErrorsObj?.title;
        case 'annualEstimateCents':
          return outgoingsBillErrorsObj?.annualEstimateCents;
        case 'percentageTenantSplit':
          return outgoingsBillErrorsObj?.percentageTenantSplit;
        default:
          return '';
      }
    },
    [errors]
  );

  const onChangeInputField = useCallback(
    (id) => (e) => {
      if (id) {
        const { name, value } = e.target;
        const changedItems = values.outgoingsBills.map((item) =>
          item.id === id
            ? {
                ...item,
                [name]: name === 'annualEstimateCents' ? toCents(value) : value,
              }
            : item
        );
        setValues({ outgoingsBills: changedItems });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.outgoingsBills]
  );

  return (
    <Modal size={size} isOpen={isOpen} centered>
      <ModalHeader cssModule={{ 'modal-title': 'w-100' }} className="pb-0">
        <PropertyLeaseOutgoingsModalHeader
          canEditGst={true}
          isGstIncluded={outgoingsEstimate?.gstIncluded}
          leaseId={lease.id}
          outgoingsEstimateId={lease.currentCommercialOutgoingsEstimate?.id}
        />
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={onClose} className={className}>
          <Row className="align-items-center text-center mb-1 no-gutters">
            <Col md={1} className="outgoings-header-height outgoings-dark-bg" />
            <Col
              md={5}
              className="px-1 outgoings-header-height outgoings-dark-bg text-left">
              {' '}
              <strong>Bill Name</strong>{' '}
            </Col>
            <Col
              md={2}
              className="outgoings-header-height outgoings-light-bg outgoings-border-left">
              <strong>Annual Amount</strong>
            </Col>
            <Col
              md={2}
              className="outgoings-header-height outgoings-light-bg outgoings-border-left">
              <strong>Tenant Split %</strong>
            </Col>
            <Col
              md={2}
              className="outgoings-header-height outgoings-light-bg outgoings-border-left">
              <strong>Tenant Amount</strong>
            </Col>
          </Row>
          <FormGroup className="outgoings-form-height">
            {values &&
              values.outgoingsBills.map(
                (
                  {
                    id,
                    title,
                    annualEstimateCents,
                    tenantAmountCents,
                    percentageTenantSplit,
                  },
                  index
                ) => (
                  <Row
                    key={`outgoingBill-${id}`}
                    className="align-items-center mt-3 mb-3 no-gutters">
                    <Col md={1} className="text-center d-flex">
                      <ButtonIcon
                        color="danger"
                        className="text-danger pl-0"
                        icon={['far', 'trash-alt']}
                        size="lg"
                        onClick={handleShowDeleteConfirmation({
                          title,
                          annualEstimateCents,
                          tenantAmountCents,
                          percentageTenantSplit,
                          id,
                        })}
                      />
                      {outgoingBillEdit?.id === id ? (
                        <ButtonIcon
                          className="text-primary"
                          size="lg"
                          icon={['fas', 'times-circle']}
                          type="button"
                          onClick={cancelEditingOutgoingBill({
                            title,
                            annualEstimateCents,
                            tenantAmountCents,
                            percentageTenantSplit,
                            id,
                          })}
                        />
                      ) : (
                        <ButtonIcon
                          className="text-primary"
                          icon={['fas', 'edit']}
                          size="lg"
                          onClick={editOutgoingBill({
                            title,
                            annualEstimateCents,
                            tenantAmountCents,
                            percentageTenantSplit,
                            id,
                          })}
                        />
                      )}
                    </Col>
                    <>
                      <Col md={5}>
                        {outgoingBillEdit?.id === id ? (
                          <FormField
                            className={`form-control mr-2 ${
                              checkError('title', index) ? 'is-invalid' : ''
                            }`}
                            data-testid={`bill-item-title-${id}`}
                            name="title"
                            placeholder="Title"
                            value={title}
                            onChange={onChangeInputField(id)}
                            errors={checkError('title', index)}
                            touched={
                              touched &&
                              touched.outgoingsBills &&
                              touched?.outgoingsBills[index]?.title
                            }
                          />
                        ) : (
                          <FormLabel for="title" id={'tooltipTitleName-' + id}>
                            {title.length > 40
                              ? title.slice(0, 37) + '...'
                              : title}
                          </FormLabel>
                        )}
                      </Col>
                      {outgoingBillEdit?.id !== id && title.length > 37 ? (
                        <UncontrolledTooltip
                          target={'tooltipTitleName-' + id}
                          placement="bottom">
                          {title}
                        </UncontrolledTooltip>
                      ) : null}
                    </>
                    <Col md={2} className="text-right px-2">
                      {outgoingBillEdit?.id === id ? (
                        <FormField
                          min="1"
                          name="annualEstimateCents"
                          prepend="$"
                          step="any"
                          type="number"
                          value={toDollarAmount(annualEstimateCents)}
                          onChange={onChangeInputField(id)}
                          errors={checkError('annualEstimateCents', index)}
                          touched={
                            touched &&
                            touched.outgoingsBills &&
                            touched?.outgoingsBills[index]?.annualEstimateCents
                          }
                        />
                      ) : (
                        toDollars(annualEstimateCents)
                      )}
                    </Col>
                    <Col
                      md={outgoingBillEdit?.id === id ? 1 : 2}
                      className="text-center px-2">
                      {outgoingBillEdit?.id === id ? (
                        <FormField
                          className={`form-control ${
                            checkError('percentageTenantSplit', index)
                              ? 'is-invalid'
                              : ''
                          }`}
                          min="0"
                          name="percentageTenantSplit"
                          step="any"
                          type="number"
                          value={percentageTenantSplit}
                          onChange={onChangeInputField(id)}
                          errors={checkError('percentageTenantSplit', index)}
                          touched={
                            touched &&
                            touched.outgoingsBills &&
                            touched?.outgoingsBills[index]
                              ?.percentageTenantSplit
                          }
                        />
                      ) : (
                        percentageTenantSplit
                      )}
                    </Col>
                    {outgoingBillEdit?.id === id && (
                      <Col md={1} className="text-center">
                        <Button
                          outline
                          color={
                            checkErrorOnOutgoingBill(index)
                              ? '#dee2e6'
                              : 'success'
                          }
                          disabled={checkErrorOnOutgoingBill(index)}
                          onClick={handleUpdateOutgoingBill({
                            title,
                            annualEstimateCents,
                            tenantAmountCents,
                            percentageTenantSplit,
                            id,
                          })}>
                          Save
                        </Button>
                      </Col>
                    )}
                    <Col md={2} className="text-right px-2">
                      {toDollars(tenantAmountCents)}
                    </Col>
                  </Row>
                )
              )}
          </FormGroup>
          {isShowAddItem && (
            <AddOutgoingBill
              handleAddOutgoingBill={handleAddOutgoingBill}
              handleShowAddOutgoingBillForm={handleShowAddOutgoingBillForm(
                'cancel'
              )}
            />
          )}
          <div className="mb-3 d-flex">
            <Col md={5} className="px-1">
              <ButtonIcon
                buttonColor="primary"
                style={{ border: '1px solid' }}
                icon={['fas', 'plus-circle']}
                size="lg"
                className={isShowAddItem ? 'text-muted' : 'white'}
                outline
                disabled={isShowAddItem}
                onClick={handleShowAddOutgoingBillForm('add')}>
                <span className="ml-2 font-weight-bold">Add Bill</span>
              </ButtonIcon>
            </Col>
          </div>
          <PropertyLeaseOutgoingsTotals
            totalAnnualEstimateCents={
              outgoingsEstimate.totalAnnualEstimateCents
            }
            totalMonthlyTenantAmountCents={
              outgoingsEstimate.totalMonthlyTenantAmountCents
            }
          />
          <FormButtons
            btnSubmit={{ text: 'Done' }}
            isSubmitting={isSubmitting}
            isValid={
              Object.keys(errors).length === 0 &&
              !(outgoingBillEdit && outgoingBillEdit?.id)
            }
            onSubmit={onClose}
          />
          {/* Modal for delete confirmation */}
          <ModalDeleteItem
            isOpen={isShowDeleteModal}
            title={'Are you sure?'}
            bodyText={'This bill will be removed'}
            onSubmit={deleteOutgoingBill(deleteItem)}
            onCancel={handleShowDeleteConfirmation({})}
          />
        </Form>
      </ModalBody>
    </Modal>
  );
};

ModalOutgoingsEstimateBillFormComponent.defaultProps = {
  size: 'xl',
};

ModalOutgoingsEstimateBillFormComponent.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  bodyText: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  size: PropTypes.string,
  outgoingsEstimate: PropTypes.object.isRequired,
  lease: PropTypes.object.isRequired,
  handleSetOutgoings: PropTypes.func.isRequired,
  values: PropTypes.object,
  setValues: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  isValid: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
};

export const ModalOutgoingsEstimateBill = withFormik(config)(
  ModalOutgoingsEstimateBillFormComponent
);
