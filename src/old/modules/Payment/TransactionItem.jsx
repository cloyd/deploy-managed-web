import capitalize from 'lodash/fp/capitalize';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { Badge, Col, Collapse, Row } from 'reactstrap';

import {
  PaymentInfo,
  PaymentNumerator,
  PaymentStatus,
  PaymentTransactionButton,
} from '.';
import { useIsOpen } from '../../hooks';
import { ModalDeleteItem } from '../../modules/Modal';
import { ButtonAdd, ButtonDestroy, ButtonIcon } from '../Button';
import { FormApplyCredit } from '../Form';
import { useRolesContext } from '../Profile';
import { PropertyAddressLink } from '../Property';

export const PaymentTransactionItem = ({
  canApplyCredit,
  hasError,
  intention,
  isDebtor,
  isLast,
  isLoading,
  isShowAddress,
  isSubmitting,
  onSubmit,
  property,
  onClickPayment,
  onClickRemove,
  tenantWalletBalance,
  isCompleted,
}) => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

  const {
    formatted,
    hasBreakdown,
    isAdjustable,
    isComplete,
    isDeposit,
    isExpiredLease,
    isWalletDischarge,
    isFloatDischarge,
    isOverdue,
    isRent,
    isTask,
    debtor,
    title,
    paymentMethod,
    isProcessing,
  } = intention;

  const [isAdjusting, actionsAdjusting] = useIsOpen(onSubmit); // Show apply credit form
  const [isBreakdown, actionsBreakdown] = useIsOpen(); // Show invoice breakdown

  const { isPrincipal, isManager, isOwner } = useRolesContext();

  const showBreakdown = useMemo(
    () => hasBreakdown && !isWalletDischarge,
    [hasBreakdown, isWalletDischarge]
  );

  const canAdjustItem = useMemo(
    () => canApplyCredit && onSubmit && isAdjustable,
    [canApplyCredit, isAdjustable, onSubmit]
  );

  const data = useMemo(
    () => (isDebtor ? formatted.debtor : formatted.creditor),
    [formatted.creditor, formatted.debtor, isDebtor]
  );

  const canDestroyIntention = useMemo(
    () =>
      isManager &&
      intention.canBeDestroyed &&
      (isTask || data?.removableIntention?.indexOf('credit') >= 0),
    [data.removableIntention, intention.canBeDestroyed, isManager, isTask]
  );

  const destroyButtonTitle = useMemo(
    () =>
      data.removableIntention
        ? `${data.removableIntention.substring(0, 15)}...`
        : '',
    [data.removableIntention]
  );

  const deleteTransaction = useCallback(() => {
    if (onClickRemove) {
      onClickRemove(intention.id, intention.taskId);
      actionsAdjusting.handleClose();
    }
    setIsShowDeleteModal(false);
  }, [actionsAdjusting, intention.id, intention.taskId, onClickRemove]);

  const handleShowDeleteModal = useCallback(() => {
    setIsShowDeleteModal(!isShowDeleteModal);
  }, [isShowDeleteModal]);

  return (
    <>
      {!isAdjusting && (
        <>
          <Row>
            <Col xs={8} lg={9}>
              <Row>
                <Col
                  onClick={actionsBreakdown.handleToggle}
                  lg={isShowAddress ? 6 : 9}
                  className="d-flex align-items-center pointer">
                  <ButtonIcon
                    className="d-flex mt-1 mr-2 position-absolute p-0 align-self-start"
                    icon={[
                      'far',
                      isBreakdown ? 'chevron-down' : 'chevron-right',
                    ]}
                    color="dark"
                    size="xs"
                  />
                  <PaymentInfo className="pl-3" intention={intention} />
                </Col>
                {isShowAddress && (
                  <Col
                    lg={3}
                    className="d-flex align-items-center pt-2 pt-lg-0">
                    <PropertyAddressLink
                      className="pl-3 pl-lg-0"
                      hasLink={isManager || isOwner}
                      isExpiredLease={isExpiredLease}
                      property={property}
                    />
                  </Col>
                )}
                <Col
                  lg={3}
                  className="d-flex pt-md-2 pt-lg-0 ml-md-3 ml-lg-0 align-items-center">
                  {!isComplete && isOverdue && (
                    <Badge color="danger" className="p-1 mr-1 normal-line-wrap">
                      Overdue
                    </Badge>
                  )}
                  <PaymentStatus intention={intention} />
                </Col>
              </Row>
            </Col>
            <Col
              xs={4}
              lg={3}
              className="d-flex align-items-center justify-content-between px-0">
              <Row className="text-right w-100">
                <Col lg={6} className="px-0">
                  <p className="w-100 mb-0 h-100 d-flex justify-content-end align-items-center">
                    <PaymentNumerator numerator={isDebtor ? '-' : '+'} />
                    <strong>
                      {(isTask || isRent) &&
                        (isDebtor || isPrincipal || isManager
                          ? formatted?.debtor?.total
                          : data.amount)}
                      {(isDeposit || isWalletDischarge) && data.amount}
                    </strong>
                  </p>
                </Col>
                <Col lg={6} className="px-0">
                  <PaymentTransactionButton
                    className="text-right"
                    intention={intention}
                    isLast={isLast}
                    property={property}
                    onClick={onClickPayment}
                    tenantWalletBalance={tenantWalletBalance}
                    amount={formatted?.debtor?.totalAmountCents}
                    paymentMethod={paymentMethod}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          {
            <Collapse isOpen={isBreakdown} className="mt-2">
              {(showBreakdown || isFloatDischarge) &&
                data.lineItems.map((item, i) => (
                  <LineItem
                    key={`line-item-${i}`}
                    title={item.title}
                    type={item.type}
                    numerator={item.numerator}
                    amount={item.amount}
                  />
                ))}
              {!isFloatDischarge && (
                <>
                  {intention?.lease?.primaryTenant && (
                    <LineItem
                      title="Tenant Name"
                      description={`${intention?.lease?.primaryTenant?.firstName} ${intention?.lease?.primaryTenant?.lastName}`}
                    />
                  )}
                  <LineItem
                    title="Lease Status"
                    description={capitalize(intention?.lease?.status)}
                    color={
                      intention?.lease?.status === 'active'
                        ? '#77BB40'
                        : '#FF9300'
                    }
                  />
                </>
              )}
            </Collapse>
          }
        </>
      )}
      <div className="d-flex flex-row">
        {canAdjustItem && !isProcessing && (
          <div className="pt-1">
            {isAdjusting ? (
              <FormApplyCredit
                hasError={hasError}
                intention={intention}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
                onSubmit={actionsAdjusting.handleSubmit}
                onCancel={actionsAdjusting.handleClose}
              />
            ) : (
              <ButtonAdd
                className="btn-sm pl-3 text-nowrap"
                onClick={actionsAdjusting.handleOpen}>
                Apply credit
              </ButtonAdd>
            )}
          </div>
        )}
        {!isAdjusting && !isProcessing && canDestroyIntention && (
          <ButtonDestroy
            className="btn-sm pl-3 pt-1 text-danger"
            color="danger"
            onClick={handleShowDeleteModal}>
            Remove {destroyButtonTitle}
          </ButtonDestroy>
        )}
      </div>
      <hr className={isLast ? 'd-none ' : null} />
      <ModalDeleteItem
        size="md"
        isOpen={isShowDeleteModal}
        title="Are you sure?"
        bodyText={`"${title}" will be removed${
          debtor === 'tenant' || debtor === 'agency'
            ? '.'
            : ' and may release funds being held in the property wallet to the owners bank account.'
        }`}
        onSubmit={deleteTransaction}
        onCancel={handleShowDeleteModal}
      />
    </>
  );
};

