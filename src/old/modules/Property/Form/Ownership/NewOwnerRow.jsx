import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Row } from 'reactstrap';

import { FormFieldsForUser } from '../../../Form';

export const NewOwnerRow = (props) => (
  <Row className="mt-3">
    <Col xs={12} className="flex-column">
      <hr className="w-100 mt-0 mb-3" />
      <div className="d-flex flex-row">
        <FormFieldsForUser
          className="w-100"
          attributeName={`${props.name}[${props.index}]`}
          isDisabled={false}
          isArchived={props.isArchived}
          setFieldValue={props.setFieldValue}
          type="owner"
          isSearchable
        />
        <Button
          title="Remove"
          color="link"
          className="text-danger pl-3 align-self-start mt-4"
          onClick={props.onRemove}
          disabled={props.isArchived}>
          <FontAwesomeIcon icon={['far', 'times-circle']} />
        </Button>
      </div>
    </Col>
  </Row>
);

NewOwnerRow.propTypes = {
  index: PropTypes.number,
  name: PropTypes.string,
  onRemove: PropTypes.func,
  isArchived: PropTypes.bool,
  setFieldValue: PropTypes.func.isRequired,
};
