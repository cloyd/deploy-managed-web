import axios from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import localStorage from 'store';

import { INVALID_PAGE_MESSAGE, showAlert } from '../redux/notifier';
import { setPagination } from '../redux/pagination';
import { logoutUser } from '../redux/profile';
import { HTTP_ERRORS, translate } from './i18n';

export const getPagination = ({ config = {}, headers = {} }) => {
  const xPagination = headers['x-pagination'];

  if (xPagination) {
    const page = (config.params && config.params.page) || 1;
    const pagination = camelizeKeys(JSON.parse(xPagination));

    return {
      ...pagination,
      page: parseInt(page, 10),
      perPage: Math.ceil(pagination.total / pagination.totalPages),
    };
  }
};

export const handleRequest = (config) => {
  const { data, headers, params, ...otherConfigs } = config;

  return {
    ...otherConfigs,
    data: decamelizeKeys(data),
    params: decamelizeKeys(params),
    headers: {
      ...headers,
      Authorization: localStorage.get('authToken') || '',
    },
  };
};

export const handleResponse = (response, store) => {
  const { config, data } = response;
  const { skipCamelize, pagination, url } = config;
  const responsePagination = getPagination(response);

  if (responsePagination) {
    const key = pagination || url.split('/').pop();
    store.dispatch(setPagination({ ...responsePagination, key }));
  }

  return {
    ...response,
    data: skipCamelize ? data : camelizeKeys(data),
  };
};

export const handleReject = (error, store) => {
  const { status, data, config } = error.response;

  switch (status) {
    case 401:
      // The user will be logged out on an unauthorized response error
      // except for a logout api call, to prevent infinite logout dispatches.
      if (config.url !== '/api/logout') {
        store.dispatch(logoutUser(true));
      }
      break;

    case 403:
      store.dispatch(
        showAlert({
          color: 'warning',
          message: `<b>Access Denied</b>: ${data.error}`,
        })
      );
      break;

    case 404:
      localStorage.set('notifier', INVALID_PAGE_MESSAGE);
      window.location.assign('/');
      break;

    case 422:
      store.dispatch(
        showAlert({
          color: 'danger',
          message: `<b>Error</b>: ${translate(HTTP_ERRORS, data.error)}`,
        })
      );
      break;

    case 500:
      store.dispatch(
        showAlert({
          color: 'danger',
          message: `<b>Error</b>: An internal API error occurred.`,
        })
      );
      break;
  }

  return Promise.reject(error.response);
};

export const httpClient = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.MANAGED_APP_API_URL : '/api',
});

httpClient.all = axios.all;

export const connectHttpClient = (store) => {
  httpClient.interceptors.request.use(handleRequest);
  httpClient.interceptors.response.use(
    (response) => handleResponse(response, store),
    (error) => handleReject(error, store)
  );
};

export const httpOauthClient = axios.create({
  baseURL: '/clients',
});

httpOauthClient.interceptors.request.use((config) => {
  config.headers['Authorization'] = localStorage.get('authToken') || '';

  return config;
});
