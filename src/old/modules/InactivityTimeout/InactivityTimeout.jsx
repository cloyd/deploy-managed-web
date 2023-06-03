import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import { useIsOpen } from '../../hooks';
import { ModalConfirm } from '../../modules/Modal';

const SESSION_TIMEOUT = 1200;
const SHOW_POPUP_TIME = 120;
const FETCH_SESSION_TIMEOUT_INTERVAL = 60000;
const UPDATE_SESSION_TIMEOUT_INTERVAL = 5;

export const InactivityTimeout = ({
  fetchSessionTimeout,
  handleIdleTimeout,
  sendKeepAlive,
  sessionTimeout,
}) => {
  const [isOpen, actions] = useIsOpen();
  const [remainingTime, setRemainingTime] = useState(SESSION_TIMEOUT);
  const [isLoggingOut, setIsLoggingOut] = useState();

  // Fetch session timeout from BE every 1 minute
  useEffect(() => {
    fetchSessionTimeout();
    const id = setInterval(fetchSessionTimeout, FETCH_SESSION_TIMEOUT_INTERVAL);

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [fetchSessionTimeout]);

  // Update local session timeout every 5 seconds
  useEffect(() => {
    const id = setInterval(
      () =>
        setRemainingTime(
          (remainingTime) => remainingTime - UPDATE_SESSION_TIMEOUT_INTERVAL
        ),
      UPDATE_SESSION_TIMEOUT_INTERVAL * 1000
    );

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, []);

  // Logout only if BE session timeout expired
  useEffect(() => {
    setRemainingTime(sessionTimeout);
    if (sessionTimeout <= 0) {
      handleIdleTimeout();
    }
  }, [handleIdleTimeout, sessionTimeout]);

  // Revert loggingout state if BE session timeout has not yet expired
  useEffect(() => {
    if (sessionTimeout > 0 && isLoggingOut) {
      setIsLoggingOut(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionTimeout]);

  useEffect(() => {
    if (remainingTime > SHOW_POPUP_TIME && isOpen) {
      // Close logout warning popup when session from another tab is resumed
      actions.handleClose();
    } else if (remainingTime <= SHOW_POPUP_TIME && !isOpen) {
      actions.handleOpen();
    } else if (remainingTime <= 0 && !isLoggingOut) {
      // Fetch BE session timeout before logging out
      fetchSessionTimeout();
      setIsLoggingOut(true);
    }
  }, [actions, fetchSessionTimeout, isLoggingOut, isOpen, remainingTime]);

  const onSubmit = useCallback(() => {
    sendKeepAlive();
    setRemainingTime(SESSION_TIMEOUT);
    actions.handleClose();
  }, [actions, sendKeepAlive]);

  return (
    <ModalConfirm
      isOpen={isOpen}
      title="Are you still there"
      btnSubmit={{ text: 'Continue my session.' }}
      onSubmit={onSubmit}>
      You are going to be logged out due to inactivity.
    </ModalConfirm>
  );
};

InactivityTimeout.propTypes = {
  fetchSessionTimeout: PropTypes.func,
  handleIdleTimeout: PropTypes.func,
  sendKeepAlive: PropTypes.func,
  sessionTimeout: PropTypes.number,
};
