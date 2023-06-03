import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';
import { Container } from 'reactstrap';
import localStorage from 'store';

import { Enable2FA } from '@app/modules/Enable2FA';

import {
  AuthorizeOauthApp,
  Login,
  Logout,
  PageNotFound,
  Properties,
  ResetPassword,
  Tasks,
  TwoFactorAuth,
} from '.';
import { useOnce } from '../hooks';
import { GoogleTagManager } from '../modules/GoogleAPI';
import { RolesContextProvider } from '../modules/Profile';
import { RoutePrivate } from '../modules/Route/Private';
import { Theme } from '../modules/Theme';
import { showSuccess, showWarning } from '../redux/notifier';
import { getRoles, getRouteParams, launchIntercom } from '../redux/profile';
import { USER_TYPES, isSecondaryTenant } from '../redux/users';
import { Billie } from './Billie';
import { Contacts } from './Contacts';
import { Dashboard } from './Dashboard';
import { Marketplace } from './Marketplace';
import { OwnerFinancials } from './OwnerFinancials';
import { Payments } from './Payments';
import {
  AgencyProfile,
  Profile,
  ProfileNotifications,
  ProfilePlans,
} from './Profile';
import { Property, PropertyEdit } from './Property';
import { Reports } from './Reports';
import { AcceptInvite, ConfirmInvite, DdaAgreement } from './WelcomeStep';

const AppComponent = (props) => {
  const {
    isReady,
    isSecondaryTenant,
    launchIntercom,
    profileData,
    roles,
    routeParams,
    settings,
  } = props;

  useOnce(() => {
    const message = localStorage.get('notifier');
    const notifierType = localStorage.get('notifier_type');

    if (message) {
      localStorage.set('notifier');
      if (notifierType && notifierType === 'success') {
        props.showSuccess({ isRedirect: true, message });
      } else {
        props.showWarning({ isRedirect: true, message });
      }
    }
  });

  useEffect(() => {
    profileData.firstName &&
      settings.intercomAppId &&
      launchIntercom(profileData, settings);
  }, [launchIntercom, profileData, settings]);

  // KAN-128: temporarily remove communications link until feature is ready
  // const renderUpcoming = useCallback(
  //   (title) =>
  //     function upcoming() {
  //       return <Upcoming title={title} />;
  //     },
  //   []
  // );

  return (
    <Theme>
      <RolesContextProvider roles={roles}>
        {isReady ? (
          <BrowserRouter>
            <GoogleTagManager />
            <Switch>
              <Route path="/" component={Login} exact />
              <Route path="/authorize" component={AuthorizeOauthApp} exact />
              <Route path="/accept-invite" component={AcceptInvite} exact />
              <Route path="/confirm-invite" component={ConfirmInvite} exact />
              <Route path="/reset-password" component={ResetPassword} exact />
              <Route path="/logout" component={Logout} exact />
              <Route path="/two-factor-auth" component={TwoFactorAuth} exact />
              <Route path="/dda-agreement" component={DdaAgreement} exact />
              <RoutePrivate
                path="/enable-2fa"
                component={Enable2FA}
                {...routeParams}
                exact
              />
              <RoutePrivate
                path="/property"
                component={Properties}
                disallowedRoles={[USER_TYPES.externalCreditor]}
                {...routeParams}
                exact
              />
              <RoutePrivate
                path="/property/create"
                component={PropertyEdit}
                allowedRoles={[USER_TYPES.manager]}
                {...routeParams}
                exact
              />
              <RoutePrivate
                path="/property/:propertyId"
                component={Property}
                disallowedRoles={[USER_TYPES.externalCreditor]}
                {...routeParams}
              />
              {!isSecondaryTenant && (
                <RoutePrivate
                  path="/payments"
                  component={Payments}
                  {...routeParams}
                />
              )}
              <RoutePrivate
                path="/marketplace"
                component={Marketplace}
                disallowedRoles={[
                  USER_TYPES.corporateUser,
                  USER_TYPES.owner,
                  USER_TYPES.tenant,
                ]}
                {...routeParams}
              />
              <RoutePrivate path="/tasks" component={Tasks} {...routeParams} />
              <RoutePrivate
                path="/contacts"
                component={Contacts}
                allowedRoles={[USER_TYPES.manager]}
                {...routeParams}
              />
              <RoutePrivate
                path="/reports"
                component={Reports}
                allowedRoles={[
                  USER_TYPES.principal,
                  USER_TYPES.manager,
                  USER_TYPES.corporateUser,
                ]}
                {...routeParams}
              />
              <RoutePrivate
                path="/billie"
                component={Billie}
                disallowedRoles={[
                  USER_TYPES.corporateUser,
                  USER_TYPES.externalCreditor,
                  USER_TYPES.owner,
                  USER_TYPES.tenant,
                ]}
                classNameMain="billie d-flex flex-column flex-grow-1"
                {...routeParams}
              />
              <RoutePrivate
                path="/profile"
                component={Profile}
                {...routeParams}
                exact
              />
              <RoutePrivate
                path="/profile/agency"
                component={AgencyProfile}
                allowedRoles={[USER_TYPES.principal]}
                exact
                {...routeParams}
              />
              <RoutePrivate
                path="/profile/notifications"
                component={ProfileNotifications}
                allowedRoles={[USER_TYPES.owner, USER_TYPES.tenant]}
              />
              <RoutePrivate
                path="/profile/plans"
                component={ProfilePlans}
                allowedRoles={[USER_TYPES.principal]}
              />
              <RoutePrivate
                path="/financials"
                component={OwnerFinancials}
                allowedRoles={[USER_TYPES.owner]}
              />
              <RoutePrivate
                path="/dashboard"
                component={Dashboard}
                {...routeParams}
                allowedRoles={[USER_TYPES.manager, USER_TYPES.principal]}
                exact
              />
              {/** KAN-128: temporarily remove communications link until feature is ready */}
              {/* <RoutePrivate
                path="/communications"
                component={renderUpcoming('Communications')}
                {...routeParams}
                allowedRoles={[
                  USER_TYPES.corporateUser,
                  USER_TYPES.manager,
                  USER_TYPES.principal,
                ]}
                exact
              /> */}
              <Route component={PageNotFound} />
            </Switch>
          </BrowserRouter>
        ) : (
          <Container className="d-flex flex-column justify-content-center align-items-center h-100 w-100">
            <PulseLoader color="#dee2e6" />
          </Container>
        )}
      </RolesContextProvider>
    </Theme>
  );
};

AppComponent.propTypes = {
  isReady: PropTypes.bool.isRequired,
  isSecondaryTenant: PropTypes.bool.isRequired,
  roles: PropTypes.array,
  routeParams: PropTypes.object,
  showWarning: PropTypes.func.isRequired,
  showSuccess: PropTypes.func,
  profileData: PropTypes.object,
  launchIntercom: PropTypes.func,
  settings: PropTypes.object,
};

const mapStateToProps = ({ profile, users, settings }) => ({
  roles: getRoles(profile),
  routeParams: getRouteParams(profile),
  profileData: profile.data,
  settings: settings,
  isSecondaryTenant: isSecondaryTenant(users, profile.data.id),
});

const mapDispatchToProps = {
  launchIntercom,
  showWarning,
  showSuccess,
};

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

// export const App = () => {
//   return (
//     <div className="h-100 w-100">
//       <BrowserRouter>
//         <Switch>
//           <Route path="/" component={Login} exact />
//           <Route component={PageNotFound} />
//         </Switch>
//       </BrowserRouter>
//     </div>
//   );
// };
