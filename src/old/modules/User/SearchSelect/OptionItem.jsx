import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import { toClassName } from '../../../utils';

/**
 * A result (option) from user search
 */
export const OptionItem = ({ className, isDisabled, onClick, option }) => (
  <Button
    className={toClassName(
      ['user-search-dropdown-item p-2 text-dark'],
      className
    )}
    color="link"
    disabled={isDisabled}
    tabIndex="0"
    onClick={onClick(option)}>
    <h6 className="text-left">
      {option.promisepayUserPromisepayCompanyLegalName ||
        option.label ||
        option.name}
    </h6>
    <div className="text-left text-muted">
      {option.primaryContactEmail && (
        <>
          <FontAwesomeIcon
            className="mr-1"
            icon={['far', 'envelope']}
            size="xs"
          />
          <small>{option.primaryContactEmail}</small>
        </>
      )}
      {option.primaryContactMobile && (
        <>
          <FontAwesomeIcon
            className="ml-3 mr-1"
            icon={['far', 'phone']}
            size="xs"
          />
          <small className="text-left">{option.primaryContactMobile}</small>
        </>
      )}
    </div>
  </Button>
);

OptionItem.propTypes = {
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  onSendInvite: PropTypes.func,
  option: PropTypes.object,
};
