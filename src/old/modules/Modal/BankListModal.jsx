import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { selectProfileData, selectUserFingerprint } from '../../redux/profile';
import { SelectBankAccount } from '../Payment/SelectBankAccount';
import { useFetchAccounts } from '../Payment/hooks/use-assembly';

export const BankListModal = ({
  isOpen,
  setIsOpenModal,
  toggleModal,
  bankAccountId,
  setBankAccountId,
}) => {
  const { hostedFieldsEnv } = useSelector(selectProfileData);
  const fingerprint = useSelector(selectUserFingerprint);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const { data, isFetching, isLoading } = useFetchAccounts();

  const showAddAccountForm = useCallback(() => {
    setIsAddAccountOpen(true);
  }, []);

  const closeAddAccountForm = useCallback(() => {
    setIsAddAccountOpen(false);
  }, []);

  const handleNextStep = useCallback(() => {
    setIsOpenModal({ type: 'indicateAmount' });
  }, [setIsOpenModal]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggleModal}
      unmountOnClose
      centered
      scrollable
      size="lg">
      <ModalHeader>Withdraw to Bank</ModalHeader>
      <ModalBody>
        <SelectBankAccount
          list={data?.bank || []}
          isLoading={isLoading}
          isFetching={isFetching}
          hostedFieldsEnv={hostedFieldsEnv}
          fingerprint={fingerprint}
          onSelectBank={setBankAccountId}
          // props for opening/closing add form
          handleHideForm={closeAddAccountForm}
          handleShowForm={showAddAccountForm}
          isFormOpen={isAddAccountOpen}
        />
      </ModalBody>
      <ModalFooter className="d-flex">
        <Button color="secondary" onClick={toggleModal} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleNextStep}
          color="primary"
          disabled={isLoading || bankAccountId === ''}>
          Next
        </Button>
      </ModalFooter>
    </Modal>
  );
};

BankListModal.propTypes = {
  isOpen: PropTypes.bool,
  isLoading: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
  setIsOpenModal: PropTypes.func.isRequired,
  bankAccountId: PropTypes.string,
  setBankAccountId: PropTypes.func.isRequired,
};
BankListModal.defaultProps = {
  isOpen: false,
  isLoading: false,
  bankAccountId: '',
};
