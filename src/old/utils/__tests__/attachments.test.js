/* eslint-disable no-undef */
import {
  ATTACHMENT_CATEGORIES,
  featureImage,
  featurePropertyImage,
  imageSrc,
  imageSrcLarge,
  imageSrcMedium,
  imageSrcOriginal,
  imageSrcThumb,
  isAgencyAgreement,
  isConditionReport,
  isImageType,
  isLeaseAgreement,
  isPropertyImage,
  isStrataByLaws,
  isTaskAttachment,
} from '../attachments';

describe('featureImage', () => {
  it('should return undefined by default', () => {
    const received = featureImage();
    const expected = undefined;
    expect(received).toBe(expected);
  });

  it('should return the first image type attachement', () => {
    const received = featureImage([
      { contentType: 'file', id: 1 },
      { contentType: 'image', id: 2 },
      { contentType: 'image', id: 3 },
    ]);
    const expected = 2;

    expect(received.id).toBe(expected);
  });
});

describe('featurePropertyImage', () => {
  it('should return undefined by default', () => {
    const received = featurePropertyImage();
    const expected = undefined;
    expect(received).toBe(expected);
  });

  it('should return the first image type attachement', () => {
    const received = featurePropertyImage([
      { attachableCategory: ATTACHMENT_CATEGORIES.agencyAgreement, id: 1 },
      { attachableCategory: ATTACHMENT_CATEGORIES.strataByLaws, id: 2 },
      { attachableCategory: ATTACHMENT_CATEGORIES.propertyImage, id: 3 },
      { attachableCategory: ATTACHMENT_CATEGORIES.propertyImage, id: 4 },
      { attachableCategory: ATTACHMENT_CATEGORIES.strataByLaws, id: 5 },
    ]);
    const expected = 3;

    expect(received.id).toBe(expected);
  });
});

describe('imageSrc', () => {
  it('should return a curried function', () => {
    const received = imageSrc('thumb');
    const expected = Function;
    expect(received).toBeInstanceOf(expected);
  });

  it('should return the url size', () => {
    const received = imageSrc('thumb')({ urls: { thumb: '/path/to/thumb' } });
    const expected = '/path/to/thumb';
    expect(received).toBe(expected);
  });
});

describe('imageSrcLarge', () => {
  it('should return the url for large', () => {
    const received = imageSrcLarge({ urls: { large: '/path/to/large' } });
    const expected = '/path/to/large';
    expect(received).toBe(expected);
  });
});

describe('imageSrcMedium', () => {
  it('should return the url for medium', () => {
    const received = imageSrcMedium({ urls: { medium: '/path/to/medium' } });
    const expected = '/path/to/medium';
    expect(received).toBe(expected);
  });
});

describe('imageSrcOriginal', () => {
  it('should return the url for original', () => {
    const received = imageSrcOriginal({
      urls: { original: '/path/to/original' },
    });
    const expected = '/path/to/original';
    expect(received).toBe(expected);
  });
});

describe('imageSrcThumb', () => {
  it('should return the url for thumb', () => {
    const received = imageSrcThumb({ urls: { thumb: '/path/to/thumb' } });
    const expected = '/path/to/thumb';
    expect(received).toBe(expected);
  });
});

describe('isImageType', () => {
  it('should return true', () => {
    const received = isImageType({ contentType: 'image' });
    const expected = true;
    expect(received).toBe(expected);
  });

  it('should return false', () => {
    const received = isImageType({ contentType: 'file' });
    const expected = false;
    expect(received).toBe(expected);
  });
});

describe('isAgencyAgreement', () => {
  it('should return true', () => {
    const received = isAgencyAgreement({
      attachableCategory: ATTACHMENT_CATEGORIES.agencyAgreement,
    });
    const expected = true;
    expect(received).toBe(expected);
  });
});

describe('isConditionReport', () => {
  it('should return true', () => {
    const received = isConditionReport({
      attachableCategory: ATTACHMENT_CATEGORIES.conditionReport,
    });
    const expected = true;
    expect(received).toBe(expected);
  });
});

describe('isLeaseAgreement', () => {
  it('should return true', () => {
    const received = isLeaseAgreement({
      attachableCategory: ATTACHMENT_CATEGORIES.leaseAgreement,
    });
    const expected = true;
    expect(received).toBe(expected);
  });
});

describe('isPropertyImage', () => {
  it('should return true', () => {
    const received = isPropertyImage({
      attachableCategory: ATTACHMENT_CATEGORIES.propertyImage,
    });
    const expected = true;
    expect(received).toBe(expected);
  });
});

describe('isStrataByLaws', () => {
  it('should return true', () => {
    const received = isStrataByLaws({
      attachableCategory: ATTACHMENT_CATEGORIES.strataByLaws,
    });
    const expected = true;
    expect(received).toBe(expected);
  });
});

describe('isTaskAttachment', () => {
  it('should return true', () => {
    const received = isTaskAttachment({
      attachableCategory: ATTACHMENT_CATEGORIES.taskAttachment,
    });
    const expected = true;
    expect(received).toBe(expected);
  });
});
