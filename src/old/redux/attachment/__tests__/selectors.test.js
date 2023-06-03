import { getAttachment, getAttachments } from '..';

describe('attachment/selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      result: null,
      results: [],
      data: {
        1: { id: 1, filename: 'file-1' },
        2: { id: 1, filename: 'file-2' },
        3: { id: 1, filename: 'file-3' },
      },
    };
  });

  describe('getAttachment', () => {
    it('should return an empty object by default', () => {
      const received = getAttachment(state, undefined);
      const expected = {};
      expect(received).toEqual(expected);
    });

    it('should return attachment by id', () => {
      const received = getAttachment(state, 2);
      const expected = state.data[2];
      expect(received).toEqual(expected);
    });
  });

  describe('getAttachments', () => {
    it('should return an empty array by default', () => {
      const received = getAttachments(state);
      const expected = [];
      expect(received).toEqual(expected);
    });

    it('should return attachments based on result orders by id', () => {
      const received = getAttachments({ ...state, results: [2, 1] });
      const expected = [state.data[2], state.data[1]];
      expect(received).toEqual(expected);
    });
  });
});
