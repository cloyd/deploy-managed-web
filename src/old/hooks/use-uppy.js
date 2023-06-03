import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { useCallback, useMemo } from 'react';
import localStorage from 'store';

import { ATTACHMENT_EXTENSIONS, httpClient } from '../utils';

export const useUppy = ({
  attachableId,
  attachableType,
  attachableCategory,
  allowedFileTypes,
  onComplete,
  onError,
  maxAttachmentFileSize,
}) => {
  const handleResponse = useCallback(
    async (responseText) => {
      const response = await httpClient.post('/attachments/attach', {
        attachableId,
        attachableType,
        attachableCategory,
        attachmentIds: JSON.parse(responseText).attachments,
      });

      if (onComplete && response.data.attachments) {
        onComplete({
          attachableId,
          attachments: response.data.attachments,
        });
      }
    },
    [attachableId, attachableType, attachableCategory, onComplete]
  );

  const handleError = useCallback(
    (responseText) => {
      !!onError && onError(JSON.parse(responseText));
    },
    [onError]
  );

  return useMemo(() => {
    const uppy = Uppy({
      autoProceed: true,
      restrictions: {
        allowedFileTypes: allowedFileTypes || ATTACHMENT_EXTENSIONS,
        maxFileSize: maxAttachmentFileSize,
      },
    });

    uppy.use(XHRUpload, {
      bundle: true,
      formData: true,
      endpoint: '/api/attachments',
      headers: { Authorization: localStorage.get('authToken') },
      getResponseData: handleResponse,
      getResponseError: handleError,
    });

    return uppy;
  }, [allowedFileTypes, handleResponse, handleError]);
};
