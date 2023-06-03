import { FETCH } from './constants';

export const fetchSettings = (token) => {
  return { type: FETCH, payload: { token } };
};
