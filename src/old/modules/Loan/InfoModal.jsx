import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import { LoanCard } from '.';
import { Link } from '../../modules/Link';

export const LoanInfoModal = ({ loan, providers }) => {
  const [isOpen, setIsOpen] = useState(false);

  const provider = useMemo(() => {
    return providers.find(({ id }) => id === loan.loanProviderId);
  }, [loan, providers]);

  const handleToggle = useCallback(() => {
    setIsOpen((state) => !state);
  }, [setIsOpen]);

  return (
    <>
      <Link onClick={handleToggle} className="w-100 text-dark">
        <LoanCard loan={loan} />
      </Link>
      <Modal
        data-testid="modal"
        isOpen={isOpen}
        toggle={handleToggle}
        contentClassName="border-0"
        centered>
        <ModalHeader toggle={handleToggle}>
          <span className="h3 text-primary">
            {provider.name} {loan.name}
          </span>
        </ModalHeader>
        <ModalBody>
          {loan.status === 'draft' ? (
            <>
              It looks like this loan application is not yet completed. If you
              didn&apos;t complete the application with Possibl, please click
              &quot;Apply for a loan&quot; again.
            </>
          ) : (
            <>
              Your <strong>{provider.name}</strong> application is progressing,
              please check back later. If you don&apos;t hear from{' '}
              <strong>{provider.name}</strong> within the next few days, please
              contact them on{' '}
              <a
                href={`tel:${provider.phone}`}
                className="text-dark font-weight-bold">
                {provider.phone}
              </a>
              .
            </>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

LoanInfoModal.propTypes = {
  loan: PropTypes.object.isRequired,
  providers: PropTypes.array.isRequired,
};
