/* eslint-disable no-undef */
import { formatDate } from '../date';

describe('formatDate', () => {
  const date = 'Mon Jan 01 2018 13:30:00 GMT+1100';

  it('should return an empty string when date is undefined', () => {
    const expected = '';
    const received = formatDate();
    expect(received).toBe(expected);
  });

  it(`should return default format when passed a key that doesn't match`, () => {
    const expected = '1 Jan 2018';
    const received = formatDate(date, 'fail');
    expect(received).toBe(expected);
  });

  it('should return short format by default', () => {
    const expected = '1 Jan 2018';
    const received = formatDate(date);
    expect(received).toBe(expected);
  });

  it('should return datetimeLocal', () => {
    const expected = '2018-01-01T13:30';
    const received = formatDate(date, 'datetimeLocal');
    expect(received).toBe(expected);
  });

  it('should return dateLocal', () => {
    const expected = '2018-01-01';
    const received = formatDate(date, 'dateLocal');
    expect(received).toBe(expected);
  });

  it(`should return short`, () => {
    const expected = '1 Jan 2018';
    const received = formatDate(date, 'short');
    expect(received).toBe(expected);
  });

  it(`should return shortDayMonth`, () => {
    const expected = '6 Oct';
    const received = formatDate('2019-10-06', 'shortDayMonth');
    expect(received).toBe(expected);
  });

  it(`should return shortNoYear`, () => {
    const expected = 'Sun 6 Oct';
    const received = formatDate('2019-10-06', 'shortNoYear');
    expect(received).toBe(expected);
  });

  it(`should return shortWithTime`, () => {
    const expected = '1 Jan 2018 at 1:30PM';
    const received = formatDate(date, 'shortWithTime');
    expect(received).toBe(expected);
  });

  it(`should return shortWithYear`, () => {
    const expected = 'Mon 1 Jan 2018';
    const received = formatDate(date, 'shortWithYear');
    expect(received).toBe(expected);
  });

  it(`should return timeShortDate`, () => {
    const expected = '1:30PM - 1 Jan';
    const received = formatDate(date, 'timeShortDate');
    expect(received).toBe(expected);
  });
});
