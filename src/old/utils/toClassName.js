export const toClassName = (defaults = [], className = '') => {
  const classNames = className?.length ? className.split(' ') : [];
  return defaults.concat(classNames).join(' ');
};
