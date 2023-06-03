import { byAlpha3 } from 'iso-country-codes';

export const CONFIRM = '@@app/profile/CONFIRM';
export const CONFIRM_SUCCESS = '@@app/profile/CONFIRM_SUCCESS';
export const CREATE_AVATAR = '@@app/profile/CREATE_AVATAR';
export const CREATE_AVATAR_SUCCESS = '@@app/profile/CREATE_AVATAR_SUCCESS';
export const CREATE_SIGNATURE = '@@app/profile/CREATE_SIGNATURE';
export const DELETE_AVATAR = '@@app/profile/DELETE_AVATAR';
export const DISABLE_AUTHY = '@@app/profile/DISABLE_AUTHY';
export const DISABLE_AUTHY_SUCCESS = '@@app/profile/DISABLE_AUTHY_SUCCESS';
export const ENABLE_AUTHY = '@@app/profile/ENABLE_AUTHY';
export const ENABLE_AUTHY_SUCCESS = '@@app/profile/ENABLE_AUTHY_SUCCESS';
export const ERROR = '@@app/profile/ERROR';
export const FETCH = '@@app/profile/FETCH';
export const FETCH_SESSION_TIMEOUT = '@@app/profile/FETCH_SESSION_TIMEOUT';
export const FETCH_SESSION_TIMEOUT_SUCCESS =
  '@@app/profile/FETCH_SESSION_TIMEOUT_SUCCESS';
export const FETCH_SUCCESS = '@@app/profile/FETCH_SUCCESS';
export const LAUNCH_INTERCOM = '@@app/profile/LAUNCH_INTERCOM';
export const LOGIN = '@@app/profile/LOGIN';
export const LOGIN_SUCCESS = '@@app/profile/LOGIN_SUCCESS';
export const LOGOUT = '@@app/profile/LOGOUT';
export const LOGOUT_SUCCESS = '@@app/profile/LOGOUT_SUCCESS';
export const ONBOARDED = '@@app/profile/ONBOARDED';
export const ONBOARDED_SUCCESS = '@@app/profile/ONBOARDED_SUCCESS';
export const RESET = '@@app/profile/RESET';
export const RESET_SUCCESS = '@@app/profile/RESET_SUCCESS';
export const REQUEST_AUTHY_SMS = '@@app/profile/REQUEST_AUTHY_SMS';
export const REQUEST_AUTHY_SMS_ERROR = '@@app/profile/REQUEST_AUTHY_SMS_ERROR';
export const SEND_KEEP_ALIVE = '@@app/profile/SEND_KEEP_ALIVE';
export const SEND_KEEP_ALIVE_SUCCESS = '@@app/profile/SEND_KEEP_ALIVE_SUCCESS';
export const SET_AUTH_TOKEN = '@@app/profile/SET_AUTH_TOKEN';
export const SUCCESS = '@@app/profile/SUCCESS';
export const VERIFY_AUTHY = '@@app/profile/VERIFY_AUTHY';
export const VERIFY_AUTHY_ERROR = '@@app/profile/VERIFY_AUTHY_ERROR';
export const VERIFY_AUTHY_SUCCESS = '@@app/profile/VERIFY_AUTHY_SUCCESS';
export const UPDATE_PROFILE = '@@app/profile/UPDATE_PROFILE';

export const COUNTRY_CODES = byAlpha3;

export const DISBURSEMENT_FREQUENCIES = Object.freeze([
  { name: 'instant_withdrawal', label: 'Instant' },
  { name: 'weekly_withdrawal', label: 'Weekly' },
  { name: 'monthly_withdrawal', label: 'Monthly' },
]);
