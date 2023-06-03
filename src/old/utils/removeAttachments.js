import { httpClient } from './httpClient';

export const removeAttachments = (params, onComplete) =>
  httpClient.delete('/attachments/remove', { params }).then((response) =>
    onComplete({
      attachableId: params.attachableId,
      attachments: response.data.attachments,
    })
  );
