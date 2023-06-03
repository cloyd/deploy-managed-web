import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'reactstrap';

import srcDefault from '../../assets/spacer.svg';
import { useIsOpen } from '../../hooks';

export const ImageBackground = ({ src, style, alertText, ...props }) => {
  const [isOpen, actions] = useIsOpen(undefined, true);
  const { handleToggle } = actions;

  return (
    <>
      {alertText && (
        <Alert
          className="bg-white position-absolute mb-0 mt-1 mx-auto box-shadow-alert-primary rounded"
          style={{ width: '60%', zIndex: 1 }}
          isOpen={isOpen}
          toggle={handleToggle}
          color="white">
          <FontAwesomeIcon
            className="mr-1"
            icon={['fas', 'exclamation-triangle']}
          />
          <strong>{` Alert - `}</strong>
          {alertText}
        </Alert>
      )}
      <div
        style={{
          backgroundImage: `url('${src || srcDefault}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: '100%',
          height: '100%',
          ...style,
        }}
        {...props}
      />
    </>
  );
};

ImageBackground.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object,
  alertText: PropTypes.string,
};

ImageBackground.defaultProps = {
  src: srcDefault,
  style: {},
};
