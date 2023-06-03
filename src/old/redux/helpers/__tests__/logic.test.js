import { httpClient } from '../../../utils';
import { mockHttpClient } from '../../__mocks__';
import { showAlert } from '../../notifier';
import {
  getData,
  getValue,
  normalize,
  normalizeArray,
  processDelete,
  processGet,
  processPost,
  processPut,
  processSuccess,
  setData,
  setMessage,
  setValue,
} from '../logic';

describe('redux/helpers/logic', () => {
  describe('getValue', () => {
    const response = {
      one: '1',
      two: '2',
      three: '3',
    };

    it('should return response with selected key', (done) => {
      const expected = { one: '1' };

      getValue('one')(response).then((received) => {
        expect(received).toEqual(expected);
        done();
      });
    });

    it('should resturn response with selected keys', (done) => {
      const expected = { one: '1', two: '2' };

      getValue(['one', 'two'])(response).then((received) => {
        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('getData', () => {
    const response = {
      data: '1',
      pagination: '2',
    };

    it('should return the keyed data', (done) => {
      const expected = { data: '1' };

      getData(response).then((received) => {
        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('normalize', () => {
    const response = {
      foo: 'bar',
      data: {
        id: 1,
        title: 'one',
      },
    };

    it('should return response.data keyed to id by default', (done) => {
      const expected = {
        1: {
          id: 1,
          title: 'one',
        },
      };

      normalize()(response).then((received) => {
        expect(received.data).toEqual(expected);
        done();
      });
    });

    it('should return response.data keyed by passed arg', (done) => {
      const expected = {
        one: {
          id: 1,
          title: 'one',
        },
      };

      normalize('title')(response).then((received) => {
        expect(received.data).toEqual(expected);
        done();
      });
    });

    it('should return response.result keyed to id by default', (done) => {
      const expected = 1;

      normalize()(response).then((received) => {
        expect(received.result).toEqual(expected);
        done();
      });
    });

    it('should return response.result keyed by passed arg', (done) => {
      const expected = 'one';

      normalize('title')(response).then((received) => {
        expect(received.result).toEqual(expected);
        done();
      });
    });
  });

  describe('normalizeArray', () => {
    const response = {
      foo: 'bar',
      data: [
        { id: 1, title: 'one' },
        { id: 2, title: 'two' },
      ],
    };

    it('should return response.data keyed to id by default', (done) => {
      const expected = {
        1: {
          id: 1,
          title: 'one',
        },

        2: {
          id: 2,
          title: 'two',
        },
      };

      normalizeArray()(response).then((received) => {
        expect(received.data).toEqual(expected);
        done();
      });
    });

    it('should return response.data keyed by passed arg', (done) => {
      const expected = {
        one: {
          id: 1,
          title: 'one',
        },

        two: {
          id: 2,
          title: 'two',
        },
      };

      normalizeArray('title')(response).then((received) => {
        expect(received.data).toEqual(expected);
        done();
      });
    });

    it('should return response.result keyed to id by default', (done) => {
      const expected = [1, 2];

      normalizeArray()(response).then((received) => {
        expect(received.result).toEqual(expected);
        done();
      });
    });

    it('should return response.result keyed by passed arg', (done) => {
      const expected = ['one', 'two'];

      normalizeArray('title')(response).then((received) => {
        expect(received.result).toEqual(expected);
        done();
      });
    });
  });

  describe('processDelete', () => {
    it('should call httpClient.delete with endpoint', (done) => {
      const endpoint = '/api';
      const params = { id: 1 };
      const action = { payload: { endpoint, params } };

      mockHttpClient.onDelete(endpoint).reply(200, {});

      processDelete({ action, httpClient }).then((response) => {
        const expected = { id: 1 };
        const received = response.data;

        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('processGet', () => {
    it('should call httpClient.get with endpoint and params', (done) => {
      const endpoint = '/api';
      const params = { foo: 'bar' };
      const action = { payload: { endpoint, params } };

      mockHttpClient.onGet(endpoint, { params }).reply(200, 'success');

      processGet({ action, httpClient }).then((response) => {
        const expected = 'success';
        const received = response.data;

        expect(received).toBe(expected);
        done();
      });
    });
  });

  describe('processPost', () => {
    it('should call httpClient.post with endpoint and params', (done) => {
      const endpoint = '/api';
      const params = { foo: 'bar' };
      const action = { payload: { endpoint, params } };

      mockHttpClient.onPost(endpoint, params).reply(200, 'success');

      processPost({ action, httpClient }).then((response) => {
        const expected = 'success';
        const received = response.data;

        expect(received).toBe(expected);
        done();
      });
    });
  });

  describe('processPut', () => {
    it('should call httpClient.put with endpoint and params', (done) => {
      const endpoint = '/api';
      const params = { foo: 'bar' };
      const action = { payload: { endpoint, params } };

      mockHttpClient.onPut(endpoint, params).reply(200, 'success');

      processPut({ action, httpClient }).then((response) => {
        const expected = 'success';
        const received = response.data;

        expect(received).toBe(expected);
        done();
      });
    });
  });

  describe('processSuccess', () => {
    let dispatch;
    let done;

    beforeEach(() => {
      dispatch = jest.fn();
      done = jest.fn();
    });

    it('should call done', () => {
      const action = { payload: {} };
      processSuccess({ action }, dispatch, done);
      expect(done).toHaveBeenCalled();
    });

    it('should not call dispatch when message is undefined', () => {
      const action = { payload: {} };
      processSuccess({ action }, dispatch, done);
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should call dispatch with showAlert when message is defined', () => {
      const params = { message: 'message' };
      const action = { payload: params };
      const expected = showAlert({
        color: 'success',
        message: '<strong>Success:</strong> message',
      });

      processSuccess({ action }, dispatch, done);

      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('setData', () => {
    it('should return response with data set to its child slice', (done) => {
      const response = {
        bar: 'foo',
        data: {
          one: { foo: 'bar' },
        },
      };

      const expected = {
        bar: 'foo',
        data: { foo: 'bar' },
      };

      setData('one')(response).then((received) => {
        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('setMessage', () => {
    it('should return response with message set', (done) => {
      const response = {
        foo: 'bar',
      };

      const expected = {
        foo: 'bar',
        message: 'message',
      };

      setMessage('message')(response).then((received) => {
        expect(received).toEqual(expected);
        done();
      });
    });
  });

  describe('setValue', () => {
    it('should return response with the value set', (done) => {
      const response = {
        foo: 'bar',
      };

      const expected = {
        foo: 'bar',
        message: 'message',
      };

      setValue({ message: 'message' })(response).then((received) => {
        expect(received).toEqual(expected);
        done();
      });
    });
  });
});
