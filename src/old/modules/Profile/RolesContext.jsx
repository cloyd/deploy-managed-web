import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';

import { USER_TYPES } from '../../redux/users';

// TODO: Add isAgencyUser role and reuse through the application
const DEFAULT_ROLES = {
  isCorporateUser: false,
  isExternalCreditor: false,
  isManager: false,
  isOwner: false,
  isPrincipal: false,
  isTenant: false,
};

const RolesContext = React.createContext(DEFAULT_ROLES);

/**
 * Context provider for logged in user's roles
 *
 * @param {string[]} props.roles array of user's profile roles
 */
export const RolesContextProvider = (props) => {
  const roles = props.roles || [];

  const value = useMemo(
    () => ({
      isCorporateUser: roles.includes(USER_TYPES.corporateUser),
      isExternalCreditor: roles.includes(USER_TYPES.externalCreditor),
      isManager: roles.includes(USER_TYPES.manager),
      isOwner: roles.includes(USER_TYPES.owner),
      isPrincipal: roles.includes(USER_TYPES.principal),
      isTenant: roles.includes(USER_TYPES.tenant),
    }),
    [roles]
  );

  return (
    <RolesContext.Provider value={value}>
      {props.children}
    </RolesContext.Provider>
  );
};

RolesContextProvider.propTypes = {
  children: PropTypes.node,
  roles: PropTypes.array,
};

/**
 * Hook that returns logged in user's roles
 */
export const useRolesContext = () => {
  const context = useContext(RolesContext);
  return context || DEFAULT_ROLES;
};
