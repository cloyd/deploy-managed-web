import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';

import { InspectionFormFieldName } from '..';
import { useIsOpen } from '../../../hooks';
import { ButtonIcon } from '../../Button';

export const InspectionAreaUpdateName = (props) => {
  const canEdit = props.onUpdateArea && !!props.name;
  const [isEditing, actions] = useIsOpen(props.onUpdateArea);

  const handleSubmit = useCallback(
    (values) => {
      // Don't submit if value is unchanged
      if (values.name === props.name) {
        actions.handleToggle();
      } else {
        actions.handleSubmit(values);
      }
    },
    [actions, props.name]
  );

  useEffect(() => {
    actions.handleClose();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [props.name]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="d-flex w-100">
      {isEditing ? (
        <div className="w-100">
          <InspectionFormFieldName
            hasError={false}
            isLoading={false}
            name={props.name}
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        props.children
      )}
      {canEdit && !isEditing && (
        <ButtonIcon
          className="py-0"
          color={props.iconColor}
          data-testid="button-update-name"
          direction="column"
          icon={['fas', 'edit']}
          size={'sm'}
          onClick={actions.handleToggle}
        />
      )}
    </div>
  );
};

InspectionAreaUpdateName.propTypes = {
  backgroundImage: PropTypes.string,
  backText: PropTypes.string,
  children: PropTypes.node,
  iconColor: PropTypes.string,
  name: PropTypes.string,
  onUpdateArea: PropTypes.func,
  pathname: PropTypes.string,
};

InspectionAreaUpdateName.defaultProps = {
  iconColor: 'primary',
};
