import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import { PropertyFormUnarchive } from '.';
import { useIsOpen } from '../../hooks';
import { toClassName } from '../../utils';
import { ModalConfirm } from '../Modal';

export const PropertyUnarchiveButton = ({
  btnClassName,
  btnCancel,
  btnSubmit,
  children,
  className,
  color,
  icon,
  size,
  onConfirm,
  ...props
}) => {
  const [isOpen, actions] = useIsOpen(onConfirm);

  return (
    <div className={className}>
      <Button
        className={toClassName(
          ['d-flex', 'align-items-center', 'px-0'],
          btnClassName
        )}
        color="link"
        size={size}
        onClick={actions.handleOpen}
        {...props}>
        {icon ? (
          <FontAwesomeIcon icon={icon} className="text-danger" />
        ) : (
          <div className="fa-layers mr-1">
            <FontAwesomeIcon icon={['fas', 'circle']} className="text-white" />
            <FontAwesomeIcon
              icon={['far', 'times-circle']}
              className={`text-${color}`}
              transform="shrink-3"
            />
          </div>
        )}
        {children && <div className={`text-${color}`}>{children}</div>}
      </Button>
      <ModalConfirm isOpen={isOpen} title="Unarchive property" size={'md'}>
        <p className="mb-1">
          Are you sure you would like to Unarchive this property?
        </p>
        <div className="d-block mt-3">
          <PropertyFormUnarchive
            hasError={false}
            isLoading={false}
            onCancel={actions.handleClose}
            onSubmit={actions.handleSubmit}
          />
        </div>
      </ModalConfirm>
    </div>
  );
};

PropertyUnarchiveButton.propTypes = {
  btnClassName: PropTypes.string,
  btnCancel: PropTypes.object,
  btnSubmit: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.array,
  size: PropTypes.string,
  onConfirm: PropTypes.func,
};

PropertyUnarchiveButton.defaultProps = {
  color: 'danger',
  size: 'sm',
};
