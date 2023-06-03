import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

import { useAsyncSearchUsers } from '../User/hooks';

const MIN_LENGTH = 3;

const filterBy = (option, _) => option;

export const FormTypeaheadUser = React.forwardRef((props, ref) => {
  const {
    defaultInputValue,
    fieldId,
    label,
    labelKey,
    onChange,
    onMouseDown,
    onInputChange,
    searchData,
    selected,
    type,
  } = props;

  const [asyncSearchUsers, { data, isLoading }] = useAsyncSearchUsers(type);

  // Overwrite props labelKey if data values have labels assigned to them
  const dataLabelKey = useMemo(() => {
    return data && data.length > 0 && 'label' in data[0] ? 'label' : labelKey;
  }, [data, labelKey]);

  const handleChange = useCallback(
    (items) => {
      onChange(items[0]);
    },
    [onChange]
  );

  const handleFocus = useCallback((event) => event.target.select(), []);

  const handleSearch = useCallback(
    (search) => asyncSearchUsers(search, searchData),
    [asyncSearchUsers, searchData]
  );

  return (
    <InputGroup className="flex-nowrap" onMouseDown={onMouseDown}>
      <AsyncTypeahead
        id={fieldId}
        className="w-100"
        defaultInputValue={defaultInputValue}
        filterBy={filterBy}
        isLoading={isLoading}
        labelKey={dataLabelKey}
        minLength={MIN_LENGTH}
        onChange={handleChange}
        onFocus={handleFocus}
        onInputChange={onInputChange}
        onSearch={handleSearch}
        options={data}
        paginate
        placeholder={label}
        selected={selected}
        ref={ref}
      />
      <InputGroupAddon addonType="append">
        <InputGroupText className="py-1">
          <FontAwesomeIcon icon={['far', 'search']} />
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
});

FormTypeaheadUser.defaultProps = {
  fieldId: 'async-typeahead',
  label: 'Search for a user...',
  labelKey: 'name',
  searchData: {},
};

FormTypeaheadUser.propTypes = {
  defaultInputValue: PropTypes.string,
  fieldId: PropTypes.string,
  label: PropTypes.string,
  labelKey: PropTypes.string,
  onChange: PropTypes.func,
  onMouseDown: PropTypes.func,
  onInputChange: PropTypes.func,
  type: PropTypes.string,
  searchData: PropTypes.object,
  selected: PropTypes.array,
};

FormTypeaheadUser.displayName = 'FormTypeaheadUser';
