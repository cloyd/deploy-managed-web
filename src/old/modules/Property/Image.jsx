import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';

import srcDefault from '../../assets/spacer.svg';
import { ImageBackground } from '../Image';

export const PropertyImage = ({ src: imageSource, alertText }) => {
  const [src, setSrc] = useState(imageSource);

  function handleError() {
    setSrc(srcDefault);
  }

  return (
    <ImageBackground
      src={src}
      style={{ minHeight: '52px', maxHeight: '520px', overflow: 'hidden' }}
      alertText={alertText}>
      <img
        src={src}
        onError={handleError}
        style={{
          height: '100%',
          width: '100%',
          opacity: 0,
        }}
      />
    </ImageBackground>
  );
};

PropertyImage.propTypes = {
  src: PropTypes.string,
  alertText: PropTypes.string,
};

export default memo(PropertyImage);
