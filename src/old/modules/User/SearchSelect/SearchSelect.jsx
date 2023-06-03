import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import Select from 'react-select';
import { Button } from 'reactstrap';

import { toClassName } from '../../../utils';
import { ModalInvite } from './ModalInvite';
import { ModalSelect } from './ModalSelect';
import { SelectOptionsDropdown } from './OptionsDropdown';
import {
  SearchSelectContext,
  SearchSelectProvider,
} from './SearchSelectContext';

/**
 * UserSearchSelect wraps all SearchSelect components with a context provider
 * https://reactjs.org/docs/hooks-reference.html#usecontext
 */
export const UserSearchSelect = (props) => {
  const { className, isModalSearchDisabled, ...contextProps } = props;

  return (
    <SearchSelectProvider {...contextProps}>
      <UserSearchSelectComponent
        className={className}
        isModalSearchDisabled={isModalSearchDisabled}
      />
    </SearchSelectProvider>
  );
};

UserSearchSelect.propTypes = {
  canSendInvite: PropTypes.bool,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func,
  searchParams: PropTypes.object,
  type: PropTypes.string.isRequired,
  isModalSearchDisabled: PropTypes.bool,
};

/**
 * Search and add list of users via React Select https://react-select.com/.
 * We are implementing our own version of the dropdown menu, SelectOptionsDropdown,
 * because there were issues when updating the list of options in react-select/Select.
 */
const UserSearchSelectComponent = (props) => {
  const { className, isModalSearchDisabled } = props;
  const context = useContext(SearchSelectContext);

  return (
    <div
      className={toClassName(['user-search-select w-100'], className)}
      data-testid="user-search-select">
      <Select
        blurInputOnSelect={false}
        className="user-search-input"
        isDisabled={context.isDisabled}
        isLoading={context.isLoading}
        isMulti={context.isMulti}
        inputValue={context.search}
        menuIsOpen={false}
        onChange={context.handleChange}
        onClick={context.dropdown.handleOpen}
        onFocus={context.dropdown.handleOpen}
        onBlur={context.handleBlur}
        onInputChange={context.handleChangeInput}
        ref={context.selectRef}
        inputProp
      />
      {context.dropdown.show && (
        <>
          <SelectOptionsDropdown
            isLoading={context.isLoading}
            isModalSearchDisabled={isModalSearchDisabled}>
            <Button
              className="border-top text-danger"
              color="link"
              tabIndex="0"
              onClick={context.dropdown.handleClose}>
              Cancel
            </Button>
            <ModalSelect className="w-100 py-2 border-top text-right" />
          </SelectOptionsDropdown>
          <div
            className="click-exit-overlay"
            onClick={context.dropdown.handleClose}
          />
        </>
      )}
      {context.handleSendInvite && <ModalInvite />}
    </div>
  );
};

UserSearchSelectComponent.propTypes = {
  className: PropTypes.string,
  isModalSearchDisabled: PropTypes.bool,
};
