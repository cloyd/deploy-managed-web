import { useMutation } from '@tanstack/react-query';

import { httpClient } from '@app/utils';

const requestSecurityCode = async (body) => {
  try {
    const response = await httpClient.post('user/request-authy-sms', body);
    return response.data;
  } catch (error) {
    console.log('error', error);
    throw new Error('Something went wrong');
  }
};

export const useSendSecurityCode = () => {
  return useMutation(requestSecurityCode, {
    mutationKey: 'request_security_code',
  });
};

export default useSendSecurityCode;
