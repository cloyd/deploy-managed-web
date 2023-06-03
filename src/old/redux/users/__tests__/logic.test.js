import reducer, { usersLogic as logic } from '..';
import { mockHttpClient, mockReduxLogic } from '../../__mocks__';
import { USER_TYPES } from '../constants';
import users, { initialState } from '../reducer';

const {
  create,
  createSuccess,
  destroy,
  destroySuccess,
  error,
  fetch,
  fetchAll,
  fetchAllSuccess,
  fetchSuccess,
  sendInvite,
  sendInviteSuccess,
  update,
  updateMarketplaceSetting,
  updateSuccess,
} = users.actions;

describe('users/logic', () => {
  let params;
  let request;
  let response;
  let store;

  const requestError = () =>
    error(new Error('Request failed with status code 500'));

  beforeEach(() => {
    store = mockReduxLogic({ initialState, logic, reducer });
  });

  describe('createLogic', () => {
    beforeEach(() => {
      params = { hello: 'world' };
      request = mockHttpClient.onPost('/managers', params);
    });

    it('should handle success', (done) => {
      response = { id: 22, ...params };
      store.dispatch(create({ type: USER_TYPES.manager, ...params }));
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = createSuccess({
          data: response,
          props: {
            isRedirect: true,
            type: USER_TYPES.manager,
            message: 'User has been created.',
          },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(create({ type: USER_TYPES.manager, ...params }));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('destroyLogic', () => {
    beforeEach(() => {
      params = { id: 22 };
      request = mockHttpClient.onDelete('/managers/22', params);
    });

    it('should handle success', (done) => {
      response = { id: 22, ...params };
      store.dispatch(destroy({ type: USER_TYPES.manager, ...params }));
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = destroySuccess({
          data: response,
          props: {
            type: USER_TYPES.manager,
            message: 'User has been deleted.',
          },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(destroy({ type: USER_TYPES.manager, ...params }));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('fetchAllLogic', () => {
    beforeEach(() => {
      params = {
        agencyId: 9,
        managerId: 123,
        search: 'tam',
      };
      request = mockHttpClient.onGet('/managers', {
        'q[propertiesAgencyIdEq]': 9,
        'q[propertiesManagerIdEq]': 123,
        'q[user_email_cont]': 'tam',
      });
      response = [
        { id: 11, firstName: 'tim', email: 'timtam@managed.com.au' },
        { id: 22, firstName: 'tamara', email: 'tamara@managed.com.au' },
      ];
    });

    it('should handle success', (done) => {
      store.dispatch(fetchAll({ type: USER_TYPES.manager, ...params }));
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchAllSuccess({
          data: response,
          props: { type: USER_TYPES.manager },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(fetchAll({ type: USER_TYPES.manager, ...params }));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error when invalid params', (done) => {
      store.dispatch(fetch({ param: 'no type passed in' }));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = error({ message: 'user type is required' });
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('fetchLogic', () => {
    beforeEach(() => {
      params = { id: 123, hello: 'world' };
      request = mockHttpClient.onGet('/managers/123', {
        params: { hello: 'world' },
      });
    });

    it('should handle success', (done) => {
      store.dispatch(fetch({ type: USER_TYPES.manager, ...params }));
      request.reply(200, params);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = fetchSuccess({
          data: params,
          props: { type: USER_TYPES.manager },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(fetch({ type: USER_TYPES.manager, ...params }));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error when invalid params', (done) => {
      store.dispatch(fetch({ param: 'no type passed in' }));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = error({ message: 'user type is required' });
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('sendInvite', () => {
    describe('when sending invite to an existing user', () => {
      beforeEach(() => {
        params = { id: 22 };
        request = mockHttpClient.onPost('/owners/22/send-invite', {});
      });

      it('should handle success', (done) => {
        response = {};
        store.dispatch(sendInvite({ type: USER_TYPES.owner, ...params }));
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = sendInviteSuccess({
            data: response,
            props: {
              type: USER_TYPES.owner,
              message: 'Invite has been sent.',
            },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should handle error', (done) => {
        store.dispatch(sendInvite({ type: USER_TYPES.owner, ...params }));
        request.reply(500, {});

        store.whenComplete(() => {
          const received = store.actions;
          const expected = requestError();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });

    describe('when sending invite to a new user', () => {
      beforeEach(() => {
        params = { email: 'hello@world.com', firstName: 'Tim', phone: '11111' };
        request = mockHttpClient.onPost(
          '/external-creditors/send-invite',
          params
        );
      });

      it('should handle success', (done) => {
        response = {};
        store.dispatch(
          sendInvite({ type: USER_TYPES.externalCreditor, ...params })
        );
        request.reply(200, response);

        store.whenComplete(() => {
          const received = store.actions;
          const expected = sendInviteSuccess({
            data: response,
            props: {
              type: USER_TYPES.externalCreditor,
              message: 'Invite has been sent to hello@world.com',
            },
          });
          expect(received).toContainEqual(expected);
          done();
        });
      });

      it('should handle error', (done) => {
        store.dispatch(
          sendInvite({ type: USER_TYPES.externalCreditor, ...params })
        );
        request.reply(500, {});

        store.whenComplete(() => {
          const received = store.actions;
          const expected = requestError();
          expect(received).toContainEqual(expected);
          done();
        });
      });
    });
  });

  describe('updateLogic', () => {
    beforeEach(() => {
      params = { id: 22, hello: 'world' };
      request = mockHttpClient.onPut('/managers/22', { hello: 'world' });
    });

    it('should handle success', (done) => {
      response = { id: 22, ...params };
      store.dispatch(update({ type: USER_TYPES.manager, ...params }));
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = updateSuccess({
          data: response,
          props: {
            type: USER_TYPES.manager,
            message: 'User has been updated.',
          },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(update({ type: USER_TYPES.manager, ...params }));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });

  describe('updateMarketplaceSettingLogic', () => {
    const id = 22;

    beforeEach(() => {
      params = { hello: 'world' };
      request = mockHttpClient.onPut(
        '/external-creditors/22/marketplace-settings',
        params
      );
    });

    it('should handle success', (done) => {
      response = { id, ...params };
      store.dispatch(updateMarketplaceSetting({ id, params }));
      request.reply(200, response);

      store.whenComplete(() => {
        const received = store.actions;
        const expected = updateSuccess({
          data: response,
          props: {
            type: USER_TYPES.externalCreditor,
            message: 'Marketplace settings have been updated.',
          },
        });
        expect(received).toContainEqual(expected);
        done();
      });
    });

    it('should handle error', (done) => {
      store.dispatch(updateMarketplaceSetting({ id, params }));
      request.reply(500, {});

      store.whenComplete(() => {
        const received = store.actions;
        const expected = requestError();
        expect(received).toContainEqual(expected);
        done();
      });
    });
  });
});
