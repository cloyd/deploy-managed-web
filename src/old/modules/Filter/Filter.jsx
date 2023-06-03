import isEmpty from 'lodash/fp/isEmpty';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { withRouter } from 'react-router';
import Select from 'react-select';
import { Button, CustomInput } from 'reactstrap';
import localStorage from 'store';

import { FilterDropdown, FilterSearch, FilterView } from '.';
import { usePrevious } from '../../hooks';
import { formatDate, toQueryObject, toQueryString } from '../../utils';
import { FormFieldDate, FormLabel, FormTypeaheadUser } from '../Form';
import { TypeaheadSelect } from './TypeaheadSelect';

export const FilterContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'update': {
      const { exclude, ...payload } = action.payload;
      const newState = {
        ...state,
        params: { ...state.params, ...payload },
      };

      if (exclude) {
        newState[exclude] = undefined;
      }

      return newState;
    }

    case 'reset':
      const { defaultParams } = action.payload;
      return { ...state, params: { page: 1, ...defaultParams } };

    default:
      return state;
  }
};

const FilterComponent = (props) => {
  const {
    children,
    defaultParams,
    location,
    history,
    isSaved,
    isSubmitOnChange,
    isUpdateUrlOnChange,
    name,
    onSubmit,
    filtersToParamsConversion,
    initialFilter,
  } = props;

  // Sets initial state of the filter
  // To skip loading filters from localStorage, set page in location.search, e.g. ?page=1

  const getFiltersParams = useCallback(() => {
    let params;
    if (location.pathname === '/property') {
      const paramsObject = toQueryObject(location.search);
      const selectedParamsObj = {};
      Object.keys(paramsObject).forEach(
        (key) =>
          ['page', 'managerId', 'agencyId'].includes(key) &&
          (selectedParamsObj[key] = paramsObject[key])
      );
      const filtersParamObj = filtersToParamsConversion();
      params = { ...filtersParamObj, ...selectedParamsObj };
    } else if (['/payments', '/payments/wallet'].includes(location.pathname)) {
      // payments should always load upcoming payments filter

      params = { ...initialFilter, ...toQueryObject(location.search) };
    } else {
      params = toQueryObject(location.search);
    }
    return params;
  }, [
    location.pathname,
    location.search,
    filtersToParamsConversion,
    initialFilter,
  ]);

  const initialState = useMemo(() => {
    const params = getFiltersParams();
    const isLoadLocalStorage = isSaved && isEmpty(params);
    if (isLoadLocalStorage) {
      const storageParams = localStorage.get(name);
      const { page, ...otherStorageParams } = storageParams || {};

      return {
        params: isEmpty(otherStorageParams)
          ? { ...defaultParams }
          : { ...storageParams },
      };
    } else {
      return { params };
    }
  }, [defaultParams, isSaved, name, getFiltersParams]);

  const [state, dispatch] = useReducer(reducer, initialState);

  // Submit action
  const handleSubmit = useCallback(
    (payload) => {
      let params;
      if (location.pathname === '/property') {
        const filterParams = getFiltersParams();
        params = { ...filterParams, ...payload };
      } else {
        params = { ...state.params, ...payload };
      }

      if (payload) {
        dispatch({ type: 'update', payload });
      }
      history.replace({ search: toQueryString(params) });

      if (onSubmit) {
        onSubmit(params);
      }
    },
    [location.pathname, history, onSubmit, getFiltersParams, state.params]
  );

  // Filter change action
  const handleChange = useCallback(
    (payload) => {
      dispatch({ type: 'update', payload });

      if (isSubmitOnChange) {
        handleSubmit(payload);
      }
    },
    [handleSubmit, isSubmitOnChange]
  );

  // Filter click action
  const handleClick = useCallback(
    (payload) => dispatch({ type: 'update', payload }),
    []
  );

  // Filters reset action
  const handleReset = useCallback(
    (payload) => dispatch({ type: 'reset', payload }),
    []
  );

  // Hooks
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (location.search === '') {
      history.replace({ search: toQueryString(state.params) });
    }
  }, [location.search]);

  useEffect(() => {
    if (isSaved) {
      localStorage.set(name, state.params);
    }

    if (isUpdateUrlOnChange) {
      history.replace({ search: toQueryString(state.params) });
    }
  }, [state.params]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <FilterContext.Provider
      value={{
        params: state.params,
        actions: {
          onChange: handleChange,
          onClick: handleClick,
          onReset: handleReset,
          onSubmit: handleSubmit,
        },
      }}>
      {children}
    </FilterContext.Provider>
  );
};

