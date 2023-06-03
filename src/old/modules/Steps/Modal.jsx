import PropTypes from 'prop-types';
import React from 'react';
import { Container, Modal, ModalBody, ModalHeader } from 'reactstrap';

import { useIsOpen } from '@app/hooks';
import { BrandLogo } from '@app/modules/Brand';
import { StepsProgress } from '@app/modules/Steps';

export const StepsModal = ({
  children,
  isOpen = true,
  step,
  total,
  ...props
}) => {
  const [isOpenModal, { handleToggle }] = useIsOpen(isOpen);

  return (
    <Modal
      className="modal-fullscreen"
      contentClassName="bg-200"
      isOpen={isOpenModal}
      {...props}>
      <div className="bg-100 shadow-sm">
        <Container className="px-1 px-lg-3">
          <ModalHeader
            toggle={handleToggle}
            className="align-items-center border-0">
            <BrandLogo>Managed</BrandLogo>
          </ModalHeader>
        </Container>
        {!!step && !!total && <StepsProgress step={step} total={total} />}
      </div>
      <ModalBody>
        <Container className="px-0 px-lg-3 my-2 my-lg-3">{children}</Container>
      </ModalBody>
    </Modal>
  );
};

StepsModal.propTypes = {
  children: PropTypes.node,
  handleClose: PropTypes.func,
  isOpen: PropTypes.bool,
  step: PropTypes.number,
  total: PropTypes.number,
};
