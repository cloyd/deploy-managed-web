import FileInput from '@uppy/file-input';
import { StatusBar } from '@uppy/react';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { useUppy } from '../../hooks';
import { selectMaxAttachmentFileSize } from '../../redux/settings/selectors';

export const UploaderButton = ({ label, ...props }) => {
  const maxAttachmentFileSize = useSelector(selectMaxAttachmentFileSize);
  const uppy = useUppy({ ...props, maxAttachmentFileSize });
  const uppyRef = useRef(uppy);
  const ref = useRef();

  useEffect(() => {
    if (uppyRef.current?.use) {
      uppyRef.current.use(FileInput, {
        target: ref.current,
        replaceTargetContent: false,
        pretty: true,
        locale: {
          strings: {
            chooseFiles: label,
          },
        },
      });
    }

    return () => {
      uppyRef.current = undefined;
    };
  }, [label, uppyRef]);

  return (
    <div>
      <StatusBar uppy={uppy} hideAfterFinish />
      <div className="btn-link" ref={ref} />
    </div>
  );
};

UploaderButton.propTypes = {
  allowedFileTypes: PropTypes.array,
  attachableId: PropTypes.number.isRequired,
  attachableType: PropTypes.string.isRequired,
  attachableCategory: PropTypes.string.isRequired,
  label: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

UploaderButton.defaultProps = {
  label: 'Upload File',
};
