import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Col, CustomInput } from 'reactstrap';

import { ButtonEdit, ButtonSave, ButtonTerminate } from '../Button';

export const LeaseEditSingleProperty = ({
  lease,
  isEditing,
  handleIsEditing,
  initialValue,
  id,
  label,
  editLabel,
  onSubmit,
  canEdit,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleOnChange = useCallback(({ target }) => {
    setValue(target.value === 'false');
  }, []);

  const handleEditToggle = useCallback(() => {
    handleIsEditing(id);
  }, [id, handleIsEditing]);

  const handleCancelEdit = useCallback(() => {
    setValue(initialValue);
    handleEditToggle();
  }, [initialValue, handleEditToggle]);

  const handlePropertySave = useCallback(() => {
    onSubmit({ name: id, value });
  }, [value, onSubmit, id]);

  return (
    <Col>
      {!isEditing && (
        <>
          <Label label={label} />
          <br />
        </>
      )}
      <div className="d-flex">
        {lease.isActive && isEditing && (
          <CustomInput
            checked={value}
            id={id}
            name={id}
            type="checkbox"
            onChange={handleOnChange}
            value={value}
            label={<Label label={editLabel || label} />}
          />
        )}
        {!isEditing && (
          <>
            <div className={`${value ? 'text-success' : 'text-danger'}`}>
              <FontAwesomeIcon
                icon={['far', value ? 'check-circle' : 'times-circle']}
              />{' '}
              {value ? 'Yes' : 'No'}
            </div>
            {lease.isActive && canEdit && (
              <ButtonEdit
                className="leased_property_edit"
                onClick={handleEditToggle}
              />
            )}
          </>
        )}
      </div>
      {lease.isActive && isEditing && (
        <div className="d-flex justify-content-between">
          <ButtonTerminate className="p-0" onClick={handleCancelEdit}>
            Cancel
          </ButtonTerminate>
          <ButtonSave className="p-0" onClick={handlePropertySave}>
            Save
          </ButtonSave>
        </div>
      )}
    </Col>
  );
};

const Label = ({ label }) => (
  <span>
    <small className="d-inline-block mb-2">
      <strong>{label}</strong>
    </small>
  </span>
);

Label.propTypes = {
  label: PropTypes.string,
};

LeaseEditSingleProperty.propTypes = {
  lease: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  handleIsEditing: PropTypes.func.isRequired,
  initialValue: PropTypes.oneOfType([PropTypes.bool]),
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  editLabel: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
};

LeaseEditSingleProperty.defaultProps = {
  isEditing: false,
  label: 'Property',
  editLabel: '',
  canEdit: true,
};
