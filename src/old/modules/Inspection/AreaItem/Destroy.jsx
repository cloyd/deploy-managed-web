import PropTypes from 'prop-types';
import React from 'react';

import { ButtonDestroy } from '../../Button';

export const InspectionAreaItemDestroy = (props) => (
  <ButtonDestroy
    btnCancel={{ text: 'Cancel' }}
    btnSubmit={{ text: 'Delete', color: 'danger' }}
    data-testid="button-destroy-area-item"
    icon={['far', 'trash-alt']}
    modal={{
      body: `Are you sure you would like to delete <strong>${props.item.name}</strong>?`,
    }}
    onConfirm={props.onDelete(props.item)}
  />
);

InspectionAreaItemDestroy.propTypes = {
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};
