import Uppy from '@uppy/core';
import { DragDrop, StatusBar } from '@uppy/react';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'reactstrap';

import { selectMaxAttachmentFileSize } from '../../../redux/settings/selectors';
import { ATTACHMENT_EXTENSIONS } from '../../../utils';
import './styles.scss';

export const UploaderFormForCanvas = (props) => {
  const { allowedFileTypes, dragDropStrings, note, onComplete, onError } =
    props;
  const maxAttachmentFileSize = useSelector(selectMaxAttachmentFileSize);
  const [errorMessage, setErrorMessage] = useState();

  const uppy = useMemo(
    () =>
      Uppy({
        autoProceed: true,
        restrictions: {
          allowedFileTypes: allowedFileTypes || ATTACHMENT_EXTENSIONS,
          maxFileSize: maxAttachmentFileSize,
          maxNumberOfFiles: 1,
        },
      })
        .on('file-added', (file) => onComplete(file))
        .on('info-visible', () => {
          const info = uppy.getState().info;
          setErrorMessage(info.message);
        })
        .on('error', (error) => onError && onError(error)),

    [allowedFileTypes, onComplete, onError]
  );

  return (
    <div className={props.className}>
      <DragDrop uppy={uppy} locale={{ strings: dragDropStrings }} note={note} />
      <StatusBar uppy={uppy} hideAfterFinish showProgressDetails />
      {errorMessage && (
        <Alert className="my-3" color="danger">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
};

UploaderFormForCanvas.propTypes = {
  allowedFileTypes: PropTypes.array,
  className: PropTypes.string,
  dragDropStrings: PropTypes.object,
  note: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
};
UploaderFormForCanvas.defaultProps = {
  allowedFileTypes: ATTACHMENT_EXTENSIONS,
};
