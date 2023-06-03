import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { ButtonInvite } from './ButtonInvite';
import { OptionItem } from './OptionItem';
import { SearchSelectContext } from './SearchSelectContext';

/**
 * Dropdown list of results (options) from user search
 * children prop allows buttons to be appended
 */
export const SelectOptionsDropdown = (props) => {
  const context = useContext(SearchSelectContext);

  return (
    <div className="user-search-dropdown" tabIndex="-1">
      {context.options.length > 0 ? (
        <div className="user-search-dropdown-items" tabIndex="-1">
          {context.options.map((option) => (
            <OptionItem
              isDisabled={context.selectedIds.some((id) => id === option.id)}
              key={`select-option-${option.id}`}
              option={option}
              onClick={context.handleClickOption}
            />
          ))}
        </div>
      ) : context.handleSendInvite ? (
        <div className="d-flex m-3">
          <ButtonInvite />
        </div>
      ) : (
        <div className="d-flex m-3 text-muted">No results found.</div>
      )}
      {props.children && !props.isModalSearchDisabled && (
        <div className="d-flex">{props.children}</div>
      )}
    </div>
  );
};

SelectOptionsDropdown.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  isModalSearchDisabled: PropTypes.bool,
};
