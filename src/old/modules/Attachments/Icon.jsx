import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import { isFileImage, isFilePdf, isFileVideo } from '../../utils';

export const AttachmentsIcon = (props) => {
  const { className, filename, size } = props;

  const iconName = isFileVideo(filename)
    ? 'file-video'
    : isFilePdf(filename)
    ? 'file-pdf'
    : isFileImage(filename)
    ? 'file-image'
    : 'file-download';

  return (
    <FontAwesomeIcon
      className={className}
      icon={['far', iconName]}
      size={size}
    />
  );
};

AttachmentsIcon.propTypes = {
  className: PropTypes.string,
  filename: PropTypes.string,
  size: PropTypes.string,
};

AttachmentsIcon.defaultProps = {
  filename: '',
  size: 'sm',
};
