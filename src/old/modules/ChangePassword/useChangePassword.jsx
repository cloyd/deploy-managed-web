import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { httpClient } from '@app/utils';

import { logoutUser } from '../../redux/profile';

export const QUERY_KEYS = {
  CHANGE_PASSWORD: 'changePassword',
};

const changePassword = async (params) => {
  const body = {
    email: params.email,
    currentPassword: params.currentPassword,
    password: params.password,
    passwordConfirmation: params.passwordConfirmation,
  };

  try {
    const response = await httpClient.post('user/change-password', body);
    return response.data;
  } catch (error) {
    console.log('error', error);
    throw new Error('Something went wrong');
  }
};

export const useChangePassword = () => {
  const dispatch = useDispatch();

  return useMutation(changePassword, {
    mutationKey: QUERY_KEYS.CHANGE_PASSWORD,
    onSuccess: (_data) => {
      dispatch(
        logoutUser(false, 'Your password has been successfully updated.')
      );
    },
    onError: (error) => error,
  });
};

export default useChangePassword;
