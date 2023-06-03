export const formatError = (error, defaultMessage = '') => {
  if (error && error.response && error.response.data) {
    let { message, code } = error.response.data;
    message = uniformFullStop(message || defaultMessage);
    return code ? `${message} Error(${code})` : message;
  }
  return uniformFullStop(defaultMessage);
};

const uniformFullStop = (message) => {
  message = `${message}`.replace(/\.$/, '');
  return message === '' ? '' : `${message}.`;
};
