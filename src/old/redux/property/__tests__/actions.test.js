/* eslint-disable no-undef */
import {
  createProperty,
  fetchProperties,
  fetchProperty,
  fetchPropertyFeeAudits,
  updateProperty,
} from '../actions';
import {
  CREATE,
  FETCH,
  FETCH_ALL,
  FETCH_FEE_AUDITS,
  UPDATE,
} from '../constants';

describe('property/actions', () => {
  it('should return action for createProperty', () => {
    const received = createProperty('params');
    const expected = {
      type: CREATE,
      payload: { params: 'params' },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchProperty', () => {
    const received = fetchProperty({ propertyId: 1, a: 'b' });
    const expected = {
      type: FETCH,
      payload: { propertyId: 1 },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchProperties', () => {
    const received = fetchProperties();
    const expected = {
      type: FETCH_ALL,
      payload: {},
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchProperties with address', () => {
    const received = fetchProperties({ address: 'foo' });
    const expected = {
      type: FETCH_ALL,
      payload: {
        address: 'foo',
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchProperties with address and managerId', () => {
    const received = fetchProperties({ address: 'foo', managerId: 1 });
    const expected = {
      type: FETCH_ALL,
      payload: {
        address: 'foo',
        managerId: 1,
      },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for updateProperty', () => {
    const received = updateProperty({ id: 1, a: 'a', b: 'b' });
    const expected = {
      type: UPDATE,
      payload: { id: 1, params: { a: 'a', b: 'b' } },
    };

    expect(received).toEqual(expected);
  });

  it('should return action for fetchPropertyFeeAudits with address and managerId', () => {
    const received = fetchPropertyFeeAudits({ propertyId: 1, page: 1 });
    const expected = {
      type: FETCH_FEE_AUDITS,
      payload: { propertyId: 1, page: 1 },
    };

    expect(received).toEqual(expected);
  });
});
