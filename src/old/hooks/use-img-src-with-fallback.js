import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import * as imageDefault from '../assets/brand-default.webp';

export const useImgSrcWithFallback = (src) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = useCallback(() => {
    setImgSrc(imageDefault);
  }, []);

  return {
    handleError,
    imgSrc,
  };
};

useImgSrcWithFallback.PropTypes = {
  src: PropTypes.string,
};
