import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import { toClassName } from '../../utils';

const ICONS = {
  entered: {
    icon: ['far', 'search'],
    className: 'text-secondary',
  },

  completed: {
    icon: ['far', 'check'],
    className: 'text-success',
  },

  draft: {
    icon: ['fas', 'edit'],
    className: 'text-muted',
  },

  emergency: {
    icon: ['far', 'exclamation-triangle'],
    className: 'text-danger',
  },

  high: {
    icon: ['far', 'chevron-double-up'],
    className: 'text-danger',
  },

  scheduled: {
    icon: ['far', 'sync-alt'],
    className: 'text-primary',
  },

  sending_invoice: {
    icon: ['far', 'paper-plane'],
    className: 'text-secondary',
  },

  invoiced: {
    icon: ['far', 'dollar-sign'],
    className: 'text-secondary',
  },

  low: {
    icon: ['far', 'chevron-down'],
    className: 'text-muted',
  },

  normal: {
    icon: ['far', 'chevron-up'],
    className: 'text-primary',
  },

  declined: {
    icon: ['far', 'times'],
    className: 'text-danger',
  },

  quoting: {
    icon: ['far', 'file-invoice-dollar'],
    className: 'text-primary',
  },

  awaiting_approval: {
    icon: ['far', 'comment'],
    className: 'text-primary',
  },

  awaiting_signatures: {
    icon: ['far', 'comment'],
    className: 'text-primary',
  },

  assigned_to_tradie: {
    icon: ['far', 'hammer'],
    className: 'text-primary',
  },

  accepted: {
    icon: ['far', 'thumbs-up'],
    className: 'text-success',
  },

  approved: {
    icon: ['far', 'clipboard-check'],
    className: 'text-success',
  },

  awaiting_payment: {
    icon: ['far', 'file-invoice-dollar'],
    className: 'text-danger',
  },

  custom: {
    icon: ['far', 'star'],
    className: 'text-muted',
  },

  followers_notified: {
    icon: ['far', 'bell'],
    className: 'text-muted',
  },
};

export const TaskIcon = ({ children, value }) => {
  const iconProps = ICONS[value];
  return iconProps ? (
    <span className={toClassName(['d-flex flex-row'], iconProps.className)}>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ width: '20px' }}>
        <FontAwesomeIcon {...iconProps} />
      </div>
      <span className="text-capitalize ml-1 text-truncate">{children}</span>
    </span>
  ) : null;
};

TaskIcon.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
};