PaymentTransactionItem.propTypes = {
  canApplyCredit: PropTypes.bool,
  hasError: PropTypes.bool,
  intention: PropTypes.object.isRequired,
  isDebtor: PropTypes.bool,
  isLast: PropTypes.bool,
  isLoading: PropTypes.bool,
  isShowAddress: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  property: PropTypes.object.isRequired,
  onClickPayment: PropTypes.func,
  onClickRemove: PropTypes.func,
  onSubmit: PropTypes.func,
  tenantWalletBalance: PropTypes.number,
  isCompleted: PropTypes.bool,
};

PaymentTransactionItem.defaultProps = {
  hasError: false,
  canApplyCredit: false,
  isLast: false,
  isShowAddress: true,
  isSubmitting: false,
  isCompleted: false,
};

const LineItem = ({ title, type, numerator, amount, description, color }) => {
  const isDivider = type === 'divider';

  return (
    <div>
      {isDivider ? (
        <hr className="my-2" />
      ) : (
        <Row>
          <Col xs={8} lg={9}>
            <span className="small text-muted pl-3">{title}</span>
          </Col>
          <Col
            xs={4}
            lg={3}
            className="small text-muted text-right text-nowrap">
            <Row>
              <Col lg={7}>
                <span style={{ color }}>
                  {numerator && <PaymentNumerator numerator={numerator} />}{' '}
                  {amount || description}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
};

LineItem.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  numerator: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  description: PropTypes.string,
  color: PropTypes.string,
};
