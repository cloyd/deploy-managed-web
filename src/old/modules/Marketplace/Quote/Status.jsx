import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';

import {
  QUOTE_ACCEPTED_STATUSES,
  QUOTE_STATUSES,
} from '../../../redux/marketplace';
import { toClassName } from '../../../utils';

export const QuoteStatus = ({ className, status }) => (
  <span
    className={toClassName(
      [className],
      [...QUOTE_ACCEPTED_STATUSES, QUOTE_STATUSES.awaitingAcceptance].includes(
        status
      )
        ? 'text-success'
        : status === QUOTE_STATUSES.declined
        ? 'text-danger'
        : status === QUOTE_STATUSES.quoting
        ? 'text-secondary'
        : ''
    )}>
    {startCase(status)}
  </span>
);

QuoteStatus.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string,
};
