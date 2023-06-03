import PropTypes from 'prop-types';
import React from 'react';
import { PulseLoader } from 'react-spinners';

import { SignatureModule } from './Module';

export const SignatureRequired = (props) => {
  const { children, isLoading, user } = props;
  const showSignatureModule = !user.signatureUrl;

  return isLoading ? (
    <PulseLoader size={12} color="#dee2e6" />
  ) : showSignatureModule ? (
    <SignatureModule
      buttonOptions={{
        buttonColor: 'link',
        color: 'success',
      }}
      onConfirm={props.onSubmitSignature}
    />
  ) : (
    children
  );
};

SignatureRequired.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  onSubmitSignature: PropTypes.func.isRequired,
  user: PropTypes.shape({
    signatureUrl: PropTypes.string,
  }),
};

SignatureRequired.defaultProps = {
  isLoading: true,
  user: {},
};
