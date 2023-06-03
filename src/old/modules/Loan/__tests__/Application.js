import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { mockHttpClient } from '../../../redux/__mocks__';
import { renderWithStore } from '../../../test/renderWithStore';
import { LoanApplication } from '../Application';

const render = ({ lease, property, provider }) => {
  const [renderContainer] = renderWithStore(
    <LoanApplication lease={lease} property={property} provider={provider} />,
    { initialState: {} }
  );

  return renderContainer;
};

describe('LoanApplication', () => {
  let lease = { id: 1, attachments: [] };
  let provider = { id: 1, applicationRequirements: [] };
  let property = { id: 1 };

  it('should display the modal button', () => {
    const { getByTestId } = render({ lease, property, provider });
    expect(getByTestId('btn-start')).toBeDefined();
  });

  it('should not display the modal', () => {
    const { queryByRole } = render({ lease, property, provider });
    expect(queryByRole('dialog')).toBeNull();
  });

  it('should open the modal', () => {
    const { getByTestId, getByRole } = render({ lease, property, provider });
    userEvent.click(getByTestId('btn-start'));
    expect(getByRole('dialog')).toBeDefined();
  });

  describe('when applicationUrl is undefined', () => {
    it('should display the Accept Terms requirement', () => {
      const { getAllByTestId, getByTestId, getByText } = render({
        lease,
        property,
        provider: { ...provider, name: 'Foo' },
      });

      userEvent.click(getByTestId('btn-start'));

      expect(getAllByTestId('requirement')).toHaveLength(2);
      expect(getByText('Accept Terms')).toBeDefined();
      expect(
        getByText('I accept the sharing of personal data with Foo')
      ).toBeDefined();
    });

    it('should display the Lease Agreement requirement', () => {
      const { getAllByTestId, getByTestId, getByText } = render({
        lease: { attachments: [{ urls: { original: 'file.pdf' } }] },
        property,
        provider,
      });

      userEvent.click(getByTestId('btn-start'));

      expect(getAllByTestId('requirement')).toHaveLength(2);
      expect(getByText('Lease Agreement')).toBeDefined();
      expect(getByTestId('download-pdf').href).toContain('file.pdf');
    });

    it('should display the provider.applicationRequirements', () => {
      const { getAllByTestId, getByTestId, getByText } = render({
        lease,
        property,
        provider: {
          applicationRequirements: [
            { name: 'A', description: 'Description A' },
            { name: 'B', description: 'Description B' },
          ],
        },
      });

      userEvent.click(getByTestId('btn-start'));

      expect(getAllByTestId('requirement')).toHaveLength(4);
      expect(getByText('A')).toBeDefined();
      expect(getByText('Description A')).toBeDefined();
      expect(getByText('B')).toBeDefined();
      expect(getByText('Description B')).toBeDefined();
    });

    it('should display the cancel button and close the modal', async () => {
      const { getByTestId, queryByRole } = render({
        lease,
        property,
        provider,
      });

      userEvent.click(getByTestId('btn-start'));
      expect(getByTestId('btn-cancel')).toBeDefined();

      userEvent.click(getByTestId('btn-cancel'));
      await waitFor(() => expect(queryByRole('dialog')).toBeNull());
    });

    it('should display the apply button as disabled', () => {
      const { getByTestId } = render({ lease, property, provider });
      userEvent.click(getByTestId('btn-start'));
      expect(getByTestId('btn-apply').disabled).toBe(true);
    });

    it('should enable the apply button after acccepting requiremnts', () => {
      const { getByTestId, getByLabelText } = render({
        lease,
        property,
        provider,
      });
      userEvent.click(getByTestId('btn-start'));
      userEvent.click(getByLabelText('Lease Agreement', { exact: false }));
      userEvent.click(getByLabelText('Accept Terms', { exact: false }));
      expect(getByTestId('btn-apply').disabled).toBe(false);
    });
  });

  describe('when applicationUrl is defined', () => {
    const originalAssign = window.location.assign;
    const assignSpy = jest.fn();

    beforeEach(() => {
      window.location.assign = assignSpy;
    });

    afterEach(() => {
      window.location.assign = originalAssign;
    });

    it('should redirect to applicationUrl', async () => {
      const applicationUrl = '/endpoint';
      const { queryByTestId, getByLabelText } = render({
        lease,
        property,
        provider,
      });

      mockHttpClient
        .onPost(`/properties/${property.id}/loans`, {
          loan_provider_id: provider.id,
        })
        .reply(201, { applicationUrl });

      userEvent.click(queryByTestId('btn-start'));
      userEvent.click(getByLabelText('Lease Agreement', { exact: false }));
      userEvent.click(getByLabelText('Accept Terms', { exact: false }));
      userEvent.click(queryByTestId('btn-apply'));

      await waitFor(() =>
        expect(assignSpy).toHaveBeenCalledWith(applicationUrl)
      );
    });
  });
});
