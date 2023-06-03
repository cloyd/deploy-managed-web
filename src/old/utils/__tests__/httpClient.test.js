/* eslint-disable no-undef */
import localStorage from 'store';

import { showAlert } from '../../redux/notifier';
import { setPagination } from '../../redux/pagination';
import { logoutUser } from '../../redux/profile';
import {
  getPagination,
  handleReject,
  handleRequest,
  handleResponse,
  httpClient,
} from '../httpClient';

let response;

const store = {
  dispatch: jest.fn(),
};

describe('httpClient', () => {
  afterEach(() => {
    response = undefined;
  });

  it('should define the baseURL', () => {
    const expected = '/api';
    const received = httpClient.defaults.baseURL;
    expect(received).toBe(expected);
  });

  describe('getPagination', () => {
    let headers;

    beforeEach(() => {
      headers = { 'x-pagination': `{ "total": "24", "total_pages": "2" }` };
    });

    it('should return undefined by default', () => {
      const expected = undefined;
      const received = getPagination({ ...response, headers: {} });
      expect(received).toBe(expected);
    });

    it('should define page with 1 by default', () => {
      const expected = 1;
      const received = getPagination({ ...response, headers }).page;
      expect(received).toEqual(expected);
    });

    it('should define page from config.params.page', () => {
      const config = { params: { page: 2 } };
      const expected = 2;
      const received = getPagination({ ...response, config, headers }).page;
      expect(received).toEqual(expected);
    });

    it('should define perPage', () => {
      const expected = 12;
      const received = getPagination({ ...response, headers }).perPage;
      expect(received).toEqual(expected);
    });
  });

  describe('handleRequest', () => {
    beforeEach(() => {
      localStorage.get.mockImplementation((key) => key);
    });

    it('should add data, params and headers to config', () => {
      const expected = ['key', 'data', 'params', 'headers'];
      const received = Object.keys(handleRequest({ key: 'value' }));
      expect(received).toEqual(expected);
    });

    it('should decamelizeKeys for data', () => {
      const expected = { a_b: 'ab' };
      const received = handleRequest({ data: { aB: 'ab' } }).data;
      expect(received).toEqual(expected);
    });

    it('should decamelizeKeys for params', () => {
      const expected = { a_b: 'ab' };
      const received = handleRequest({ params: { aB: 'ab' } }).params;
      expect(received).toEqual(expected);
    });

    it('should add Authorization to headers', () => {
      const expected = { a: 'a', Authorization: 'authToken' };
      const received = handleRequest({ headers: { a: 'a' } }).headers;
      expect(received).toEqual(expected);
    });
  });

  describe('handleResponse', () => {
    beforeEach(() => {
      response = {
        config: {},
        data: { a_b: 'ab' },
      };
    });

    it('should add data to response', () => {
      const expected = ['config', 'data', 'key'];

      const received = Object.keys(
        handleResponse({ ...response, key: 'value' }, store)
      );
      expect(received).toEqual(expected);
    });

    it('should camelize the response data', () => {
      const expected = { aB: 'ab' };
      const received = handleResponse(response, store).data;
      expect(received).toEqual(expected);
    });

    it('should not camelize the response data when skipCamelize: true', () => {
      response.config = { skipCamelize: true };
      const expected = { a_b: 'ab' };
      const received = handleResponse(response, store).data;
      expect(received).toEqual(expected);
    });

    it('should dispatch setPagination using url as key', () => {
      const params = {
        ...response,
        config: { url: '/api/urlAsKey' },
        headers: { 'x-pagination': `{ "total": "24", "total_pages": "2" }` },
      };

      handleResponse(params, store);

      const received = store.dispatch;
      const expected = setPagination({
        ...getPagination(params),
        key: 'urlAsKey',
      });

      expect(received).toHaveBeenCalledWith(expected);
    });

    it('should dispatch setPagination using config.pagination as key', () => {
      const params = {
        ...response,
        config: { pagination: 'paginationAsKey' },
        headers: { 'x-pagination': `{ "total": "24", "total_pages": "2" }` },
      };

      handleResponse(params, store);

      const received = store.dispatch;
      const expected = setPagination({
        ...getPagination(params),
        key: 'paginationAsKey',
      });

      expect(received).toHaveBeenCalledWith(expected);
    });
  });

  describe('handleReject', () => {
    let error;

    beforeEach(() => {
      error = {
        response: {
          status: 401,
          data: {
            error: 'Error Message',
          },
          config: {
            url: 'api/test',
          },
        },
      };
    });

    it('should return a promise with the error.response', (done) => {
      const expected = 401;
      const received = error.response.status;

      handleReject(error, store).catch(() => {
        expect(received).toEqual(expected);
        done();
      });
    });

    it('should handle a 401 with logoutUser', (done) => {
      const expected = logoutUser(true);
      const received = store.dispatch;
      error.response.status = 401;

      handleReject(error, store).catch(() => {
        expect(received).toHaveBeenCalledWith(expected);
        done();
      });
    });

    it('should handle a 403 with showAlert', (done) => {
      const expected = showAlert({
        color: 'warning',
        message: '<b>Access Denied</b>: Error Message',
      });

      const received = store.dispatch;
      error.response.status = 403;

      handleReject(error, store).catch(() => {
        expect(received).toHaveBeenCalledWith(expected);
        done();
      });
    });

    it('should handle a 404 with a redirect', (done) => {
      window.location.assign = jest.fn();
      error.response.status = 404;

      const expected = '/';
      const received = window.location.assign;

      handleReject(error, store).catch(() => {
        expect(received).toHaveBeenCalledWith(expected);
        done();
      });
    });

    it('should handle a 422 with showAlert', (done) => {
      const expected = showAlert({
        color: 'danger',
        message: '<b>Error</b>: Error Message',
      });

      const received = store.dispatch;
      error.response.status = 422;

      handleReject(error, store).catch(() => {
        expect(received).toHaveBeenCalledWith(expected);
        done();
      });
    });

    it('should handle a 500 with showAlert', (done) => {
      const expected = showAlert({
        color: 'danger',
        message: '<b>Error</b>: An internal API error occurred.',
      });

      const received = store.dispatch;
      error.response.status = 500;

      handleReject(error, store).catch(() => {
        expect(received).toHaveBeenCalledWith(expected);
        done();
      });
    });
  });
});
