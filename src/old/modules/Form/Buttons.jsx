import PropTypes from 'prop-types';
import React from 'react';
import { FormText } from 'reactstrap';

import { toClassName } from '../../utils';
import { ButtonCancel, ButtonSubmit } from '../Button';
import { NavOverlay } from '../Nav';
import { SignatureRequired } from '../Signature';

export const FormButtons = ({ children, ...props }) => {
  return props.isOverlayed ? (
    <NavOverlay>
      <Buttons className="justify-content-between" {...props}>
        {children}
      </Buttons>
    </NavOverlay>
  ) : (
    <Buttons
      className={
        props.isFormButtonsJustifyBetween
          ? 'justify-content-between'
          : 'justify-content-end'
      }
      {...props}>
      {children}
    </Buttons>
  );
};

const Buttons = (props) => {
  const {
    btnCancel,
    btnSubmit,
    children,
    className,
    isDisabled,
    isOverlayed,
    isRequired,
    isSpaced,
    isSubmitting,
    isValid,
    onCancel,
    onSubmit,
    isFormButtonsJustifyBetween,
  } = props;

  const classNames = isRequired
    ? ['d-flex', 'justify-content-between', 'align-items-center']
    : ['d-flex'];

  return (
    <div className={toClassName(classNames, className)}>
      {isRequired && (
        <FormText color="danger" className="ml-1">
          * Required field
        </FormText>
      )}
      <div
        className={toClassName(
          ['d-flex'],
          (isOverlayed ||
            children ||
            isSpaced ||
            isFormButtonsJustifyBetween) &&
            'w-100 justify-content-between'
        )}>
        {onCancel && (
          <ButtonCancel
            color={btnCancel.color || 'primary'}
            data-testid="form-cancel-btn"
            size={btnCancel.size}
            onClick={onCancel}>
            {btnCancel.text || 'Cancel'}
          </ButtonCancel>
        )}
        <div className={onCancel ? 'ml-2' : btnSubmit.className}>
          {children}
          <ButtonSubmitWrapper
            isLoadingUser={props.isLoadingUser}
            user={props.user}
            onSubmitSignature={props.onSubmitSignature}>
            <ButtonSubmit
              color={
                !isValid || isSubmitting || isDisabled
                  ? 'dark'
                  : btnSubmit.color || 'primary'
              }
              data-testid="form-submit-btn"
              disabled={!isValid || isSubmitting || isDisabled} // if its disabled change the color to grey
              isSubmitting={isSubmitting}
              size={btnSubmit.size}
              type={onSubmit ? 'button' : 'submit'}
              onClick={onSubmit}>
              {btnSubmit.text || 'Save'}
            </ButtonSubmit>
          </ButtonSubmitWrapper>
        </div>
      </div>
    </div>
  );
};

const ButtonSubmitWrapper = (props) => {
  const { children, isLoadingUser, onSubmitSignature, user } = props;

  return onSubmitSignature ? (
    <SignatureRequired
      isLoading={isLoadingUser}
      user={user}
      onSubmitSignature={onSubmitSignature}>
      {children}
    </SignatureRequired>
  ) : (
    children
  );
};

FormButtons.propTypes = {
  btnCancel: PropTypes.object,
  btnSubmit: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLoadingUser: PropTypes.bool,
  isOverlayed: PropTypes.bool,
  isRequired: PropTypes.bool,
  isSpaced: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitSignature: PropTypes.func,
  user: PropTypes.object,
  isFormButtonsJustifyBetween: PropTypes.bool,
};

FormButtons.defaultProps = {
  isDisabled: false,
  isOverlayed: false,
  isSpaced: false,
  isSubmitting: false,
  isValid: true,
  isFormButtonsJustifyBetween: false,
  btnCancel: { text: 'Cancel', color: 'primary' },
  btnSubmit: { text: 'Save', color: 'primary' },
};

Buttons.propTypes = {
  ...FormButtons.propTypes,
};

ButtonSubmitWrapper.propTypes = {
  children: PropTypes.node,
  isLoadingUser: PropTypes.bool,
  onSubmitSignature: PropTypes.func,
  user: PropTypes.object,
};
