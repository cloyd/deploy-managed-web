import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import { useIsOpen } from '../../hooks';
import { toClassName } from '../../utils';
import { ModalConfirm } from '../Modal';

export const ButtonDestroy = ({
  btnCancel,
  btnSubmit,
  children,
  className,
  color,
  icon,
  modal,
  size,
  onConfirm,
  ...props
}) => {
  const classNames = ['d-flex', 'align-items-center', 'px-0'];
  const [isOpen, actions] = useIsOpen(onConfirm);

  return (
    <div>
      <Button
        className={toClassName(classNames, className)}
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
      <ModalConfirm
        body={modal.body}
        isOpen={isOpen}
        title={modal.title}
        btnCancel={btnCancel}
        btnSubmit={btnSubmit}
        onCancel={actions.handleClose}
        onSubmit={actions.handleSubmit}
      />
    </div>
  );
};

ButtonDestroy.propTypes = {
  btnCancel: PropTypes.object,
  btnSubmit: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.array,
  modal: PropTypes.object,
  size: PropTypes.string,
  onConfirm: PropTypes.func,
};

ButtonDestroy.defaultProps = {
  color: 'danger',
  modal: {
    title: 'Confirmation',
    body: 'Are you sure?',
  },
  size: 'lg',
};
