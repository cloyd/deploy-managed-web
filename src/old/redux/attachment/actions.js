import { ATTACHED, FETCH_ALL, UPDATE_ALL, UPDATE_TASK } from './constants';

export const fetchAttachments = (params) => {
  return {
    type: FETCH_ALL,
    payload: { params },
  };
};

export const fetchAgencyAttachments = ({ agencyId, isLoading = true }) => {
  return fetchAttachments({
    attachableId: agencyId,
    attachableType: 'Agency',
    isLoading,
  });
};

export const markAttached = (attachmentId) => {
  return {
    type: ATTACHED,
    payload: { attachmentId },
  };
};

export const updateAttachments = ({ attachments }) => {
  return {
    type: UPDATE_ALL,
    payload: { attachments },
  };
};

export const updateAttachmentTask = ({ attachmentId, propertyId, taskId }) => {
  return {
    type: UPDATE_TASK,
    payload: { attachmentId, propertyId, taskId },
  };
};
