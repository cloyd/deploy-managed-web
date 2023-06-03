import { FETCH, FETCH_ALL, UPDATE } from './constants';

export const fetchAgency = ({ agencyId }) => {
  return {
    type: FETCH,
    payload: { id: agencyId },
  };
};

export const fetchAgencies = ({
  search,
  ransackParams,
  type,
  page = 0,
  perPage,
}) => {
  const searchParams = {};

  if (search && ransackParams) {
    Object.keys(ransackParams).map((key) => {
      searchParams[`q[${key}_${ransackParams[key]}]`] = search;
    });
  }

  const params = {
    ...searchParams,
    page,
    perPage,
  };

  return {
    type: FETCH_ALL,
    payload: {
      type,
      params,
    },
  };
};

export const updateAgency = (payload) => {
  return {
    type: UPDATE,
    payload,
  };
};
