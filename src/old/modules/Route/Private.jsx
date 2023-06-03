import intersection from 'lodash/fp/intersection';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import localStorage from 'store';

import { MobileNavHeader, Navigation } from '../../containers';
import { useIsMobile } from '../../hooks';
import { selectProfileData } from '../../redux/profile';

export const RoutePrivate = ({
  classNameMain,
  component: Component,
  pathname,
  ...routeProps
}) => {
  const { isEnable2faOnLoginEnabled } = useSelector(selectProfileData);
  const isMobile = useIsMobile();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleClickNavIcon = useCallback(
    () => setIsNavOpen(!isNavOpen),
    [isNavOpen]
  );

  useEffect(() => {
    if (isMobile) {
      setIsNavOpen(false);
    }
  }, [isMobile]);

  function render(props) {
    const { location, allowedRoles, disallowedRoles, roles } = routeProps;
    let redirectPathname = pathname || null;

    if (isEnable2faOnLoginEnabled && location.pathname !== '/enable-2fa') {
      redirectPathname = '/enable-2fa';
    }

    // Set login redirect
    if (pathname && pathname !== location.pathname) {
      const { pathname, search } = location;
      localStorage.set('redirectTo', pathname + search);
    }

    // Set redirect for users without allowed roles
    if (
      roles &&
      ((allowedRoles && intersection(allowedRoles, roles).length === 0) ||
        (disallowedRoles && intersection(disallowedRoles, roles).length !== 0))
    ) {
      redirectPathname = '/';
    }

    return redirectPathname ? (
      <Redirect
        to={{ pathname: redirectPathname, state: { from: props.location } }}
      />
    ) : (
      <>
        {isEnable2faOnLoginEnabled ? (
          <Component {...props} />
        ) : (
          <main className={`${classNameMain} h-100`}>
            {isMobile && (
              <MobileNavHeader
                isNavOpen={isNavOpen}
                handleClickNavIcon={handleClickNavIcon}
              />
            )}
            <div className="h-100 d-flex flex-row overflow-auto">
              <Navigation
                isNavOpen={!isMobile || isNavOpen}
                handleClickNavIcon={handleClickNavIcon}
              />
              <div className="w-100 h-100 d-flex flex-column">
                <Component {...props} />
                <Footer />
              </div>
            </div>
          </main>
        )}
      </>
    );
  }

  return <Route {...routeProps} render={render} />;
};

RoutePrivate.propTypes = {
  isRedirect: PropTypes.bool,
  classNameMain: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
  pathname: PropTypes.string,
};

RoutePrivate.defaultProps = {
  classNameMain: '',
};

const Footer = () => (
  <footer className="footer text-center text-muted bg-white d-print-none w-100 mt-auto">
    <div className="py-3">
      &#x24B8; Managed Platforms Pty Ltd 2018
      <br />
      <a
        className="btn-link ml-1"
        href="https://www.managedapp.com.au/terms-conditions"
        target="_blank"
        rel="noopener noreferrer">
        Terms &amp; Conditions
      </a>
      <span className="mx-2">|</span>
      <a
        className="btn-link"
        href="https://www.managedapp.com.au/privacy"
        target="_blank"
        rel="noopener noreferrer">
        Privacy Policy
      </a>
      <span className="mx-2">|</span>
      <a
        id="intercom_launcher"
        className="btn-link"
        href="#"
        target="_blank"
        rel="noopener noreferrer">
        Support
      </a>
    </div>
  </footer>
);