const Clear = ({ children, defaultParams, disabled, onClick }) => {
  const { actions } = useContext(FilterContext);

  const handleOnClick = useCallback(() => {
    actions.onReset({ defaultParams });
    onClick && onClick();
  }, [actions, defaultParams, onClick]);

  return (
    <Button
      color="link"
      className="p-0"
      onClick={handleOnClick}
      disabled={disabled}>
      {children || 'Clear All'}
    </Button>
  );
};

const Date = (props) => {
  const { label, name, value, datePickerProps, customOnChange } = props;
  const { params, actions } = useContext(FilterContext);
  const valuePrev = usePrevious(value);

  const handleChange = useCallback(
    (value) => {
      if (customOnChange) {
        customOnChange(formatDate(value, 'dateLocal'));
      }
      actions.onChange({ [name]: formatDate(value, 'dateLocal') });
    },
    [actions, customOnChange, name]
  );

  useEffect(() => {
    if (value && value !== valuePrev) {
      handleChange(value);
    }
  }, [handleChange, value, valuePrev]);

  return (
    <div className="d-flex">
      <FormLabel className="m-2" for={name}>
        {label}
      </FormLabel>
      <FormFieldDate
        name={name}
        value={params[name] || label}
        onChange={handleChange}
        datePickerProps={datePickerProps}
        useCustomValues
      />
    </div>
  );
};

const Dropdown = (props) => {
  const { clearKeysOnChange, label, name, values } = props;
  const { params, actions } = useContext(FilterContext);

  const handleChange = useCallback(
    (value) => {
      let values = { [name]: value };

      if (clearKeysOnChange) {
        values = clearKeysOnChange.reduce(
          (acc, name) => ({ ...acc, [name]: undefined }),
          values
        );
      }

      actions.onChange(values);
    },
    [actions, clearKeysOnChange, name]
  );

  return (
    <FilterDropdown
      label={params[name] ? '-- Clear Filter --' : label}
      values={values}
      value={params[name]}
      onChange={handleChange}
    />
  );
};

const Search = (props) => {
  const {
    clearKeysOnClick,
    isSubmitOnClick,
    label,
    name,
    onChange,
    onClick,
    values,
    ...otherProps
  } = props;
  const { params, actions } = useContext(FilterContext);

  const parsedValues = useMemo(
    () =>
      values && values.length > 0 && params[name]
        ? [{ label: '-- Clear Filter --', value: null }, ...values]
        : values,
    [name, params, values]
  );

  const handleChange = useCallback(
    (value) => {
      const updatedParams = { [name]: value || null, page: 1 };
      actions.onChange(updatedParams);

      if (isSubmitOnClick && !value) {
        // If input field is blank, then fire submit
        actions.onSubmit(updatedParams);
      }

      if (onChange) {
        onChange(value);
      }
    },
    [actions, isSubmitOnClick, name, onChange]
  );

  const handleClick = useCallback(
    (value) => {
      let options;

      if (clearKeysOnClick) {
        options = clearKeysOnClick.reduce(
          (acc, name) => ({ ...acc, [name]: undefined }),
          options
        );
      }

      const updatedParams = { [name]: value || undefined, ...options };
      actions.onChange(updatedParams);

      if (isSubmitOnClick) {
        actions.onSubmit(updatedParams);
      }

      if (onClick) {
        onClick(updatedParams);
      }
    },
    [actions, clearKeysOnClick, isSubmitOnClick, name, onClick]
  );

  return (
    <FilterSearch
      {...otherProps}
      label={label}
      onChange={handleChange}
      onClick={handleClick}
      options={parsedValues}
      value={params[name]}
    />
  );
};

