import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { PulseLoader } from 'react-spinners';
import { Button, CardBody, CardTitle, Col, Row } from 'reactstrap';

import { TenantAccountLoader } from '.';
import { ButtonIcon } from '../Button';
import { CardHeaderLight, CardLight } from '../Card';
import { FormBankAccount, Switch } from '../Form';
import { PaymentCardIcon } from './CardIcon';
import {
  QUERY_KEYS,
  useAddBankAccount,
  useCreateTokenBank,
  useEnableDisbursement,
  useRemoveAccount,
} from './hooks/use-assembly';

export const TenantBankAccounts = ({
  className,
  style,
  isAccountsFetching,
  isAccountsLoading,
  hasDisbursementAccount,
  hasDefaultPayment,
  list,
  hostedFieldsEnv,
  fingerprint,
  onChangeDisbursement,
  onChangePaymentMethod,
  handleHideForm,
  handleShowForm,
  isFormOpen,
}) => {
  const queryClient = useQueryClient();

  const { refetch, isFetching: isFetchingToken } = useCreateTokenBank({
    fingerprint,
  });
  const { mutate, isLoading: isAddingBankAccount } = useAddBankAccount();
  const { mutate: removeAccount, isSuccess: isRemoveAccountSuccess } =
    useRemoveAccount();

  const { mutate: enableDisbursement } = useEnableDisbursement();

  useEffect(() => {
    if (isRemoveAccountSuccess) {
      queryClient.invalidateQueries(QUERY_KEYS.FETCH_ACCOUNTS);
    }
  }, [isRemoveAccountSuccess, queryClient]);

  const hostedFieldsBank = useMemo(
    () =>
      window.assembly.hostedFields({
        environment: hostedFieldsEnv,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFormOpen, hostedFieldsEnv]
  );

  const createCardAccount = useCallback(
    async (token, promisepayUserId) => {
      hostedFieldsBank
        .createCardAccount({
          token,
          user_id: promisepayUserId,
        })
        .then((response) => {
          return response;
        });
    },
    [hostedFieldsBank]
  );

  const createTokenBank = async () => {
    const { data } = await refetch();

    return data;
  };

  const addBankAccount = useCallback(
    ({ promisepayId }) => {
      mutate({
        fingerprint,
        promisepayId,
        callback: () => {
          handleHideForm();

          // enable disbursement
          enableDisbursement({
            fingerprint,
            promisepayId,
            amountCents: 100000,
          });

          if (list.length === 0) {
            // set default payment if no payment has been set
            if (!hasDefaultPayment) {
              onChangePaymentMethod(promisepayId, false);
            }
            // set default disbursement if no dibursement has been set
            if (!hasDisbursementAccount) {
              onChangeDisbursement(promisepayId, true);
            }
          } else {
            queryClient.invalidateQueries(QUERY_KEYS.FETCH_ACCOUNTS);
          }
        },
      });
    },
    [
      fingerprint,
      handleHideForm,
      hasDisbursementAccount,
      hasDefaultPayment,
      list.length,
      mutate,
      onChangeDisbursement,
      onChangePaymentMethod,
      queryClient,
    ]
  );

  return (
    <div
      className={`${className} mt-4`}
      data-testid="payment-settings-disbursement"
      style={style}>
      <h4 className="mb-3" data-testid="section-heading">
        Bank Accounts
      </h4>
      {isAccountsLoading ? (
        <TenantAccountLoader title="Bank Name" type="bank" />
      ) : (
        <>
          {!!list.length &&
            list.map((account, index) => {
              return (
                <CardLight
                  key={`bank-${index}-${account.accountNumber}`}
                  className="mb-3">
                  <CardHeaderLight hasCustomLoader>
                    <header className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-end w-50">
                        <PaymentCardIcon
                          cardType={account.type}
                          className="mr-2"
                        />
                        <CardTitle className="mb-0" tag="h5">
                          {account.bankName}
                        </CardTitle>
                      </div>
                      {account?.isDeleting ? (
                        <div>
                          <PulseLoader color="#dee2e6" size={10} />
                        </div>
                      ) : (
                        !account?.isDisbursement &&
                        !account?.isDefault && (
                          <ButtonIcon
                            className="p-0"
                            data-testid={`bank-${index}-${account.accountNumber}-delete`}
                            icon={['far', 'trash-alt']}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={() =>
                              removeAccount({
                                fingerprint,
                                promisepayId: account?.promisepayId,
                                type: 'bank',
                              })
                            }
                          />
                        )
                      )}
                    </header>
                  </CardHeaderLight>
                  <CardBody>
                    <Row className="mb-2">
                      <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                        <Row className="mb-2">
                          <Col xs={6} sm={4}>
                            <strong>Bank:</strong>
                          </Col>
                          <Col xs={6} sm={8}>
                            {account.bankName}
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={6} sm={4}>
                            <strong>Name:</strong>
                          </Col>
                          <Col xs={6} sm={8}>
                            {account.accountName}
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={6} sm={4}>
                            <strong>Acc #:</strong>
                          </Col>
                          <Col xs={6} sm={8}>
                            {account.accountNumber
                              ? `${account.routingNumber}-${account.accountNumber}`
                              : ''}
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Row className="mb-2">
                          <Col className="d-flex justify-content-between align-items-center">
                            <Switch
                              id={`bank-${index}-${account.accountNumber}-switch`}
                              className="custom-switch-md pl-2"
                              label="Charge my rent and bills to this payment method"
                              value={account?.isDefault}
                              disabled={
                                account?.isDefault ||
                                account?.isDeleting ||
                                isAccountsFetching
                              }
                              // eslint-disable-next-line react/jsx-no-bind
                              handleChange={() =>
                                onChangePaymentMethod(account?.promisepayId)
                              }
                              isShowLabelFirst
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col className="d-flex justify-content-between align-items-center">
                            <Switch
                              id={`reimburse-${index}-${account.accountNumber}-switch`}
                              className="custom-switch-md pl-2"
                              label="Use this account for withdrawals"
                              value={account?.isDisbursement}
                              disabled={
                                account?.isDisbursement ||
                                account?.isDeleting ||
                                isAccountsFetching
                              }
                              // eslint-disable-next-line react/jsx-no-bind
                              handleChange={() =>
                                onChangeDisbursement(account?.promisepayId)
                              }
                              isShowLabelFirst
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </CardLight>
              );
            })}
          {isFormOpen && (
            <FormBankAccount
              onSubmit={addBankAccount}
              onClose={handleHideForm}
              hostedFields={hostedFieldsBank}
              createCardAccount={createCardAccount}
              // eslint-disable-next-line react/jsx-no-bind
              createToken={createTokenBank}
              disabled={isFetchingToken || isAddingBankAccount}
              canSkipConfirmation
            />
          )}
          {!isFormOpen && !isAccountsFetching && !isAccountsLoading && (
            <Button
              color="primary"
              outline
              className="p-3 mb-3 w-100"
              onClick={handleShowForm}
              disabled={isAccountsFetching}>
              + Add Bank Account
            </Button>
          )}
        </>
      )}
      {!isAccountsLoading && isAccountsFetching && (
        <div className="d-flex flex-column align-items-center">
          <PulseLoader color="#dee2e6" />
        </div>
      )}
    </div>
  );
};

TenantBankAccounts.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  isAccountsFetching: PropTypes.bool,
  isAccountsLoading: PropTypes.bool,
  hasDisbursementAccount: PropTypes.bool,
  hasDefaultPayment: PropTypes.bool,
  list: PropTypes.arrayOf(PropTypes.object),
  onChangeDisbursement: PropTypes.func.isRequired,
  onChangePaymentMethod: PropTypes.func.isRequired,
  hostedFieldsEnv: PropTypes.string,
  fingerprint: PropTypes.string,
  // props for opening/closing add form
  handleHideForm: PropTypes.func.isRequired,
  handleShowForm: PropTypes.func.isRequired,
  isFormOpen: PropTypes.bool,
};
TenantBankAccounts.defaultProps = {
  className: '',
  list: [],
  isAccountsFetching: false,
  isAccountsLoading: false,
  hasDisbursementAccount: false,
  hasDefaultPayment: false,
  isFormOpen: false,
};
