import PropTypes from 'prop-types';
import React from 'react';

import { AttachmentFile } from './AttachmentFile';
import { ImageFile } from './ImageFile';

export const UploaderFiles = ({
  attachments,
  attachableId,
  attachableType,
  className,
  onDestroyComplete,
  isArchived,
  isAttachOnCreate,
}) => {
  return attachments.length > 0 ? (
    <dl className={className}>
      {attachments.map((attachment) =>
        attachment.attachableCategory === 'property_image' ? (
          <ImageFile
            key={`attachment-${attachment.id}`}
            attachment={attachment}
            attachableId={attachableId}
            attachableType={attachableType}
            onDestroyComplete={onDestroyComplete}
            isArchived={isArchived}
            isAttachOnCreate={isAttachOnCreate}
          />
        ) : (
          <AttachmentFile
            key={`attachment-${attachment.id}`}
            attachment={attachment}
            attachableId={attachableId}
            attachableType={attachableType}
            onDestroyComplete={onDestroyComplete}
            isArchived={isArchived}
            isAttachOnCreate={isAttachOnCreate}
          />
        )
      )}
    </dl>
  ) : (
    <>-</>
  );
};

UploaderFiles.defaultProps = {
  attachments: [],
  className: '',
  isAttachOnCreate: false,
};

UploaderFiles.propTypes = {
  attachments: PropTypes.array,
  attachableId: PropTypes.number,
  attachableType: PropTypes.string,
  className: PropTypes.string,
  onDestroyComplete: PropTypes.func,
  isArchived: PropTypes.bool,
  isAttachOnCreate: PropTypes.bool,
};
