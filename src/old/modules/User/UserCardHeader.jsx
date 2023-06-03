import PropTypes from 'prop-types';
import React from 'react';
import { CardHeader, CardTitle } from 'reactstrap';

import { UserStatus } from './UserStatus';

// KAN-171 removed the invitation feature, but mostlikely needed in the future */
export const UserCardHeader = ({ user, type, children }) => {
  // const dispatch = useDispatch();
  // const { isPrincipal, isManager } = useRolesContext();

  // const isAgencyUser = isPrincipal || isManager;

  // const invitationText = useMemo(
  //   () => (user.status === 'draft' ? 'Send Invitation' : 'Resend Invitation'),
  //   [user.status]
  // );

  // const handleSendInvite = useCallback(
  //   (e) => {
  //     e.preventDefault();
  //     dispatch(sendInvite({ role: type, user }));
  //   },
  //   [dispatch, type, user]
  // );

  return (
    <CardHeader className="d-flex justify-content-between bg-white border-400">
      <div className="d-flex">
        <CardTitle className="mb-0 mr-2" tag="h5">
          Account Details
        </CardTitle>
        <UserStatus status={user.status} />
      </div>

      <div data-testid="header-action-bar">
        {children}
        {/* KAN-171 removed the invitation feature, but mostlikely needed in the future */}
        {/* {user?.status && invitationText && isAgencyUser && (
          <Button
            className="ml-2"
            color="secondary"
            data-testid="contacts-send-invite-btn"
            size="sm"
            type="button"
            onClick={handleSendInvite}>
            {invitationText}
          </Button>
        )} */}
      </div>
    </CardHeader>
  );
};

UserCardHeader.propTypes = {
  user: PropTypes.object,
  type: PropTypes.string,
  children: PropTypes.node,
};

UserCardHeader.defaultProps = {
  user: {},
};

export default UserCardHeader;
