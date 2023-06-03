import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import {
  Button,
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap';

import { FormBankAccount, FormFieldRadio } from '../Form';
import { PaymentCardIcon } from './CardIcon';
import {
  QUERY_KEYS,
  useAddBankAccount,
  useCreateTokenBank,
} from './hooks/use-assembly';

export const SelectBankAccount = ({
  list,
  isLoading,
  isFetching,
  isFormOpen,
  hostedFieldsEnv,
  fingerprint,
  handleHideForm,
  handleShowForm,
  onSelectBank,
}) => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState('');
  const [added, setAdded] = useState('');

  const { refetch, isFetching: isFetchingToken } = useCreateTokenBank({
    fingerprint,
  });
  const {
    mutate,
    data,
    isSuccess,
    isLoading: isAddingBankAccount,
  } = useAddBankAccount();

  useEffect(() => {
    if ((value === '' || added !== '') && !!list.length) {
      const bankAccountId = list
        .filter(({ isDisbursement, promisepayId }) =>
          added !== '' ? promisepayId === added : isDisbursement
        )?.[0]
        ?.id?.toString();

      setValue(bankAccountId);
      onSelectBank(bankAccountId);
      setAdded('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {
    if (isSuccess) {
      handleHideForm();
      queryClient.invalidateQueries(QUERY_KEYS.FETCH_ACCOUNTS);
    }
  }, [data, isSuccess, queryClient, handleHideForm]);

  const handleChange = useCallback(
    ({ currentTarget }) => {
      const bankAccountId = currentTarget.value;

      setValue(bankAccountId);
      onSelectBank(bankAccountId);
    },
    [setValue, onSelectBank]
  );

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
          setAdded(promisepayId);
        },
      });
    },
    [fingerprint, mutate]
  );

  return (
    <>
      <ListGroup>
        {isLoading || isFetching ? (
          <ListGroupItem
            key="bank-account-loading"
            className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
            <PulseLoader color="#dee2e6" />
          </ListGroupItem>
        ) : (
          <>
            {list.map((bank) => (
              <ListGroupItem
                key={`bank-account-${bank.id}`}
                className="px-3 py-2">
                <Label
                  className="d-flex justify-content-between align-items-center m-0"
                  for={`bank-account-${bank.id}`}>
                  <div className="d-flex align-items-center">
                    <FormFieldRadio
                      className="p-0"
                      id={`bank-account-${bank.id}`}
                      name={`bank-account-${bank.id}`}
                      isChecked={value === `${bank.id}`}
                      disabled={isFetching || isLoading}
                      value={`${bank.id}`}
                      onChange={handleChange}
                    />
                    <div className="ml-2 w-80 m-0">
                      <ListGroupItemHeading className="mb-0">
                        <PaymentCardIcon
                          cardType={bank.type}
                          className="mr-2"
                        />
                        {bank.bankName}
                      </ListGroupItemHeading>
                      <ListGroupItemText
                        tag="small"
                        className="m-0"
                        style={{ whiteSpace: 'pre-line' }}>
                        {`Name: ${bank.accountName}
                      Acc #: ${
                        bank.accountNumber
                          ? `${bank.routingNumber}-${bank.accountNumber}`
                          : ''
                      }`}
                      </ListGroupItemText>
                    </div>
                  </div>
                </Label>
              </ListGroupItem>
            ))}
            {isFormOpen ? (
              <div className="mt-2">
                <FormBankAccount
                  className="mt-3"
                  onSubmit={addBankAccount}
                  onClose={handleHideForm}
                  hostedFields={hostedFieldsBank}
                  createCardAccount={createCardAccount}
                  // eslint-disable-next-line react/jsx-no-bind
                  createToken={createTokenBank}
                  disabled={isFetchingToken || isAddingBankAccount}
                  canSkipConfirmation
                />
              </div>
            ) : (
              <Button
                color="primary"
                outline
                className="p-3 mt-2 mb-3 w-100"
                onClick={handleShowForm}
                disabled={isFetching}>
                + Add Bank Account
              </Button>
            )}
          </>
        )}
      </ListGroup>
    </>
  );
};

SelectBankAccount.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  isFetching: PropTypes.bool,
  hostedFieldsEnv: PropTypes.string,
  fingerprint: PropTypes.string,
  onSelectBank: PropTypes.func.isRequired,
  // props for opening/closing add form
  handleHideForm: PropTypes.func.isRequired,
  handleShowForm: PropTypes.func.isRequired,
  isFormOpen: PropTypes.bool,
};
SelectBankAccount.defaultProps = {
  list: [],
  isFetching: false,
  isLoading: false,
  isFormOpen: false,
};
