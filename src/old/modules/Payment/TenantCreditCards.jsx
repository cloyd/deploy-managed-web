import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { PulseLoader } from 'react-spinners';
import { Button, CardBody, CardTitle, Col, Row } from 'reactstrap';

import { TenantAccountLoader } from '.';
import { ButtonIcon } from '../Button';
import { CardHeaderLight, CardLight } from '../Card';
import { FormCardAccount, Switch } from '../Form';
import { PaymentCardIcon } from './CardIcon';
import {
  QUERY_KEYS,
  useAddCreditCard,
  useCreateTokenCard,
  useRemoveAccount,
} from './hooks/use-assembly';

export const TenantCreditCards = ({
  className,
  isAccountsFetching,
  isAccountsLoading,
  list,
  hasDefaultPayment,
  hostedFieldsEnv,
  fingerprint,
  onChangePaymentMethod,
  handleHideForm,
  handleShowForm,
  isFormOpen,
}) => {
  const queryClient = useQueryClient();

  const { refetch, isFetching: isFetchingToken } = useCreateTokenCard({
    fingerprint,
  });
  const { mutate, isLoading: isAddingCreditCard } = useAddCreditCard();
  const { mutate: removeAccount, isSuccess: isRemoveAccountSuccess } =
    useRemoveAccount();

  useEffect(() => {
    if (isRemoveAccountSuccess) {
      queryClient.invalidateQueries(QUERY_KEYS.FETCH_ACCOUNTS);
    }
  }, [isRemoveAccountSuccess, queryClient]);

  const hostedFieldsCard = useMemo(
    () =>
      window.assembly.hostedFields({
        environment: hostedFieldsEnv,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFormOpen, hostedFieldsEnv]
  );

  const createCardAccount = useCallback(
    async (token, promisepayUserId) => {
      hostedFieldsCard
        .createCardAccount({
          token,
          user_id: promisepayUserId,
        })
        .then((response) => {
          return response;
        });
    },
    [hostedFieldsCard]
  );

  const createTokenCard = async () => {
    const { data } = await refetch();

    return data;
  };

  const addCreditCard = useCallback(
    ({ promisepayId }) => {
      mutate({
        fingerprint,
        promisepayId,
        callback: () => {
          handleHideForm();

          // set default payment if no payment has been set
          if (list.length === 0 && !hasDefaultPayment) {
            onChangePaymentMethod(promisepayId, true);
          } else {
            queryClient.invalidateQueries(QUERY_KEYS.FETCH_ACCOUNTS);
          }
        },
      });
    },
    [
      fingerprint,
      handleHideForm,
      hasDefaultPayment,
      list.length,
      mutate,
      onChangePaymentMethod,
      queryClient,
    ]
  );

  return (
    <div className={`${className} mt-4`} data-testid="payment-settings-cards">
      <h4 className="mb-3" data-testid="payment-settings-card-section-heading">
        Credit Cards
      </h4>
      {isAccountsLoading ? (
        <TenantAccountLoader type="card" title="Credit Card" />
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
                          Credit Card
                        </CardTitle>
                      </div>
                      {account?.isDeleting ? (
                        <div>
                          <PulseLoader color="#dee2e6" size={10} />
                        </div>
                      ) : (
                        !account?.isDefault && (
                          <ButtonIcon
                            data-testid={`bank-${index}-${account.accountNumber}-delete`}
                            className="p-0"
                            icon={['far', 'trash-alt']}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={() =>
                              removeAccount({
                                fingerprint,
                                promisepayId: account?.promisepayId,
                                type: 'card',
                              })
                            }
                          />
                        )
                      )}
                    </header>
                  </CardHeaderLight>
                  <CardBody>
                    <Row>
                      <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                        <Row className="mb-2">
                          <Col xs={6} sm={4}>
                            <strong>Name:</strong>
                          </Col>
                          <Col xs={6} sm={8}>
                            {account.fullName}
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={6} sm={4}>
                            <strong>Number:</strong>
                          </Col>
                          <Col xs={6} sm={8}>
                            {account.number}
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Row className="mb-2">
                          <Col className="d-flex justify-content-between align-items-center">
                            <Switch
                              id={`credit-card-${index}-${account.number}-chosen`}
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
                      </Col>
                    </Row>
                  </CardBody>
                </CardLight>
              );
            })}
          {isFormOpen && (
            <FormCardAccount
              onCancel={handleHideForm}
              onSubmit={addCreditCard}
              hostedFields={hostedFieldsCard}
              // eslint-disable-next-line react/jsx-no-bind
              createToken={createTokenCard}
              createCardAccount={createCardAccount}
              disabled={isFetchingToken || isAddingCreditCard}
              history={{}}
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
              + Add Credit Card
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

TenantCreditCards.propTypes = {
  className: PropTypes.string,
  isAccountsFetching: PropTypes.bool,
  isAccountsLoading: PropTypes.bool,
  list: PropTypes.arrayOf(PropTypes.object),
  hasDefaultPayment: PropTypes.bool,
  hostedFieldsEnv: PropTypes.string,
  fingerprint: PropTypes.string,
  onChangePaymentMethod: PropTypes.func.isRequired,
  // props for opening/closing add form
  handleHideForm: PropTypes.func.isRequired,
  handleShowForm: PropTypes.func.isRequired,
  isFormOpen: PropTypes.bool,
};
TenantCreditCards.defaultProps = {
  className: '',
  list: [],
  isAccountsFetching: false,
  isAccountsLoading: false,
  isFormOpen: false,
  hasDefaultPayment: false,
};
