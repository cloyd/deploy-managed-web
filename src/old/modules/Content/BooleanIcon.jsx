import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import { toClassName } from '../../utils';

export const ContentBooleanIcon = ({ className, value }) =>
  value ? (
    <FontAwesomeIcon
      className={toClassName(['text-success'], className)}
      icon={['far', 'check']}
    />
  ) : (
    <FontAwesomeIcon
      className={toClassName(['text-danger'], className)}
      icon={['far', 'times']}
    />
  );

ContentBooleanIcon.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line react/boolean-prop-naming
  value: PropTypes.bool,
};
