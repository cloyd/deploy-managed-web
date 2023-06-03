import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Alert } from 'reactstrap';

import { useIsOpen } from '../../../hooks';
import { AttachmentsIcon } from '../../Attachments';
import { ButtonIcon } from '../../Button';
import { UploaderFormForIds } from '../Form/FormForIds';

/**
 * Upload field that updates a form field with file attachment_ids.
 * Intended for use with for forms that attach the files after form has been submitted.
 *
 * HACK: This widget shows a message when uploading files, as the Uppy status bar doesn't
 * appear to show for the above attachments flow.
 *
 * @param {string[]} allowedFileTypes allowed file extensions for upload
 * @param {function} onUploaderComplete callback for when attachmentIds changes
 */
export const UploaderWidgetIdsField = (props) => {
  const { error, onUploaderComplete } = props;
  const [isUploading, actions] = useIsOpen();
  const [attachmentIds, setAttachmentIds] = useState([]);
  const [filenames, setFilenames] = useState([]);

  const handleBeforeUpload = useCallback(
    (files) => {
      const metas = Object.values(files).map(
        (file) => file.meta?.name || 'unnamed file'
      );

      setFilenames([...filenames, ...metas]);
      actions.handleOpen();
      return true;
    },
    [actions, filenames]
  );

  const handleRemoveAttachment = useCallback(
    (index) => () => {
      let updatedAttachmentIds = [...attachmentIds];
      let updatedFilenames = [...filenames];

      updatedAttachmentIds.splice(index, 1);
      updatedFilenames.splice(index, 1);

      onUploaderComplete(updatedAttachmentIds);
      setAttachmentIds(updatedAttachmentIds);
      setFilenames(updatedFilenames);
    },
    [attachmentIds, filenames, onUploaderComplete]
  );

  const handleComplete = useCallback(
    (uploadedIds) => {
      const updatedIds = [...attachmentIds, ...uploadedIds];
      onUploaderComplete(updatedIds);
      setAttachmentIds(updatedIds);
      actions.handleClose();
    },
    [actions, attachmentIds, onUploaderComplete]
  );

  return (
    <>
      {error && <Alert color="danger">{error}</Alert>}
      <Attachments
        attachmentIds={attachmentIds}
        filenames={filenames}
        onRemove={handleRemoveAttachment}
      />
      {isUploading && (
        <small className="my-3 d-flex">
          <PulseLoader size={8} color="#dee2e6" />{' '}
          <span className="ml-2">Uploading file(s)</span>
        </small>
      )}
      <UploaderFormForIds
        note={props.note}
        onBeforeUpload={handleBeforeUpload}
        onComplete={handleComplete}
        onError={actions.handleClose}
      />
    </>
  );
};

UploaderWidgetIdsField.propTypes = {
  allowedFileTypes: PropTypes.array,
  error: PropTypes.string,
  note: PropTypes.string,
  onUploaderComplete: PropTypes.func.isRequired,
};

const Attachments = (props) => {
  const { attachmentIds, filenames, onRemove } = props;

  return attachmentIds?.map((id, index) => (
    <p className="mb-1" key={`attachment-${id}`}>
      <ButtonIcon
        className="p-0 pb-1 mr-2"
        icon={['far', 'times-circle']}
        size="sm"
        onClick={onRemove(index)}
      />
      <AttachmentsIcon filename={filenames[index]} /> {filenames[index]}
    </p>
  ));
};

Attachments.propTypes = {
  attachmentIds: PropTypes.array,
  filenames: PropTypes.array,
  onRemove: PropTypes.func,
};
