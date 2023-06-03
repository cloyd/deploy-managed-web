import Uppy from '@uppy/core';
import { DragDrop, StatusBar } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'reactstrap';
import localStorage from 'store';

import { selectMaxAttachmentFileSize } from '../../../redux/settings/selectors';
import { ATTACHMENT_EXTENSIONS, httpClient } from '../../../utils';
import './styles.scss';

/**
 * Uploader form for the original attachments upload workflow:
 * 1. Files are uploaded to /api/attachments
 * 2. Attachment IDs from returned data are posted to /attachments/attach
 * 3. On success, attachment data is passed into onComplete()
 *
 * @param {string[]} allowedFileTypes allowed file extensions for upload
 * @param {number} attachableId ID of the object to attach files to
 * @param {string} attachableType Model type of object to attach files to
 * @param {string} attachableCategory optional attachable_category of files
 * @param {function} onBeforeUpload optional callback for additional validation before files are uploaded
 * @param {function} onComplete callback for when files are successfully uploaded and attached to an object
 * @param {function} onError optional callback for additional error handling
 */
export const UploaderForm = (props) => {
  const {
    allowedFileTypes,
    attachableId,
    attachableType,
    attachableCategory,
    onBeforeUpload,
    onComplete,
    onError,
    setAttachments,
  } = props;
  const maxAttachmentFileSize = useSelector(selectMaxAttachmentFileSize);
  const [errorMessage, setErrorMessage] = useState();

  const attach = useCallback(
    (attachmentIds) => {
      httpClient
        .post('/attachments/attach', {
          attachableId,
          attachableType,
          attachableCategory,
          attachmentIds,
        })
        .then((response) => {
          onComplete({
            attachableId,
            attachments: response.data.attachments,
          });
        });
    },
    [attachableCategory, attachableId, attachableType, onComplete]
  );

  const uppy = useMemo(
    () =>
      Uppy({
        autoProceed: true,
        restrictions: {
          allowedFileTypes: allowedFileTypes,
          maxFileSize: maxAttachmentFileSize,
        },
        onBeforeUpload: (files) => {
          try {
            const uploadedFiles = onBeforeUpload(files);

            if (uploadedFiles === false) {
              uppy.reset();
            } else {
              return uploadedFiles;
            }
          } catch {
            return files;
          }
        },
      })
        .on('info-visible', () => {
          const info = uppy.getState().info;
          setErrorMessage(info.message);
        })
        .use(XHRUpload, {
          allowMultipleUploads: true,
          bundle: true,
          endpoint: '/api/attachments',
          headers: { Authorization: localStorage.get('authToken') },
          timeout: 0,
          getResponseData: (responseText) => {
            const { attachments } = JSON.parse(responseText);
            setErrorMessage();

            if (setAttachments) {
              setAttachments(
                Object.values(uppy.getState().files).map(({ name }, index) => ({
                  filename: name,
                  id: attachments[index],
                }))
              );
            } else if (attachableId && !setAttachments) {
              attach(attachments);
            }
          },
          getResponseError: (responseText) => {
            const error = JSON.parse(responseText);
            setErrorMessage(error);
            onError && onError(error);
          },
        }),
    [
      allowedFileTypes,
      attach,
      attachableId,
      onBeforeUpload,
      onError,
      setAttachments,
    ]
  );

  return (
    <div className={props.className}>
      <DragDrop
        locale={{ strings: props.dragDropStrings }}
        note={props.note}
        uppy={uppy}
      />
      <StatusBar uppy={uppy} hideAfterFinish showProgressDetails />
      {errorMessage && (
        <Alert className="my-3" color="danger">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
};

UploaderForm.propTypes = {
  allowedFileTypes: PropTypes.array,
  attachableId: PropTypes.number,
  attachableType: PropTypes.string,
  attachableCategory: PropTypes.string,
  className: PropTypes.string,
  dragDropStrings: PropTypes.object,
  note: PropTypes.string,
  onBeforeUpload: PropTypes.func,
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
  setAttachments: PropTypes.func,
};
UploaderForm.defaultProps = {
  // by default, only allow from total list of allowed extensions
  allowedFileTypes: ATTACHMENT_EXTENSIONS,
};
