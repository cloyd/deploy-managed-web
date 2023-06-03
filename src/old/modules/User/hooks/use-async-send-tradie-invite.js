import { camelizeKeys } from 'humps';
import { useCallback, useState } from 'react';

import { useAxiosInstance } from '../../../hooks';
import { decorateTaskCreditorData } from '../../../redux/task';
import { USER_TYPES, getEndpointType } from '../../../redux/users';

const ENDPOINT = `/${getEndpointType(USER_TYPES.externalCreditor)}/send-invite`;

/**
 * Async call for send tradie invite endpoint /api/external-creditors/send-invite
 *
 * Use this hook when custom error handling is needed - in general we should send
 * invites via the redux store.
 */
export const useAsyncSendTradieInvite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [errorData, setErrorData] = useState(null);
  const axiosInstance = useAxiosInstance();

  const handleResetTradieInvite = useCallback(() => {
    setData(null);
    setErrorData(null);
  }, []);

  const handleSendTradieInvite = useCallback(
    (values, initialParams = {}) => {
      async function fetchItems() {
        try {
          const params = { ...values, ...initialParams };
          const response = await axiosInstance.post(ENDPOINT, params);

          setData(
            response.data
              ? processData(response.data[USER_TYPES.externalCreditor])
              : null
          );
        } catch (error) {
          if (error.response && error.response.data) {
            if (error.response.data[USER_TYPES.externalCreditor]) {
              setErrorData(
                processData(error.response.data[USER_TYPES.externalCreditor])
              );
            } else {
              setErrorData('Invalid address.');
            }
          } else {
            setErrorData('Something went wrong.');
          }
          setData(null);
        }

        setIsLoading(false);
      }

      if (!isLoading) {
        setIsLoading(true);
        setErrorData(null);
        fetchItems();
      }
    },
    [axiosInstance, isLoading]
  );

  return [
    handleSendTradieInvite,
    {
      errorInvitedTradie: errorData,
      handleResetTradieInvite,
      invitedTradie: data,
      isLoading,
    },
  ];
};

const processData = (data) => {
  const tradie = camelizeKeys(data);
  return decorateTaskCreditorData([tradie])[0];
};
