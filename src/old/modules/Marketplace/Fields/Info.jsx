import PropTypes from 'prop-types';
import React from 'react';
import { Card, FormGroup } from 'reactstrap';

import { FormField, FormFieldSelect, FormLabel } from '@app/modules/Form';

export const MarketplaceFieldsInfo = ({
  errors,
  values,
  onChange,
  tagOptions,
  touched,
}) => {
  return (
    <Card className="bg-lavender text-left p-4 mb-3">
      <FormGroup>
        <FormLabel for="title" className="font-weight-bold" isRequired>
          More Info
        </FormLabel>
        <FormField name="title" placeholder="Add the job title" />
      </FormGroup>
      <FormGroup>
        <FormField
          name="description"
          placeholder="Add your message to the tradie"
          type="textarea"
          rows={6}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel for="tagIds" className="font-weight-bold" isRequired>
          Type of Job
        </FormLabel>
        <FormFieldSelect
          data-testid="field-type-of-job"
          aria-label="Type of Job"
          options={tagOptions}
          error={touched.tagIds && errors.tagIds}
          onChange={onChange('tagIds')}
          value={values.tagIds}
        />
      </FormGroup>
    </Card>
  );
};

MarketplaceFieldsInfo.propTypes = {
  errors: PropTypes.object,
  values: PropTypes.object,
  onChange: PropTypes.func,
  tagOptions: PropTypes.array,
  touched: PropTypes.object,
};
