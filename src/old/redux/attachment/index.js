import { reducer } from './reducer';

export default reducer;
export { initialState } from './reducer';
export { logic } from './logic';

// Actions
export {
  fetchAgencyAttachments,
  fetchAttachments,
  markAttached,
  updateAttachments,
  updateAttachmentTask,
} from './actions';

// Selectors
export { getAttachment, getAttachments } from './selectors';
