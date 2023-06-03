import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useIsOpen } from '../../../hooks';
import { useAsyncSearchUsers, useAsyncSendTradieInvite } from '../hooks';

export const SearchSelectContext = React.createContext();

/**
 * Context provider for UserSearchSelect component
 * https://reactjs.org/docs/hooks-reference.html#usecontext
 */
export const SearchSelectProvider = ({
  canSendInvite,
  isDisabled,
  isMulti,
  onChange,
  searchParams,
  type,
  onInputChange,
  handleBlur,
  hasFilters,
  children,
}) => {
  const selectRef = useRef(null);
  const [search, setSearch] = useState();
  const [selectedIds, setSelectedIds] = useState([]);

  const [showDropdown, dropdownActions] = useIsOpen();
  const [showInviteModal, inviteModalActions] = useIsOpen();

  const [searchUsers, { data, isLoading }] = useAsyncSearchUsers(type);
  const [
    sendInvite,
    {
      invitedTradie,
      errorInvitedTradie,
      handleResetTradieInvite,
      isLoading: isLoadingTradieInvite,
    },
  ] = useAsyncSendTradieInvite();

  const handleChange = useCallback(
    (value) => {
      if (value) {
        const ids = value.map((option) => option.id);
        setSelectedIds(ids);
        onChange && onChange(ids, value);
      }
    },
    [onChange]
  );

  const debouncedSearch = useCallback(debounce(searchUsers, 500), []);

  const handleChangeInput = useCallback(
    (value, param) => {
      // action is a react-select type
      if (onInputChange && param?.action === 'input-change') {
        onInputChange(value);
      }
      if (!param || param.action === 'input-change') {
        setSearch(value);
        debouncedSearch(value, { ...searchParams, page: 1 });
      }
    },
    [searchParams, onInputChange, debouncedSearch]
  );

  const handleChangeParams = useCallback(
    (params) => searchUsers(search, { ...searchParams, page: 1, ...params }),
    [search, searchParams, searchUsers]
  );

  const handleClickOption = useCallback(
    (option) => () => {
      const ref = selectRef.current;

      dropdownActions.handleClose();
      inviteModalActions.handleClose();
      handleResetTradieInvite();

      if (isMulti) {
        const currentValues = ref.state.value || [];
        const isAlreadyChosen =
          currentValues.findIndex((value) => value.id === option.id) > -1;

        if (option.id && !isAlreadyChosen) {
          ref.select.setValue([
            ...currentValues,
            { ...option, value: option.id }, // value key is required for react-select
          ]);
          setSearch('');
        }
      } else {
        ref.select.setValue([{ ...option, value: option.id }]);
        setSearch('');
      }
    },
    [dropdownActions, handleResetTradieInvite, inviteModalActions, isMulti]
  );

  const handleSendInvite = useCallback(
    (values) => sendInvite(values),
    [sendInvite]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Add newly invited user to Select field
    if (invitedTradie?.id) {
      handleClickOption({
        ...invitedTradie,
        label: `${invitedTradie.name} - ${invitedTradie.email}`,
      })();
    }
  }, [invitedTradie]);

  useEffect(() => {
    // If the field changes from a multi field to a single field, reset values
    if (!isMulti && selectedIds) {
      setSelectedIds([]);
      onChange && onChange([]);
      selectRef.current.select.clearValue();
    }
  }, [isMulti]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <SearchSelectContext.Provider
      value={{
        dropdown: {
          show: showDropdown,
          handleClose: dropdownActions.handleClose,
          handleOpen: dropdownActions.handleOpen,
        },
        inviteModal: {
          show: showInviteModal,
          handleClose: inviteModalActions.handleClose,
          handleOpen: inviteModalActions.handleOpen,
        },
        errorInvitedTradie,
        handleChange,
        handleChangeInput,
        handleChangeParams,
        handleClickOption,
        handleSendInvite: canSendInvite ? handleSendInvite : null,
        handleBlur,
        isDisabled,
        isMulti,
        isLoading,
        isLoadingTradieInvite,
        hasFilters,
        options: data,
        search: search || '',
        selectedIds,
        selectRef,
        type,
      }}>
      {children}
    </SearchSelectContext.Provider>
  );
};

SearchSelectProvider.propTypes = {
  canSendInvite: PropTypes.bool,
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  handleBlur: PropTypes.func,
  searchParams: PropTypes.object,
  type: PropTypes.string.isRequired,
  hasFilters: PropTypes.bool,
};

SearchSelectProvider.defaultProps = {
  isMulti: true,
  hasFilters: true,
};
