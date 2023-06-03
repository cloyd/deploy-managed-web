/* eslint-disable no-undef */
import reducer, {
  decorateIntention,
  fetchIntentions,
  fetchIntentionsCompleted,
  fetchIntentionsPayable,
  getIntention,
  getIntentionsAll,
  getIntentionsForProperty,
  initialState,
  logic,
} from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';

describe('intention/selectors', () => {
  let store;

  beforeEach(() => {
    store = mockReduxLogic({
      initialState,
      logic,
      reducer,
    });
  });

  afterEach(() => {
    store = undefined;
  });

  describe('getIntention', () => {
    it('should return the intention', () => {
      const received = getIntention({ data: { 1: 'intention' } }, 1);
      const expected = 'intention';

      expect(received).toEqual(expected);
    });
  });

  describe('getIntentionsAll', () => {
    const params = {};
    const intentions = [
      { id: 1, property: { id: 3 }, status: 'draft' },
      { id: 2, property: { id: 4 }, status: 'pending_tenant' },
    ];

    beforeEach(() => {
      mockHttpClient.onGet(`/intentions`).reply(200, { intentions });
    });

    it('should return intentions for a property', (done) => {
      store.dispatch(fetchIntentions(params));

      store.whenComplete(() => {
        const received = getIntentionsAll(store.getState());
        const expected = intentions.map(decorateIntention);

        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('getIntentionsForProperty', () => {
    const propertyId = 1;
    const params = { propertyId };
    const intentions = [
      { id: 1, property: { id: propertyId }, status: 'draft' },
      { id: 2, property: { id: propertyId }, status: 'pending_tenant' },
    ];

    it('should return the completed intentions for a property', (done) => {
      mockHttpClient.onGet(`/intentions`).reply(200, { intentions });
      store.dispatch(fetchIntentionsCompleted(params));

      store.whenComplete(() => {
        const fetchedIntentions = getIntentionsForProperty(
          store.getState(),
          propertyId
        );
        const received = fetchedIntentions.completed;
        const expected = intentions.map(decorateIntention);

        expect(received).toEqual(expected);
        done();
      });
    });

    it('should return the payable intentions for a property', (done) => {
      mockHttpClient.onGet(`/intentions/details`).reply(200, { intentions });
      store.dispatch(fetchIntentionsPayable(params));

      store.whenComplete(() => {
        const fetchedIntentions = getIntentionsForProperty(
          store.getState(),
          propertyId
        );
        const received = fetchedIntentions.payable;
        const expected = intentions.map(decorateIntention);

        expect(received).toEqual(expected);
        done();
      });
    });
  });
});
