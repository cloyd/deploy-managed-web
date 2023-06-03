import { RESET, SET } from './constants';

export const setPagination = ({ key, ...data }) => {
  return {
    type: SET,
    payload: { key, data },
  };
};

export const resetPagination = () => {
  return { type: RESET };
};
