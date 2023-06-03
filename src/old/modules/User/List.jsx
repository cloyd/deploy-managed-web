import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';

import { CardLight } from '../Card';
import { useContactRole } from '../Contacts/hooks';

export const UserList = (props) => {
  const {
    hasKyc,
    hasStatus,
    loggedInUser,
    matchUrl,
    titleLong,
    type,
    users,
    isIncludeInactiveManagers,
    isFiltered,
  } = props;

  const contactRole = useContactRole(type);
  const filteredUsers =
    contactRole.isManager && !isIncludeInactiveManagers
      ? users.filter((manager) => manager.active)
      : users;

  return (
    <CardLight className="pt-2 pb-1 px-3 mb-3" data-testid="user-list">
      <Table responsive className="m-0">
        <thead>
          <tr>
            <th className="border-top-0 pl-1">
              {contactRole.isBpay ? 'Biller Name' : 'Name'}
            </th>
            <th className="border-top-0 pr-1">
              {contactRole.isBpay ? 'Biller Code' : 'Email'}
            </th>
            {contactRole.isBpay && (
              <th className="border-top-0 pr-1">GST Included</th>
            )}
            {!contactRole.isBpay && (
              <>
                {contactRole.isCreditor && (
                  <th className="border-top-0 pr-1">Company</th>
                )}
                <th className="border-top-0 pr-1">Mobile</th>
                {hasStatus && (
                  <th className="text-center border-top-0">Status</th>
                )}
                {hasKyc && <th className="text-center border-top-0">KYC</th>}
                {!contactRole.isCreditor && (
                  <th className="text-center border-top-0 pr-1">2FA</th>
                )}
              </>
            )}
            <th className="border-top-0">
              <span className="invisible">Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map(
              (user) =>
                user.id && (
                  <UserListRow
                    key={`user-${user.id}`}
                    contactRole={contactRole}
                    hasKyc={hasKyc}
                    hasStatus={hasStatus}
                    isLoggedInUser={user.email === loggedInUser.email}
                    matchUrl={matchUrl}
                    user={user}
                  />
                )
            )
          ) : (
            <tr>
              <td className="pl-1" colSpan={4}>
                {isFiltered
                  ? 'Your search returned no results.'
                  : `Currently no ${titleLong.toLowerCase()} have been added.`}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </CardLight>
  );
};

UserList.propTypes = {
  hasKyc: PropTypes.bool,
  hasStatus: PropTypes.bool,
  loggedInUser: PropTypes.object.isRequired,
  matchUrl: PropTypes.string.isRequired,
  titleLong: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  users: PropTypes.array,
  isIncludeInactiveManagers: PropTypes.bool,
  isFiltered: PropTypes.bool,
};

UserList.defaultProps = {
  hasKyc: false,
  hasStatus: false,
  users: [],
  isFiltered: false,
};

const UserListRow = (props) => {
  const { contactRole, hasKyc, hasStatus, isLoggedInUser, matchUrl, user } =
    props;

  const firstName = user.firstName || user.primaryContactFirstName;
  const lastName = user.lastName || user.primaryContactLastName;
  const name = contactRole.isBpay
    ? user.name
    : `${firstName} ${lastName || ''}`;
  const email = user.email || user.primaryContactEmail;
  const phoneNumber = user.phoneNumber || user.primaryContactMobile;
  const status = user.status || (user.active ? 'Active' : 'Inactive');

  return (
    <tr data-testid="user-list-row">
      <td className="pl-1 text-nowrap">{name}</td>
      {contactRole.isBpay ? (
        <>
          <td className="pr-1">{user.billerCode}</td>
          <td className="pr-1">
            {user.gstIncluded ? (
              <FontAwesomeIcon
                className="text-success"
                icon={['far', 'check-circle']}
              />
            ) : (
              <FontAwesomeIcon
                className="text-danger"
                icon={['far', 'times-circle']}
              />
            )}
          </td>
        </>
      ) : (
        <>
          <td className="pr-1">
            <a href={`mailto:${email}`} className="btn-link">
              {email}
            </a>
          </td>
          {contactRole.isCreditor && (
            <td>{user.promisepayUserPromisepayCompanyLegalName || ''}</td>
          )}
          <td>
            <a href={`tel:${phoneNumber}`} className="btn-link">
              {phoneNumber}
            </a>
          </td>
          {hasStatus && (
            <td className="text-center text-capitalize">
              {status === 'draft' ? 'Awaiting invite' : status}
            </td>
          )}
          {user.kycApproved !== undefined && hasKyc && (
            <td className="text-center">
              {user.kycApproved ? (
                <FontAwesomeIcon
                  className="text-success"
                  icon={['far', 'check-circle']}
                />
              ) : (
                <FontAwesomeIcon
                  className="text-danger"
                  icon={['far', 'times-circle']}
                />
              )}
            </td>
          )}
          {!contactRole.isCreditor && (
            <td className="text-center">
              {user.isAuthyEnabled ? (
                <FontAwesomeIcon
                  className="text-success"
                  icon={['far', 'lock']}
                />
              ) : (
                <FontAwesomeIcon
                  className="text-danger"
                  icon={['far', 'lock-open']}
                />
              )}
            </td>
          )}
        </>
      )}
      <td className="text-right">
        <Link
          to={isLoggedInUser ? '/profile' : `${matchUrl}/${user.id}`}
          className="btn btn-success btn-sm">
          View
        </Link>
      </td>
    </tr>
  );
};

UserListRow.propTypes = {
  contactRole: PropTypes.shape({
    isBpay: PropTypes.bool,
    isCreditor: PropTypes.bool,
  }),
  hasKyc: PropTypes.bool,
  hasStatus: PropTypes.bool,
  isLoggedInUser: PropTypes.bool,
  matchUrl: PropTypes.string.isRequired,
  user: PropTypes.object,
};
