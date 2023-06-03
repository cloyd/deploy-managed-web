import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import { InspectionFormAreaCreate } from '..';
import { useIsOpen } from '../../../hooks';
import { ModalConfirm } from '../../Modal';

export const InspectionAreaItemCreate = (props) => {
  const [isOpen, actions] = useIsOpen(props.onSubmit);

  return (
    <>
      <Button
        onClick={actions.handleOpen}
        color="outline-primary"
        className="btn px-3 py-5 d-flex flex-column align-items-center justify-content-center"
        data-testid="button-area-item-create"
        style={{
          width: '100%',
          height: '100%',
          borderStyle: 'dashed',
          borderWidth: '2px',
          visibility: props.isArchived ? 'hidden' : 'visible',
        }}>
        <FontAwesomeIcon
          icon={['far', 'plus-circle']}
          size={'3x'}
          className="d-block mb-3"
        />
        <strong>Add new area</strong>
      </Button>
      <ModalConfirm
        data-testid="modal-create-area"
        isOpen={isOpen}
        title={'New property area'}
        size="md">
        <p>Enter the area name</p>
        <InspectionFormAreaCreate
          hasError={false}
          isLoading={false}
          onCancel={actions.handleClose}
          onSubmit={actions.handleSubmit}
        />
      </ModalConfirm>
    </>
  );
};

InspectionAreaItemCreate.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isArchived: PropTypes.bool,
};
