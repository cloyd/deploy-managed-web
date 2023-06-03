import kebabCase from 'lodash/fp/kebabCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

import { useIsOpen } from '../../hooks';
import { httpClient, sanitizeHtml } from '../../utils';
import { FormFieldCheckbox } from '../Form';

function getTerms(provider) {
  return {
    name: 'Accept Terms',
    description: `I accept the sharing of personal data with ${provider.name}`,
  };
}

function getLeaseAgreement({ attachments }) {
  let description;

  if (attachments?.length) {
    const attachment = attachments[attachments.length - 1];

    description = `<a href='${attachment.urls.original}' target='_blank' data-testid='download-pdf'>Download PDF</a>`;
  }

  return {
    name: 'Lease Agreement',
    description,
  };
}

function getApplicationRequirements(lease, provider) {
  const leaseAgreement = getLeaseAgreement(lease);
  const terms = getTerms(provider);
  const requirements = [...provider.applicationRequirements];

  if (leaseAgreement) {
    requirements.push(leaseAgreement);
  }

  requirements.push(terms);

  return requirements.map((item) => ({
    ...item,
    slug: kebabCase(item.name),
  }));
}

function initAccepted(requirements) {
  return requirements.reduce((accepted, { slug }) => {
    return { ...accepted, [slug]: false };
  }, {});
}

async function createLoan(propertyId, loanProviderId) {
  const response = await httpClient.post(`properties/${propertyId}/loans`, {
    loanProviderId,
  });

  if (response.status === 201) {
    return response.data;
  }
}

export const LoanApplication = ({ lease, property, provider }) => {
  const [accepted, setAccepted] = useState({});
  const [isOpen, { handleToggle }] = useIsOpen();

  const requirements = useMemo(() => {
    return getApplicationRequirements(lease, provider);
  }, [lease, provider]);

  const isAccepted = useMemo(() => {
    return Object.values(accepted).every((state) => state);
  }, [accepted]);

  const handleChange = useCallback(
    (event) => {
      const { name, checked } = event.currentTarget;
      setAccepted((state) => ({ ...state, [name]: checked }));
    },
    [setAccepted]
  );

  const handleApply = useCallback(async () => {
    const loan = await createLoan(property.id, provider.id);

    if (loan) {
      window.location.assign(loan.applicationUrl);
    }
  }, [property.id, provider.id]);

  useEffect(() => {
    if (isOpen) {
      setAccepted(initAccepted(requirements));
    }
  }, [isOpen, requirements]);

  return (
    <>
      <Button
        color="primary"
        size="lg"
        onClick={handleToggle}
        data-testid="btn-start">
        Apply with {provider.name}
      </Button>
      <Modal
        backdrop="static"
        isOpen={isOpen}
        toggle={handleToggle}
        size="lg"
        contentClassName="border-0"
        centered>
        <ModalHeader toggle={handleToggle}>
          <span className="h3 text-primary">Before you begin...</span>
        </ModalHeader>
        <ModalBody data-testid="requirements">
          <p>
            {provider.name} will require you to provide details of your current
            property along with supporting documentation to identify elements
            such as rental income.
          </p>
          <h4 className="mb-3">What you will need for the application</h4>
          <ul className="list-unstyled mb-4">
            {requirements.map((item, i) => (
              <li
                key={`requirement-${i}`}
                className="d-flex mb-2"
                data-testid="requirement">
                <FormFieldCheckbox
                  name={item.slug}
                  onChange={handleChange}
                  className="mb-0 d-flex"
                  classNameLabel="text-normal"
                  classNameInput="d-inline"
                  fieldId="requirement">
                  <strong>{item.name}</strong>
                  {item.description && (
                    <>
                      <span className="px-2">-</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(item.description),
                        }}
                      />
                    </>
                  )}
                </FormFieldCheckbox>
              </li>
            ))}
          </ul>
          <div className="d-flex mb-2">
            <Button
              data-testid="btn-apply"
              color="primary"
              size="lg"
              onClick={handleApply}
              disabled={!isAccepted}
              className="mr-2">
              Start application <span className="d-none d-sm-inline">now</span>
            </Button>
            <Button
              data-testid="btn-cancel"
              color="primary"
              outline
              size="lg"
              onClick={handleToggle}>
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

LoanApplication.propTypes = {
  lease: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
};
