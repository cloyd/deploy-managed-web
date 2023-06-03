import {
  getByTestId,
  queryAllByTestId,
  queryByTestId,
  queryByText,
} from '@testing-library/react';
import React from 'react';

import {
  getStateAsCorporateUser,
  getStateAsExternalCreditor,
  getStateAsManager,
  getStateAsPrimaryOwner,
  getStateAsPrimaryTenant,
  getStateAsPrincipal,
  getStateAsSecondaryOwner,
  getStateAsSecondaryTenant,
} from '../../../test/getStateAsUser';
import { renderWithStore } from '../../../test/renderWithStore';
import { Profile } from '../Profile';

jest.mock('react-avatar-editor');

describe('Profile', () => {
  const testStoreState = {};

  describe('when logged in as an external creditor', () => {
    test.todo('should show correct sub nav links');

    it('should show external creditor profile form', () => {
      const [{ container }] = renderWithStore(<Profile />, {
        initialState: getStateAsExternalCreditor(testStoreState),
      });

      expect(
        queryByTestId(container, 'external-creditor-profile-form')
      ).toBeTruthy();
    });
  });

  describe('when logged in as a corporate user', () => {
    it('should show correct sub nav links', () => {
      const [{ container }] = renderWithStore(<Profile />, {
        initialState: getStateAsCorporateUser(testStoreState),
      });

      expect(queryAllByTestId(container, 'nav-sub-link').length).toEqual(2);
      const navSub = getByTestId(container, 'nav-sub');

      expect(queryByText(navSub, 'My Profile')).toBeTruthy();
      expect(queryByText(navSub, 'Plans')).toBeTruthy();
      expect(queryByText(navSub, 'Payment Settings')).toBeFalsy();
      expect(queryByText(navSub, 'Notification Settings')).toBeFalsy();
    });
  });

  describe('when logged in as a manager', () => {
    it('should show correct sub nav links', () => {
      const [{ container }] = renderWithStore(<Profile />, {
        initialState: getStateAsManager(testStoreState),
      });

      expect(queryAllByTestId(container, 'nav-sub-link').length).toEqual(1);
      const navSub = getByTestId(container, 'nav-sub');

      expect(queryByText(navSub, 'My Profile')).toBeTruthy();
      expect(queryByText(navSub, 'Payment Settings')).toBeFalsy();
      expect(queryByText(navSub, 'Notification Settings')).toBeFalsy();
    });
  });

  describe('when logged in as a primary owner', () => {
    it('should show correct sub nav links', () => {
      const [{ container }] = renderWithStore(<Profile />, {
        initialState: getStateAsPrimaryOwner(testStoreState),
      });

      expect(queryAllByTestId(container, 'nav-sub-link').length).toEqual(2);
      const navSub = getByTestId(container, 'nav-sub');

      expect(queryByText(navSub, 'My Profile')).toBeTruthy();
      expect(queryByText(navSub, 'Payment Settings')).toBeFalsy();
      expect(queryByText(navSub, 'Notification Settings')).toBeTruthy();
    });
  });

  describe('when logged in as a primary tenant', () => {
    it('should show correct sub nav links', () => {
      const [{ container }] = renderWithStore(<Profile />, {
        initialState: getStateAsPrimaryTenant(testStoreState),
      });

      expect(queryAllByTestId(container, 'nav-sub-link').length).toEqual(3);
      const navSub = getByTestId(container, 'nav-sub');

      expect(queryByText(navSub, 'My Profile')).toBeTruthy();
      expect(queryByText(navSub, 'Payment Settings')).toBeTruthy();
      expect(queryByText(navSub, 'Notification Settings')).toBeTruthy();
    });
  });

  describe('when logged in as a principal', () => {
    it('should show correct sub nav links', () => {
      const [{ container }] = renderWithStore(<Profile />, {
        initialState: getStateAsPrincipal(testStoreState),
      });

      expect(queryAllByTestId(container, 'nav-sub-link').length).toEqual(3);
      const navSub = getByTestId(container, 'nav-sub');

      expect(queryByText(navSub, 'My Profile')).toBeTruthy();
      expect(queryByText(navSub, 'Payment Settings')).toBeTruthy();
      expect(queryByText(navSub, 'Notification Settings')).toBeFalsy();
    });
  });

  describe('when logged in as a secondary owner', () => {
    it('should show correct sub nav links', () => {
      const [{ container }] = renderWithStore(<Profile />, {
        initialState: getStateAsSecondaryOwner(testStoreState),
      });

      expect(queryAllByTestId(container, 'nav-sub-link').length).toEqual(2);
      const navSub = getByTestId(container, 'nav-sub');

      expect(queryByText(navSub, 'My Profile')).toBeTruthy();
      expect(queryByText(navSub, 'Payment Settings')).toBeFalsy();
      expect(queryByText(navSub, 'Notification Settings')).toBeTruthy();
    });
  });

  describe('when logged in as a secondary tenant', () => {
    it('should show correct sub nav links', () => {
      const [{ container }] = renderWithStore(<Profile />, {
        initialState: getStateAsSecondaryTenant(testStoreState),
      });

      expect(queryAllByTestId(container, 'nav-sub-link').length).toEqual(2);
      const navSub = getByTestId(container, 'nav-sub');

      expect(queryByText(navSub, 'My Profile')).toBeTruthy();
      expect(queryByText(navSub, 'Payment Settings')).toBeFalsy();
      expect(queryByText(navSub, 'Notification Settings')).toBeTruthy();
    });
  });
});
