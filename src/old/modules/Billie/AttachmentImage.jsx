import PropTypes from 'prop-types';
import React from 'react';

import { ImageBackground } from '../Image';

export const BillieAttachmentImage = ({ attachment, onClick }) => {
  let fileExtension = attachment.filename.split('.').pop();
  let fileName = attachment.filename.replace(fileExtension, '');
  let longFileName = fileName.length > 20;
  return (
    <ImageBackground
      className="card-img pointer d-flex align-items-center justify-content-center"
      onClick={!!onClick && onClick}
      src={attachment.urls.thumb}
      style={{
        width: '100%',
        height: '100%',
      }}>
      {attachment.urls.thumb ? (
        <img
          src={attachment.urls.thumb}
          style={{
            height: '100%',
            width: '100%',
            opacity: 0,
          }}
        />
      ) : (
        <div
          className="text-left"
          style={{
            width: '100%',
            height: '100%',
            padding: '10px',
            fontSize: '12px',
          }}>
          {longFileName
            ? fileName.slice(0, 20) + '...' + fileExtension
            : attachment.filename}
        </div>
      )}
    </ImageBackground>
  );
};

BillieAttachmentImage.propTypes = {
  attachment: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};
