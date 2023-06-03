import { useQuery, useQueryClient } from '@tanstack/react-query';

import { httpClient } from '@app/utils';

const fetchIntentionPaymentStatus = async ({ queryKey }) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const [_key, id] = queryKey;
    const response = await httpClient.get(`intentions/${id}/payment_status`);
    return response.data.intention;
  } catch (error) {
    console.log('error', error);
    throw new Error('Something went wrong');
  }
};

export const useIntentionPaymentStatus = (id) => {
  const queryClient = useQueryClient();
  return useQuery(['intentionPaymentStatus', id], fetchIntentionPaymentStatus, {
    enabled: !!id,
    refetchInterval: 5000,
    onSuccess: (data) => {
      if (data.status === 'completed') {
        queryClient.cancelQueries({ queryKey: ['intentionPaymentStatus', id] });
      }
    },
  });
};

export default useIntentionPaymentStatus;
