import Uppy from '@uppy/core';
import { DragDrop, StatusBar } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'reactstrap';
import localStorage from 'store';

import { selectMaxAttachmentFileSize } from '../../../redux/settings/selectors';
import { ATTACHMENT_EXTENSIONS } from '../../../utils';
import './styles.scss';

/**
 * Uploader form that uploads attachments to /api/attachments, and then
 * calls onComplete() with returned attachment ids. Intended for use with
 * forms attach the files after form has been submitted
 *
 * @param {string[]} allowedFileTypes allowed file extensions for upload
 * @param {function} onBeforeUpload optional callback for additional validation before files are uploaded
 * @param {function} onComplete callback for when files are successfully uploaded
 * @param {function} onError optional callback for additional error handling
 */
export const UploaderFormForIds = (props) => {
  const { allowedFileTypes, onBeforeUpload, onComplete, onError } = props;
  const maxAttachmentFileSize = useSelector(selectMaxAttachmentFileSize);
  const [errorMessage, setErrorMessage] = useState();

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
            onComplete(attachments);
          },
          getResponseError: (responseText) => {
            const error = JSON.parse(responseText);
            setErrorMessage(error);
            onError && onError(error);
          },
        }),
    [allowedFileTypes, onBeforeUpload, onComplete, onError]
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

UploaderFormForIds.propTypes = {
  allowedFileTypes: PropTypes.array,
  className: PropTypes.string,
  dragDropStrings: PropTypes.object,
  note: PropTypes.string,
  onBeforeUpload: PropTypes.func,
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
};
UploaderFormForIds.defaultProps = {
  allowedFileTypes: ATTACHMENT_EXTENSIONS,
};
