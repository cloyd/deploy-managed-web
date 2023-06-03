import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { Link } from '../../modules/Link';
import { LogoLink, NavIcon } from '../../modules/Nav';
import { UserAvatar } from '../../modules/User';
import { getProfile } from '../../redux/profile';

export const MobileNavHeaderComponent = ({
  handleClickNavIcon,
  isNavOpen,
  user,
}) => {
  const handleClickProfile = useCallback(() => {
    if (isNavOpen) {
      handleClickNavIcon();
    }
  }, [handleClickNavIcon, isNavOpen]);

  return (
    <div className="d-flex flex-row justify-content-between w-100 p-2">
      <NavIcon isNavOpen={isNavOpen} handleClickNavIcon={handleClickNavIcon} />
      <LogoLink />
      <Link
        className="d-flex align-items-center"
        onClick={handleClickProfile}
        to="/profile">
        <UserAvatar className="mr-1" user={user} />
      </Link>
    </div>
  );
};

MobileNavHeaderComponent.propTypes = {
  handleClickNavIcon: PropTypes.func,
  isNavOpen: PropTypes.bool,
  user: PropTypes.object,
};

MobileNavHeaderComponent.defaultProps = {
  user: {},
};

const mapStateToProps = ({ profile }) => ({
  user: getProfile(profile),
});

export const MobileNavHeader = connect(mapStateToProps)(
  MobileNavHeaderComponent
);
