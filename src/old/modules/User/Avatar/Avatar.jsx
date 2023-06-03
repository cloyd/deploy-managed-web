import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import kebabCase from 'lodash/fp/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';

export const UserAvatar = (props) => {
  const { isActive, user, ...otherProps } = props;
  const { avatarUrl } = user;
  const role = user.role || props.role;

  return (
    <span style={{ fontSize: `${props.size}rem` }} {...otherProps}>
      <span className="fa-2x">
        {avatarUrl ? (
          <span className="fa-layers fa-fw">
            <img
              className="fa-layers-text fa-inverse w-100 h-auto overflow-hidden rounded-circle border"
              src={avatarUrl}
              title="user"
            />
          </span>
        ) : (
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon
              icon={['fas', 'circle']}
              className={role ? `text-${kebabCase(role)}` : ''}
            />
            <FontAwesomeIcon
              icon={['far', isActive ? 'user' : 'exclamation']}
              transform="shrink-7"
              className="text-white"
            />
          </span>
        )}
      </span>
    </span>
  );
};

UserAvatar.propTypes = {
  isActive: PropTypes.bool,
  role: PropTypes.string,
  size: PropTypes.number,
  user: PropTypes.object,
};

UserAvatar.defaultProps = {
  isActive: true,
  role: 'tenant',
  size: 1,
  user: {},
};
