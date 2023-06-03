/* eslint-disable no-undef */
import { isFileImage, isFilePdf, isFileVideo } from '../isFileType';

describe('httpClient', () => {
  describe('isFileImage', () => {
    it('should return true', () => {
      const received = isFileImage('test.png');
      const expected = true;
      expect(received).toBe(expected);
    });

    it('should return false', () => {
      const received = isFileImage('foo.mp4');
      const expected = false;
      expect(received).toBe(expected);
    });
  });

  describe('isFilePdf', () => {
    it('should return true', () => {
      const received = isFilePdf('test.pdf');
      const expected = true;
      expect(received).toBe(expected);
    });

    it('should return false', () => {
      const received = isFilePdf('foo.mp4');
      const expected = false;
      expect(received).toBe(expected);
    });
  });

  describe('isFileVideo', () => {
    it('should return true', () => {
      const received = isFileVideo('test.mov');
      const expected = true;
      expect(received).toBe(expected);
    });

    it('should return false', () => {
      const received = isFileVideo('foo.jpg');
      const expected = false;
      expect(received).toBe(expected);
    });
  });
});
