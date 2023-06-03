import { useQuery } from '@tanstack/react-query';

import {
  EXTERNAL_CREDITOR_CLASSIFICATIONS,
  USER_TYPES,
  getEndpointType,
} from '@app/redux/users';
import { ransackUsers } from '@app/redux/users/logic';
import { httpClient } from '@app/utils';

export const QUERY_KEYS = {
  USERS: 'users',
};

const getUsers = async ({
  type,
  params = {
    page: 1,
  },
}) => {
  const endpoint = getEndpointType(type);

  const queryParams = { type, ...params };

  if (type === USER_TYPES.externalCreditor) {
    queryParams.classification =
      EXTERNAL_CREDITOR_CLASSIFICATIONS.serviceProvider;
  }

  try {
    const response = await httpClient.get(endpoint, {
      params: ransackUsers(queryParams),
    });

    return response?.data;
  } catch (error) {
    console.log('error', error);
    throw new Error('Something went wrong');
  }
};

export const useUsers = ({ type, params }) =>
  useQuery([QUERY_KEYS.USERS, type, params], () => getUsers({ params, type }), {
    keepPreviousData: true,
  });
