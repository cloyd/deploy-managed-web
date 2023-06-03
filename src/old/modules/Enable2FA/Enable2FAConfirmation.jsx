/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Button } from 'reactstrap';

export const Enable2FAConfirmation = () => {
  const onClick = () => {
    window.location.assign('/');
  };

  return (
    <>
      <span>
        Your number has been verified. You will now be logged out of the current
        session and are able to login using 2FA.
      </span>
      <div className="mt-4 d-flex justify-content-end">
        <Button
          color="secondary"
          id="logout-user"
          data-testid="logout-user"
          onClick={onClick}>
          Logout
        </Button>
      </div>
    </>
  );
};
