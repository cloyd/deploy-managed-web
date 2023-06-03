import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';

import defaultImage from '../../assets/brand-default.webp';
import tinyDefaultImage from '../../assets/tiny-brand-default.webp';

// TODO: add blur when thumbnail images are ready (need be changes)
const LazyLoadImage = ({
  src = defaultImage,
  // eslint-disable-next-line no-unused-vars
  thumbnail = tinyDefaultImage,
  alt = '',
}) => {
  const [imageSource] = useProgressiveImg(thumbnail, src);

  return (
    <img
      alt={alt}
      src={imageSource || defaultImage}
      className="use-progressive-img"
      // TODO: add blur when thumbnail images are ready (need be changes)
      // className={`use-progressive-img ${blur ? 'blur' : ''}`}
    />
  );
};

LazyLoadImage.propTypes = {
  src: PropTypes.string,
  thumbnail: PropTypes.string,
  alt: PropTypes.string,
};

export default memo(LazyLoadImage);

const useProgressiveImg = (lowQualitySrc, highQualitySrc) => {
  const [src, setSrc] = useState(lowQualitySrc);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const img = new Image();
    img.src = highQualitySrc;

    img.onload = () => {
      setSrc(highQualitySrc);
    };
  }, [lowQualitySrc, highQualitySrc]);

  return [src, { blur: src === lowQualitySrc }];
};
