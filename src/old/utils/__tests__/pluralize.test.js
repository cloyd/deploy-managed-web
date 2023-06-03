/* eslint-disable no-undef */
import { pluralize } from '../pluralize';

describe('pluralize', () => {
  it('should return the pluralized string if item.length is 0', () => {
    const expected = 'Invites';
    const received = pluralize('Invite', []);

    expect(received).toEqual(expected);
  });

  it('should return the singular string if item.length is 1', () => {
    const expected = 'Invite';
    const received = pluralize('Invite', [1]);

    expect(received).toEqual(expected);
  });

  it('should return the singular string if item.length > 1', () => {
    const expected = 'Invites';
    const received = pluralize('Invite', [1, 2]);

    expect(received).toEqual(expected);
  });

  it('should return the parsed string if item.length throws', () => {
    const expected = 'Invite';
    const received = pluralize('Invite', null);

    expect(received).toEqual(expected);
  });
});
