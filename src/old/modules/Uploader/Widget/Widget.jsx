import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Alert } from 'reactstrap';

import { UploaderFiles } from '../Files';
import { UploaderForm } from '../Form';

/**
 * Widget for the original attachments workflow:
 *
 * Upload
 * 1. Files are uploaded to /api/attachments
 * 2. Attachment IDs from returned data are posted to /attachments/attach
 * 3. On success, attachment data is passed into onUploaderComplete()
 *
 * Remove
 * 1. Attachment id to remove is passed to /attachments/remove
 * 2. On success, updated attachments list is returned and passed into onUploaderComplete()
 *
 * @param {string[]} allowedFileTypes allowed file extensions for upload
 * @param {number} attachableId ID of the object to attach files to
 * @param {string} attachableType Model type of object to attach files to
 * @param {string} attachableCategory optional attachable_category of files
 * @param {Object[]} attachments list of attachments
 * @param {function} onUploaderComplete callback called when list of attachments updates
 */
export const UploaderWidget = (props) => {
  const { error, maxNumFiles, setAttachments } = props;
  const [errorMessage, setErrorMessage] = useState(false);

  const handleBeforeUpload = useCallback(
    (files) => {
      // Validate Number of files uploaded
      if (files && Object.keys(files).length <= maxNumFiles) {
        setErrorMessage(null);
        return files;
      } else {
        setErrorMessage(
          maxNumFiles === 1
            ? 'Please only upload 1 file'
            : `Please upload less than ${maxNumFiles} files`
        );
        return false;
      }
    },
    [maxNumFiles]
  );

  return (
    <>
      {(error || errorMessage) && (
        <Alert color="danger">{error || errorMessage}</Alert>
      )}
      {props.attachments.length > 0 && (
        <UploaderFiles
          attachments={props.attachments}
          attachableType={props.attachableType}
          attachableId={props.attachableId}
          onDestroyComplete={props.onUploaderComplete}
          isAttachOnCreate={props.isAttachOnCreate}
        />
      )}
      <UploaderForm
        allowedFileTypes={props.allowedFileTypes}
        attachableType={props.attachableType}
        attachableId={props.attachableId}
        attachableCategory={props.attachableCategory}
        note={props.note}
        onBeforeUpload={maxNumFiles ? handleBeforeUpload : null}
        onComplete={props.onUploaderComplete}
        setAttachments={setAttachments}
      />
    </>
  );
};

UploaderWidget.propTypes = {
  allowedFileTypes: PropTypes.array,
  attachments: PropTypes.array,
  attachableCategory: PropTypes.string,
  attachableId: PropTypes.number,
  attachableType: PropTypes.string,
  error: PropTypes.string,
  maxNumFiles: PropTypes.number,
  note: PropTypes.string,
  onUploaderComplete: PropTypes.func.isRequired,
  setAttachments: PropTypes.func,
  isAttachOnCreate: PropTypes.bool,
};

UploaderWidget.defaultProps = {
  attachments: [],
  isAttachOnCreate: false,
};
