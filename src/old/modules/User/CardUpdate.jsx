import PropTypes from 'prop-types';
import React from 'react';
import { CardBody } from 'reactstrap';

import { CardLight } from '../Card';
import { UserAvatar } from '../User';

export const UserCardUpdate = ({ title, description, disabled }) => (
  <CardLight className="mb-3">
    <CardBody className="d-flex p-2 p-md-3">
      <div className="d-flex flex-column justify-content-center">
        <UserAvatar className={disabled ? 'opacity-50' : ''} size={2} />
      </div>
      <div className="d-flex flex-column justify-content-center w-100 pl-3">
        <p className="mb-0">
          <strong className="md-font-size">{title}</strong>
        </p>
        <span className="text-muted">{description}</span>
      </div>
    </CardBody>
  </CardLight>
);

UserCardUpdate.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  disabled: PropTypes.bool,
};
