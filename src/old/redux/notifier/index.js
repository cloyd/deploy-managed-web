import notifier from './reducer';

// Actions
export const showAlert = notifier.actions.showAlert;
export const showError = notifier.actions.showError;
export const showSuccess = notifier.actions.showSuccess;
export const showWarning = notifier.actions.showWarning;
export const hideAlert = notifier.actions.hideAlert;
export const showLoading = notifier.actions.showLoading;
export const hideLoading = notifier.actions.hideLoading;
export const resetIsRedirect = notifier.actions.resetIsRedirect;

// Consts
export {
  INACTIVITY_TIMEOUT_MESSAGE,
  INVALID_ONBOARD_MESSAGE,
  INVALID_PAGE_MESSAGE,
} from './constants';

// Selectors
export { getNotifier, hasError, hasWarning, selectNotifier } from './selectors';

// Reducer
export default notifier.reducer;
