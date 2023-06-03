import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldArray } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Input } from 'reactstrap';

import { KEY_HOLDERS } from '../../redux/property/constants';

const notDestroyed = ({ _destroy }) => !_destroy;

export const FormFieldsForKeys = ({
  handleBlur,
  handleChange,
  setFieldValue,
  values,
  isArchived,
}) => {
  function renderItems(arrayHelpers) {
    function handleAdd() {
      arrayHelpers.push({
        identifier: '',
        holder: KEY_HOLDERS[0].name,
      });
    }

    const handleRemove = (index) => () => {
      values[index].id
        ? arrayHelpers.replace(index, { ...values[index], _destroy: 1 })
        : arrayHelpers.remove(index);
    };

    return (
      <div>
        {values.filter(notDestroyed).length > 0 && (
          <div className="d-flex">
            <label className="w-50 pl-1">Identifier</label>
            <label>Who has the keys?</label>
          </div>
        )}
        {values.map((key, index) => (
          <div
            className={'mb-3 ' + (key._destroy ? 'd-none' : 'd-flex')}
            key={index}>
            <Input
              type="text"
              name={`propertyKeys.${index}.identifier`}
              value={key.identifier}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isArchived}
            />
            <Input
              type="select"
              className="ml-2"
              name={`propertyKeys.${index}.holder`}
              value={key.holder}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isArchived}>
              {KEY_HOLDERS.map(({ name, label }) => (
                <option key={`keyHolder-${index}-${name}`} value={name}>
                  {label}
                </option>
              ))}
            </Input>
            <button
              className="btn btn-link text-danger pr-0"
              type="button"
              onClick={handleRemove(index)}
              disabled={isArchived}>
              <FontAwesomeIcon icon={['far', 'times-circle']} />
            </button>
          </div>
        ))}
        <Button
          type="button"
          color="primary"
          onClick={handleAdd}
          disabled={isArchived}>
          Add a key
        </Button>
      </div>
    );
  }

  return <FieldArray name="propertyKeys" render={renderItems} />;
};

FormFieldsForKeys.propTypes = {
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.array,
  isArchived: PropTypes.bool,
};

FormFieldsForKeys.defaultProps = {
  values: [],
};
