import PropTypes from 'prop-types';
import React from 'react';

import { UploaderDestroy } from '.';
import { imageSrcThumb } from '../../utils';

export const ImageFile = ({
  attachment,
  attachableId,
  attachableType,
  onDestroyComplete,
  isArchived,
}) => {
  const imageSrc = imageSrcThumb(attachment);

  return (
    <dd className="d-flex">
      <div className="mb-3 mr-3 position-relative">
        <UploaderDestroy
          attachableId={attachableId}
          attachableType={attachableType}
          attachmentId={attachment.id}
          className="position-absolute"
          style={{ top: '-8px', right: '-8px' }}
          onComplete={onDestroyComplete}
          isArchived={isArchived}
        />
        <img src={imageSrc} width={100} />
      </div>
    </dd>
  );
};

ImageFile.propTypes = {
  attachment: PropTypes.object,
  attachableId: PropTypes.number,
  attachableType: PropTypes.string,
  onDestroyComplete: PropTypes.func,
  isArchived: PropTypes.bool,
};
