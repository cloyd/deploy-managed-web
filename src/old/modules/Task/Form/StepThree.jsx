import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { Button, FormGroup, Input } from 'reactstrap';

import { FormLabel } from '@app/modules/Form';
import { StepsCard, StepsCardBody, StepsCardFooter } from '@app/modules/Steps';

export const TaskFormStepThree = ({
  values,
  locations,
  onCancel,
  onChange,
  onSubmit,
}) => {
  const { title, description, location } = useMemo(() => {
    return values;
  }, [values]);

  const isDisabled = useMemo(() => {
    return !title || !description || !location;
  }, [title, description, location]);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.currentTarget;
      onChange(name, value);
    },
    [onChange]
  );

  return (
    <StepsCard>
      <StepsCardBody title="Please describe the issue">
        <FormGroup className="mb-4">
          <Input
            type="text"
            className="mb-3"
            name="title"
            placeholder="Title"
            defaultValue={title}
            onBlur={handleChange}
          />
          <Input
            type="textarea"
            rows={7}
            name="description"
            placeholder="Describe the issue here"
            defaultValue={description}
            onBlur={handleChange}
          />
        </FormGroup>
        <FormGroup className="text-left mb-4">
          <FormLabel className="h5 mb-3" for="location">
            What area is the issue in?
          </FormLabel>
          <Input
            type="select"
            name="location"
            defaultValue={location}
            onChange={handleChange}>
            <option>Select one</option>
            {locations.map(([value, title], index) => (
              <option key={`location-${index}`} value={value}>
                {title}
              </option>
            ))}
          </Input>
        </FormGroup>
      </StepsCardBody>
      <StepsCardFooter>
        <Button
          className="px-5 mr-3"
          color="primary"
          size="lg"
          onClick={onCancel}
          outline>
          Back
        </Button>
        <Button
          className="px-5 ml-3"
          color="primary"
          size="lg"
          disabled={isDisabled}
          onClick={onSubmit}>
          Next
        </Button>
      </StepsCardFooter>
    </StepsCard>
  );
};

TaskFormStepThree.propTypes = {
  values: PropTypes.object,
  locations: PropTypes.array,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