const SearchUser = (props) => {
  const {
    onChange,
    onInputChange,
    filtersToParamsConversion,
    location,
    ...otherProps
  } = props;
  const { actions } = useContext(FilterContext);
  const filterParams =
    location &&
    location.pathname === '/property' &&
    filtersToParamsConversion();
  const handleChange = useCallback(
    (value) => {
      const val = value ? value.id : null;
      let payload = filterParams
        ? {
            ...filterParams,
            [props.name]: val,
            page: 1,
            exclude: props.exclude,
          }
        : { [props.name]: val, page: 1, exclude: props.exclude };
      actions.onChange(payload);
      if (onChange) {
        onChange({ [props.name]: val });
      }
    },
    [actions, onChange, props.exclude, props.name, filterParams]
  );

  const handleInputChange = useCallback(
    (value) => {
      if (!value) {
        let inputChangePayload = filterParams
          ? { ...filterParams, [props.name]: null, page: 1 }
          : { [props.name]: null, page: 1 };
        actions.onChange(inputChangePayload);
      }
      if (onInputChange) {
        onInputChange(value);
      }
    },
    [actions, onInputChange, props.name, filterParams]
  );

  return (
    <FormTypeaheadUser
      {...otherProps}
      onChange={handleChange}
      onInputChange={handleInputChange}
    />
  );
};

const Submit = (props) => {
  const { children, onClick, ...otherProps } = props;
  const { actions } = useContext(FilterContext);

  const handleOnClick = useCallback(() => {
    actions.onSubmit({ page: 1 });

    if (onClick) {
      onClick();
    }
  }, [actions, onClick]);

  return (
    <Button
      color="link"
      className="p-0"
      onClick={handleOnClick}
      {...otherProps}>
      {children}
    </Button>
  );
};

const TypeaheadMultiSelect = (props) => {
  const {
    clearKeysOnChange,
    isRequired,
    label,
    name,
    onKeyDown,
    onSelect,
    values,
    selectClassName,
  } = props;
  const { params, actions } = useContext(FilterContext);

  const optionValues = useMemo(() => {
    let options;
    options = values.map((entry) => ({
      label: entry.label || startCase(entry),
      value: typeof entry.value !== 'undefined' ? entry.value : entry,
    }));

    // If filter has an option selected, add option to clear
    return !isRequired && params[name]
      ? [
          {
            label: '-- Clear Filter --',
            value: '',
          },
          ...options,
        ]
      : options;
  }, [isRequired, name, params, values]);

  const selectedValue = useMemo(() => {
    return params[name] && params[name][0]
      ? optionValues.find((item) => String(item.value) === String(params[name]))
      : [];
  }, [params, name, optionValues]);

  const handleChange = useCallback(
    (option) => {
      let value;
      option = option || [];
      if (option.find((item) => item.value === '') || option.length === 0) {
        value = [];
      } else {
        value = option.map((item) => item.value);
      }

      let values = { [name]: value };

      if (clearKeysOnChange) {
        values = clearKeysOnChange.reduce(
          (acc, name) => ({ ...acc, [name]: undefined }),
          values
        );
      }

      actions.onChange(values);

      if (onSelect) {
        onSelect(values);
      }
    },
    [actions, clearKeysOnChange, name, onSelect]
  );

  const handleKeyDown = useCallback(
    (event) => {
      event.stopPropagation();

      if (event.target && event.target.value.length > 1) {
        onKeyDown(event.target.value);
      }
    },
    [onKeyDown]
  );

  return (
    <Select
      name={name}
      onChange={handleChange}
      onKeyDown={onKeyDown && handleKeyDown}
      options={optionValues}
      placeholder={label}
      value={selectedValue}
      className={`multi-select ${selectClassName || ''}`}
      isMulti
    />
  );
};

