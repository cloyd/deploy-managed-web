import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardBody, Input, Row, UncontrolledTooltip } from 'reactstrap';

import { ButtonClose, ButtonEdit } from '../../modules/Button';
import { DISBURSEMENT_FREQUENCIES } from '../../redux/profile/constants';
import { httpClient } from '../../utils';
import { ModalConfirm } from '../Modal';
import './styles.scss';

export const CardDisbursementFrequency = ({ frequency, ownerId }) => {
  const [editing, setIsEditing] = useState(false);
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    showInstant: false,
    value: null,
  });
  const [selectedFrequency, setSelectedFrequency] = useState();
  const toolTipRef = useRef();

  useEffect(() => {
    if (!selectedFrequency) {
      let initialFrequency = DISBURSEMENT_FREQUENCIES.filter(
        (item) => item.name === frequency
      );
      setSelectedFrequency(initialFrequency[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequency]);

  const handleEdit = useCallback(() => {
    setIsEditing(!editing);
  }, [editing]);

  const toggleModal = useCallback(
    ({ oldValue, newValue } = {}) => {
      if (!newValue) {
        setModalProps({
          ...modalProps,
          isOpen: !modalProps.isOpen,
        });

        return;
      }

      let showInstant = false;
      if (oldValue.name.includes('instant')) {
        if (!newValue?.name.includes('instant')) {
          showInstant = false;
        }
      } else {
        if (newValue?.name.includes('instant')) {
          showInstant = true;
        } else {
          showInstant = false;
        }
      }

      setModalProps({
        isOpen: !modalProps.isOpen,
        value: newValue,
        showInstant,
      });
    },
    [modalProps]
  );

  /**
   * TODO: move logic to redux
   */
  const updateFrequency = useCallback(() => {
    httpClient
      .put(`/owners/${ownerId}/update_withdrawal_frequency`, {
        withdrawal_frequency: modalProps?.value?.name,
      })
      .then(() => {
        setSelectedFrequency(modalProps?.value);
        handleEdit();
        toggleModal();
      })
      .catch((error) => {
        console.log('Error occurred editing the disbursement', error);
      });
  }, [ownerId, modalProps, handleEdit, toggleModal]);

  const handleChange = useCallback(
    (e) => {
      const filteredValue = DISBURSEMENT_FREQUENCIES.filter(
        (item) => item.name === e.target.value
      );
      toggleModal({
        oldValue: selectedFrequency,
        newValue: filteredValue && filteredValue[0],
      });
    },
    [toggleModal, selectedFrequency]
  );

  return (
    <Card className="mb-3" data-testid="disbursement-frequency">
      <CardBody className="d-sm-flex justify-content-between align-items-center">
        <Row className="d-flex justify-content-between h5-font-size px-3">
          <span>{'Payment Withdrawal Frequency:'}</span>
        </Row>
        <Row className="d-flex justify-content-end px-3 align-items-center">
          {editing ? (
            <>
              <ButtonClose
                className="disbursement_close_edit_button"
                hasText={false}
                size="1x"
                onClick={handleEdit}
              />
              <span style={{ height: '2rem' }}>
                {' '}
                <Input
                  type="select"
                  className="ml-2"
                  name={`frequency-select`}
                  value={selectedFrequency?.name}
                  onChange={handleChange}>
                  {DISBURSEMENT_FREQUENCIES.map(({ name, label }) => (
                    <option
                      defaultValue={selectedFrequency.value}
                      key={`frequency-${name}`}
                      value={name}>
                      {label}
                    </option>
                  ))}
                </Input>
              </span>
              <div className="frequency-tooltip">
                <span ref={toolTipRef} className="text-left ml-1">
                  <FontAwesomeIcon icon={['fas', 'circle-question']} />
                </span>
                <UncontrolledTooltip
                  id="disbursement_tooltip"
                  target={toolTipRef}
                  placement="top">
                  An owner on Monthly/Weekly withdrawal frequency will have
                  funds accumulate in the individual property wallets. On the
                  first day of the new week/month, any funds that are not
                  required to be held for bills will pay out to the owners bank
                  account.
                </UncontrolledTooltip>
              </div>
            </>
          ) : (
            <>
              <span
                style={{ height: '2rem' }}
                data-testid="disbursement-frequency-type"
                className="h5-font-size">
                {selectedFrequency?.label ||
                  startCase(frequency?.split('_')?.[0])}
              </span>
              <ButtonEdit color="primary" onClick={handleEdit}>
                Edit
              </ButtonEdit>
            </>
          )}
        </Row>
        <ModalConfirm
          isOpen={modalProps.isOpen}
          size="md"
          btnCancel={{ text: 'Cancel' }}
          btnSubmit={{ text: 'Save' }}
          onCancel={toggleModal}
          onSubmit={updateFrequency}>
          <h5>Are you sure?</h5>
          <hr />
          {modalProps?.showInstant
            ? 'By changing to Instant withdrawals, funds will pay out to owners bank account as soon as rent is paid, unless funds are needed to be held back for bills.'
            : 'By changing the owner to Weekly/Monthly, funds will accumulate till the end of the period.'}
        </ModalConfirm>
      </CardBody>
    </Card>
  );
};

CardDisbursementFrequency.defaultProps = {
  frequency: '',
};

CardDisbursementFrequency.propTypes = {
  frequency: PropTypes.string,
  ownerId: PropTypes.number,
};
