import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Row } from 'reactstrap';

import { PropertyUserIcon } from '../../';
import { FormField } from '../../../Form';

export const OwnershipRow = (props) => {
  const {
    isSoleOwnership,
    isShowOwnershipPercentage,
    owner,
    ownership,
    index,
    name,
    onRemove,
    isArchived,
  } = props;

  return (
    <Row className={owner._destroy ? 'd-none' : ''}>
      <Col xs="5" className="d-flex align-items-center">
        <PropertyUserIcon
          className="mb-1 mb-sm-0"
          disabled={false}
          role="owner"
          user={owner}
          isPrimary={ownership.isPrimary}
          isArchived={isArchived}
        />
        {!isShowOwnershipPercentage && onRemove && (
          <Button
            title="Remove"
            color="link"
            className="btn text-danger pl-3"
            onClick={onRemove}
            disabled={isArchived}>
            <FontAwesomeIcon icon={['far', 'times-circle']} />
          </Button>
        )}
      </Col>
      {isShowOwnershipPercentage && !isSoleOwnership && (
        <Col xs="4">
          <FormField
            type="tel"
            prepend="%"
            name={`${name}[${index}].percentageSplit`}
            disabled={isArchived}
          />
        </Col>
      )}
      {isShowOwnershipPercentage && onRemove && (
        <Col xs="3">
          <Button
            title="Remove"
            color="link"
            className="btn text-danger pl-3"
            onClick={onRemove}
            disabled={isArchived}>
            <FontAwesomeIcon icon={['far', 'times-circle']} />
          </Button>
        </Col>
      )}
    </Row>
  );
};

OwnershipRow.propTypes = {
  isShowOwnershipPercentage: PropTypes.bool,
  isSoleOwnership: PropTypes.bool,
  owner: PropTypes.object,
  ownership: PropTypes.object,
  index: PropTypes.number,
  name: PropTypes.string,
  onRemove: PropTypes.func,
  isArchived: PropTypes.bool,
};
