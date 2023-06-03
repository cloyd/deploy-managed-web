import get from 'lodash/fp/get';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import localStorage from 'store';

import { usePrevious } from '../../hooks';
import { getProfile } from '../../redux/profile';
import { getUser } from '../../redux/users';
import { toQueryObject } from '../../utils';

const STORE_KEY = 'agencyId';

export const setTheme = (agencyId) => {
  agencyId && localStorage.set(STORE_KEY, agencyId);
};

export const ThemeComponent = ({ children, user, ...props }) => {
  const agencyId = useMemo(() => {
    return (
      toQueryObject(window.location.search).agencyId ||
      localStorage.get(STORE_KEY) ||
      get('agency.id', user)
    );
  }, [user]);

  const agencyIdPrev = usePrevious(agencyId);

  useEffect(() => {
    if (agencyId !== agencyIdPrev) {
      document.documentElement.classList.add(`theme-${agencyId}`);
      document.documentElement.classList.remove(`theme-${agencyIdPrev}`);
      setTheme(agencyId);
    }
  }, [agencyId, agencyIdPrev]);

  return children;
};

ThemeComponent.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: getUser(state.users, getProfile(state.profile)),
});

export const Theme = connect(mapStateToProps)(ThemeComponent);
