import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import { ButtonIcon } from './Icon';

/**
 * Groups together all the basic buttons into one file
 */
export const ButtonAccept = (props) => (
  <ButtonIcon
    direction="column"
    icon={['far', 'circle-check']}
    size="2x"
    color="success"
    {...props}>
    <small>Accept</small>
  </ButtonIcon>
);

export const ButtonAdd = ({ children, ...props }) => (
  <ButtonIcon icon={['far', 'plus-circle']} {...props}>
    {children}
  </ButtonIcon>
);

ButtonAdd.propTypes = {
  children: PropTypes.node,
};

export const ButtonApprove = ({ children, ...props }) => (
  <ButtonIcon icon={['far', 'thumbs-up']} {...props}>
    {children}
  </ButtonIcon>
);

ButtonApprove.propTypes = {
  children: PropTypes.node,
};

export const ButtonCancel = ({ children, ...props }) => (
  <Button type="button" color="primary" outline {...props}>
    {children}
  </Button>
);

ButtonCancel.propTypes = {
  children: PropTypes.string.isRequired,
};

export const ButtonClose = ({ direction, hasText, size, ...props }) => (
  <ButtonIcon
    direction={direction}
    size={size}
    icon={['far', 'times']}
    title="Close"
    {...props}>
    {hasText && <small>Close</small>}
  </ButtonIcon>
);

ButtonClose.propTypes = {
  direction: PropTypes.string,
  hasText: PropTypes.bool,
  size: PropTypes.string,
};

ButtonClose.defaultProps = {
  direction: 'column',
  hasText: true,
  size: '2x',
};

export const ButtonDecline = (props) => (
  <ButtonIcon
    direction="column"
    size="2x"
    color="danger"
    icon={['far', 'times-circle']}
    {...props}>
    <small>Decline</small>
  </ButtonIcon>
);

export const ButtonDollar = ({ children, ...props }) => (
  <ButtonIcon icon={['far', 'usd-circle']} {...props}>
    {children}
  </ButtonIcon>
);

ButtonDollar.propTypes = {
  children: PropTypes.node,
};

export const ButtonEdit = ({ children, ...props }) => (
  <ButtonIcon icon={['far', 'pencil']} {...props}>
    {children}
  </ButtonIcon>
);

ButtonEdit.propTypes = {
  children: PropTypes.string,
};

export const ButtonSave = ({ children, ...props }) => (
  <ButtonIcon icon={['far', 'check']} {...props}>
    {children}
  </ButtonIcon>
);

ButtonSave.propTypes = {
  children: PropTypes.string,
};

export const ButtonEditTask = ({ children, ...props }) => (
  <ButtonIcon direction="column" icon={['far', 'pencil']} size="2x" {...props}>
    {children || <small>Edit</small>}
  </ButtonIcon>
);

ButtonEditTask.propTypes = {
  children: PropTypes.node,
};

export const ButtonEntryTask = (props) => (
  <ButtonIcon
    direction="column"
    icon={['far', 'sticky-note']}
    size="2x"
    {...props}>
    <small>Entry</small>
  </ButtonIcon>
);

export const ButtonIncrease = ({ children, ...props }) => (
  <ButtonIcon icon={['far', 'arrow-circle-up']} {...props}>
    {children}
  </ButtonIcon>
);

ButtonIncrease.propTypes = {
  children: PropTypes.node,
};

export const ButtonPay = (props) => (
  <ButtonIcon
    direction="column"
    icon={['far', 'chevron-double-right']}
    size="2x"
    color="success"
    {...props}>
    <small>Pay Bill</small>
  </ButtonIcon>
);

export const ButtonQuote = (props) => (
  <ButtonIcon
    direction="column"
    icon={['far', 'comment-dollar']}
    size="2x"
    {...props}>
    <small>Quote</small>
  </ButtonIcon>
);

ButtonQuote.propTypes = {
  children: PropTypes.node,
};

export const ButtonReply = (props) => (
  <ButtonIcon direction="column" icon={['far', 'comment']} size="2x" {...props}>
    <small>Reply</small>
  </ButtonIcon>
);

export const ButtonSchedule = (props) => (
  <ButtonIcon
    direction="column"
    icon={['far', 'chevron-double-right']}
    size="2x"
    color="success"
    {...props}>
    <small>Schedule</small>
  </ButtonIcon>
);

export const ButtonSort = ({ children, ...props }) => (
  <ButtonIcon color="primary" icon={['far', 'sort']} {...props}>
    {children || 'Sort'}
  </ButtonIcon>
);

ButtonSort.propTypes = {
  children: PropTypes.node,
};

export const ButtonTerminate = ({ children, ...props }) => (
  <ButtonIcon icon={['far', 'ban']} {...props}>
    {children}
  </ButtonIcon>
);

ButtonTerminate.propTypes = {
  children: PropTypes.node,
};

export const ButtonTradie = ({ children, ...props }) => (
  <ButtonIcon direction="column" icon={['far', 'wrench']} size="2x" {...props}>
    <small>{children || 'Tradie'}</small>
  </ButtonIcon>
);

ButtonTradie.propTypes = {
  children: PropTypes.string,
};

export const ButtonRefer = (props) => (
  <ButtonIcon
    direction="column"
    icon={['far', 'envelope']}
    size="2x"
    {...props}>
    <small>Refer</small>
  </ButtonIcon>
);

export const ButtonTransfer = ({ children, ...props }) => (
  <ButtonIcon
    buttonColor="primary"
    color="white"
    icon={['far', 'exchange']}
    {...props}>
    {children}
  </ButtonIcon>
);

ButtonTransfer.propTypes = {
  children: PropTypes.node,
};
