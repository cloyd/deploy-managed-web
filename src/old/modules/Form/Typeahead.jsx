import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export const FormTypeahead = ({
  onChange,
  options,
  property,
  attachment,
  ...props
}) => {
  const typeahead = useRef(null);

  const filterBy = useCallback((option, _) => option, []);

  const handleChange = useCallback(
    ([selected]) => onChange(selected),
    [onChange]
  );

  useEffect(() => {
    // clear value when property is not selected and there is a change in attachment id
    if (!property.id && attachment.id) {
      typeahead.current.clear();
    }
  }, [property.id, attachment]);

  useEffect(() => {
    // Clear value after form has been reset
    const value = typeahead.current.getInput().value;
    if (options.length === 0 && value !== null) typeahead.current.clear();
  }, [options]);

  return (
    <div className={props.className} onMouseDown={props.onMouseDown}>
      <AsyncTypeahead
        paginate
        id="async-typeahead"
        filterBy={filterBy}
        isLoading={props.isLoading}
        labelKey={props.labelKey}
        minLength={props.minLength}
        options={options}
        promptText={props.promptText}
        ref={typeahead}
        searchText={props.searchText}
        onChange={handleChange}
        onSearch={props.onSearch}
      />
    </div>
  );
};

FormTypeahead.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  labelKey: PropTypes.string,
  minLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func,
  onSearch: PropTypes.func.isRequired,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  promptText: PropTypes.string,
  searchText: PropTypes.string,
  property: PropTypes.object,
  attachment: PropTypes.object,
};

FormTypeahead.defaultProps = {
  minLength: 3,
  placeholder: 'Search...',
};
