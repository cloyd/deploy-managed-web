import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import { UploaderDestroy } from '.';
import { AttachmentsIcon } from '../Attachments';

export const AttachmentFile = ({
  attachment,
  attachableId,
  attachableType,
  onDestroyComplete,
  isArchived,
  isAttachOnCreate,
}) => {
  return (
    <dd className="d-flex align-items-center mb-1 w-100">
      <span className="mr-1">
        {(attachableId && attachableType && onDestroyComplete) ||
        isAttachOnCreate ? (
          <UploaderDestroy
            attachableId={attachableId}
            attachableType={attachableType}
            attachmentId={attachment.id}
            onComplete={onDestroyComplete}
            customHandleRemove={isAttachOnCreate ? onDestroyComplete : null}
            isArchived={isArchived}
          />
        ) : (
          <FontAwesomeIcon
            icon={['far', 'cloud-upload']}
            className="btn-link"
          />
        )}
      </span>
      <a
        href={attachment?.urls?.original}
        className="btn-link py-1 text-truncate"
        title={attachment.filename}
        target="_blank"
        rel="noopener noreferrer"
        disabled={isArchived}>
        <AttachmentsIcon
          className="mr-1"
          contentType={attachment.contentType}
        />
        <small>{attachment.filename}</small>
      </a>
    </dd>
  );
};

AttachmentFile.propTypes = {
  attachment: PropTypes.object,
  attachableId: PropTypes.number,
  attachableType: PropTypes.string,
  onDestroyComplete: PropTypes.func,
  isArchived: PropTypes.bool,
  isAttachOnCreate: PropTypes.bool,
};
