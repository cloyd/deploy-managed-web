import keyBy from 'lodash/fp/keyBy';
import lowerCase from 'lodash/fp/lowerCase';
import pick from 'lodash/fp/pick';

import { showAlert } from '../notifier';
import { UPDATE_PROFILE } from '../profile/constants';

export const getData = async (response) => {
  return getValue('data')(await response);
};

export const getDataWithProps = async (response) => {
  const payload = await response;

  return {
    data: payload.response.data,
    props: payload.props,
  };
};

export const getValue =
  (key = '') =>
  async (response) => {
    return pick(key, await response);
  };

export const normalize =
  (key = 'id') =>
  async (response) => {
    const { data, ...rest } = await response;
    return {
      ...rest,
      data: { [data[key]]: data },
      result: data[key],
    };
  };

export const normalizeArray =
  (key = 'id') =>
  async (response) => {
    const { data, ...rest } = await response;
    return {
      ...rest,
      data: keyBy(key, data),
      result: data.map((item) => item[key]),
    };
  };

export const processDelete = async ({ action, httpClient }) => {
  const { endpoint, params } = action.payload;
  const response = await httpClient.delete(endpoint);
  return { ...response, data: { id: params.id } };
};

export const processDeleteWithProps = async ({ action, httpClient }) => {
  const { endpoint, props } = action.payload;
  const response = await httpClient.delete(endpoint);
  return { props, response };
};

export const processError = ({ action }, dispatch, done) => {
  const { payload } = action || {};
  const { props } = payload;
  const message =
    payload.message || props?.message || lowerCase(payload.data?.error);

  if (message) {
    dispatch(
      showAlert({
        color: 'danger',
        isRedirect: payload.isRedirect || props?.isRedirect,
        message: `<strong>Error:</strong> ${message}`,
      })
    );
  }

  done();
};

export const processGet = async ({ action, httpClient }) => {
  const { endpoint, params } = action.payload;
  const response = await httpClient.get(endpoint, { params });
  return response;
};

export const processGetWithProps = async ({ action, httpClient }) => {
  const { endpoint, params, props } = action.payload;
  const response = await httpClient.get(endpoint, { params });
  return { props, response };
};

export const processPatchWithProps = async ({ action, httpClient }) => {
  const { endpoint, params, props } = action.payload;
  const response = await httpClient.patch(endpoint, params);
  return { props, response };
};

export const processPost = async ({ action, httpClient }) => {
  const { endpoint, params } = action.payload;
  const response = await httpClient.post(endpoint, params);
  return response;
};

export const processPostWithProps = async ({ action, httpClient }) => {
  const { endpoint, params, props } = action.payload;
  const response = await httpClient.post(endpoint, params);
  return { props, response };
};

export const processPut = async ({ action, httpClient }) => {
  const { endpoint, params } = action.payload;
  const response = await httpClient.put(endpoint, params);
  return response;
};

export const processPutWithProps = async ({ action, httpClient }) => {
  const { endpoint, params, props } = action.payload;
  const response = await httpClient.put(endpoint, params);
  return { props, response };
};

export const processSuccess = ({ action, getState }, dispatch, done) => {
  const { payload } = action || {};
  const { props } = payload;

  // quick fix to sync users data and profile data
  if (action && action.type === 'users/updateSuccess') {
    const profileState = getState().profile;

    const { data, props } = payload;

    const updatedUser = data[props?.type] || null;

    if (updatedUser && profileState.data.id === updatedUser.id) {
      dispatch({
        type: UPDATE_PROFILE,
        payload: { data: updatedUser },
      });
    }
  }

  const message = payload.message || (props && props.message);

  if (message) {
    dispatch(
      showAlert({
        color: 'success',
        isRedirect: payload.isRedirect || (props && props.isRedirect),
        message: `<strong>Success:</strong> ${message}`,
      })
    );
  }

  done();
};

export const setData =
  (key = '') =>
  async (response) => {
    const { data, ...rest } = await response;
    return setValue({ ...rest, data: data[key] })(response);
  };

export const setMessage =
  (message = '') =>
  async (response) => {
    return setValue({ message })(await response);
  };

export const setValue =
  (obj = {}) =>
  async (response) => {
    return { ...(await response), ...obj };
  };
