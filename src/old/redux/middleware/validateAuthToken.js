import localStorage from 'store';

const IGNORED_ACTIONS_REGEX = new RegExp(
  [
    'SUCCESS',
    'notifier/(showAlert|hideAlert)',
    'pagination/SET',
    'settings/(FETCH|ERROR|SUCCESS)',
    'profile/(LOGIN|LOGOUT|REQUEST_AUTHY_SMS|REQUEST_AUTHY_SMS_ERROR|VERIFY_AUTHY|VERIFY_AUTHY_ERROR)',
  ].join('|')
);

// Middleware that checks on each dispatch whether the redux store authToken matches the localStorage authToken
export const validateAuthToken = (store) => (next) => (action) => {
  if (action.type && !action.type.match(IGNORED_ACTIONS_REGEX)) {
    const { profile } = store.getState();
    const { authToken } = profile || {};

    if (authToken && authToken !== localStorage.get('authToken')) {
      // If user is logged in and authTokens don't match, then force redirect as they are logged in on another tab
      window.location.replace('/');
      return;
    }
  }

  next(action);
};