const View = (props) => {
  const { name, values } = props;
  const { params, actions } = useContext(FilterContext);

  const handleChange = useCallback(
    (value) => {
      actions.onSubmit({ [name]: value });
    },
    [actions, name]
  );

  return (
    <FilterView values={values} value={params[name]} onChange={handleChange} />
  );
};

const Check = (props) => {
  const { name, label, disabled, onChange } = props;
  const { params, actions } = useContext(FilterContext);

  const handleChange = useCallback(
    (e) => {
      const { name, checked } = e.target;
      actions.onChange({
        [name]: checked.toString(),
      });

      if (onChange) {
        onChange(checked);
      }
    },
    [actions, onChange]
  );

  return (
    <CustomInput
      checked={params[name] === 'true'}
      id={name}
      label={label}
      name={name}
      type="checkbox"
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

const Radio = (props) => {
  const { name, label, label2 } = props;
  const { params, actions } = useContext(FilterContext);
  const handleChange = useCallback(() => {
    actions.onSubmit({
      [name]: params.isOnboarded === 'false' || false ? 'true' : 'false',
    });
  }, [actions, name, params.isOnboarded]);
  return (
    <>
      <CustomInput
        checked={params.isOnboarded === 'false'}
        id="onboarding_no"
        label={label2}
        name={name}
        type="radio"
        value="no"
        onChange={handleChange}
      />
      <CustomInput
        checked={params.isOnboarded === 'true'}
        id="onboarding_yes"
        label={label}
        name={name}
        type="radio"
        value="yes"
        onChange={handleChange}
      />
    </>
  );
};

FilterComponent.propTypes = {
  children: PropTypes.node.isRequired,
  defaultParams: PropTypes.object,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isSaved: PropTypes.bool,
  isSubmitOnChange: PropTypes.bool,
  isUpdateUrlOnChange: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  filtersToParamsConversion: PropTypes.func,
  initialFilter: PropTypes.object,
};

FilterComponent.defaultProps = {
  isSaved: false,
  isSubmitOnChange: false,
  isUpdateUrlOnChange: false,
  initialFilter: {},
};

Clear.propTypes = {
  children: PropTypes.node,
  defaultParams: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Date.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  datePickerProps: PropTypes.object,
  customOnChange: PropTypes.func,
};

Date.defaultProps = {
  datePickerProps: {},
  customOnChange: null,
};

Dropdown.propTypes = {
  clearKeysOnChange: PropTypes.array,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  values: PropTypes.array.isRequired,
};

Search.propTypes = {
  clearKeysOnClick: PropTypes.array,
  isSubmitOnClick: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  values: PropTypes.array,
};

SearchUser.propTypes = {
  name: PropTypes.string.isRequired,
  exclude: PropTypes.string,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  filtersToParamsConversion: PropTypes.func,
  location: PropTypes.object,
};

Submit.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

TypeaheadMultiSelect.propTypes = {
  clearKeysOnChange: PropTypes.array,
  isRequired: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func,
  onSelect: PropTypes.func,
  values: PropTypes.array.isRequired,
  selectClassName: PropTypes.string,
};

View.propTypes = {
  name: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
};

Check.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

Radio.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  label2: PropTypes.string.isRequired,
};

export const Filter = withRouter(FilterComponent);

Filter.Clear = Clear;
Filter.Date = Date;
Filter.Dropdown = Dropdown;
Filter.Search = Search;
Filter.SearchUser = SearchUser;
Filter.Submit = Submit;
Filter.TypeaheadSelect = TypeaheadSelect;
Filter.TypeaheadMultiSelect = TypeaheadMultiSelect;
Filter.View = View;
Filter.Check = Check;
Filter.Radio = Radio;
