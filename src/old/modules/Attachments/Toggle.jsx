import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import { useImgSrcWithFallback } from '../../hooks';
import { ImageBackground } from '../Image';

export const AttachmentsToggle = ({ imgSrc, count, onClick }) => {
  const { imgSrc: src } = useImgSrcWithFallback(imgSrc);

  return (
    <ImageBackground
      className="rounded-sm d-block"
      src={src}
      style={{
        width: '50px',
        height: '50px',
      }}>
      <Button
        color="primary"
        className="d-flex align-items-end justify-content-end p-1"
        style={{
          width: '100%',
          height: '100%',
          padding: '3px',
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.2)',
          textShadow: '1px 1px #666666',
        }}
        onClick={onClick}>
        <strong>{count}</strong>
      </Button>
    </ImageBackground>
  );
};

AttachmentsToggle.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  imgSrc: PropTypes.string,
  onClick: PropTypes.func,
};

AttachmentsToggle.defaultProps = {
  count: 0,
};
