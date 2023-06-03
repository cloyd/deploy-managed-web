export const HTTP_ERRORS = {
  password_reset_token_invalid_or_expired:
    "Oops - there's a problem with that. If you're trying to log in, <a href='/'>click here.</a>",
};

export const translate = (errors, key, defaultMessage) => {
  return errors[key] || defaultMessage || key;
};
