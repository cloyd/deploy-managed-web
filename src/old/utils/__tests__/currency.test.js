/* eslint-disable no-undef */
import {
  centsToDollar,
  dollarToCents,
  formatNumberWithCommas,
  fromPercent,
  percentageOfAmountInCents,
  toCents,
  toDollarFormattedAmount,
  toDollars,
  toFortnightlyFromYear,
  toFrequencyAmountsCents,
  toMonthlyFromYear,
  toPercent,
  toPositive,
  toWeeklyFromYear,
  toYearAmountsCents,
  toYearlyFromFortnight,
  toYearlyFromMonth,
  toYearlyFromWeek,
} from '../currency';

describe('centsToDollar', () => {
  it('should convert number to currency string', () => {
    const expected = '$10';
    const received = centsToDollar(1000);
    expect(received).toBe(expected);
  });

  it('should convert string number to currency string', () => {
    const expected = '$10';
    const received = centsToDollar('1000');
    expect(received).toBe(expected);
  });

  it('should handle an undefined value', () => {
    const expected = '$0';
    const received = centsToDollar(undefined);
    expect(received).toBe(expected);
  });

  it('should handle a null value', () => {
    const expected = '$0';
    const received = centsToDollar(null);
    expect(received).toBe(expected);
  });

  it('should convert negative values to positive', () => {
    const expected = '$10';
    const received = centsToDollar(-1000);
    expect(received).toBe(expected);
  });

  it('should convert number and include 2 decimal places', () => {
    const expected = '$10.50';
    const received = centsToDollar(1050);
    expect(received).toBe(expected);
  });
});

describe('dollarToCents', () => {
  it('should convert decimal to integer', () => {
    const expected = 1000;
    const received = dollarToCents(10.0);
    expect(received).toBe(expected);
  });

  it('should convert string decimal to integer', () => {
    const expected = 1000;
    const received = dollarToCents('10.00');
    expect(received).toBe(expected);
  });

  it('should convert string decimal with symbol to integer', () => {
    const expected = 1000;
    const received = dollarToCents('$10.00');
    expect(received).toBe(expected);
  });

  it('should handle an undefined value', () => {
    const expected = 0;
    const received = dollarToCents(undefined);
    expect(received).toBe(expected);
  });

  it('should handle a null value', () => {
    const expected = 0;
    const received = dollarToCents(null);
    expect(received).toBe(expected);
  });
});

describe('formatNumberWithCommas', () => {
  it('should return value as string', () => {
    const expected = '110';
    const received = formatNumberWithCommas(110);
    expect(received).toBe(expected);
  });

  it('should return 555k separated by commas', () => {
    const expected = '555,000';
    const received = formatNumberWithCommas(555000);
    expect(received).toBe(expected);
  });

  it('should return 99m separated by commas', () => {
    const expected = '99,000,000';
    const received = formatNumberWithCommas(99000000);
    expect(received).toBe(expected);
  });
});

describe('fromPercent', () => {
  it('should return 0 by default', () => {
    const expected = 0;
    const received = fromPercent();
    expect(received).toBe(expected);
  });

  it('should return value multiplied by 100', () => {
    const expected = 110;
    const received = fromPercent(1.1);
    expect(received).toBe(expected);
  });

  it('should handle 2 decimal places', () => {
    const expected = 115;
    const received = fromPercent(1.15);
    expect(received).toBe(expected);
  });
});

describe('toCents', () => {
  it('should convert a dollar amount to cents', () => {
    const expected = 110;
    const received = toCents(1.1);
    expect(received).toBe(expected);
  });
});

describe('toDollarFormattedAmount', () => {
  it('should convert cents into small thousands string', () => {
    const expected = '$1,235';
    const received = toDollarFormattedAmount(123456);
    expect(received).toBe(expected);
  });

  it('should convert cents into medium thousands string', () => {
    const expected = '$12,346';
    const received = toDollarFormattedAmount(1234567);
    expect(received).toBe(expected);
  });

  it('should convert cents into large thousands string', () => {
    const expected = '$123,457';
    const received = toDollarFormattedAmount(12345678);
    expect(received).toBe(expected);
  });

  it('should convert cents into millions string', () => {
    const expected = '$2.00m';
    const received = toDollarFormattedAmount(200000000);
    expect(received).toBe(expected);
  });

  it('should convert cents into trillions string', () => {
    const expected = '$2.06t';
    const received = toDollarFormattedAmount(206000000000000);
    expect(received).toBe(expected);
  });

  it('should convert cents into large exponential string', () => {
    const expected = '$2.06e+17';
    const received = toDollarFormattedAmount(20600000000000000000);
    expect(received).toBe(expected);
  });
});

describe('toDollars', () => {
  it('should convert a cents amount to dollars when undefined', () => {
    const expected = '0.00';
    const received = toDollars();
    expect(received).toBe(expected);
  });

  it('should convert a cents amount to dollars', () => {
    const expected = '1.10';
    const received = toDollars(110);
    expect(received).toBe(expected);
  });
});

describe('toPercent', () => {
  it('should return 0.00 by default', () => {
    const expected = '0.00';
    const received = toPercent();
    expect(received).toBe(expected);
  });

  it('should return 1.10 by default', () => {
    const expected = '1.10';
    const received = toPercent(110);
    expect(received).toBe(expected);
  });
});

describe('toPositive', () => {
  it('should return 0 when passed an undefined value', () => {
    const expected = 0;
    const received = toPositive();
    expect(received).toBe(expected);
  });

  it('should return 0', () => {
    const expected = 0;
    const received = toPositive(0);
    expect(received).toBe(expected);
  });

  it('should return 1', () => {
    const expected = 1;
    const received = toPositive(1);
    expect(received).toBe(expected);
  });

  it('should return a positive number', () => {
    const expected = 1;
    const received = toPositive(-1);
    expect(received).toBe(expected);
  });
});

describe('toFortnightlyFromYear', () => {
  it('should return 0 when passed an undefined value', () => {
    const expected = 0;
    const received = toFortnightlyFromYear();
    expect(received).toBe(expected);
  });

  it('should return 14', () => {
    const expected = 14;
    const received = toFortnightlyFromYear(365);
    expect(received).toBe(expected);
  });
});

describe('toMonthlyFromYear', () => {
  it('should return 0 when passed an undefined value', () => {
    const expected = 0;
    const received = toMonthlyFromYear();
    expect(received).toBe(expected);
  });

  it('should return 1', () => {
    const expected = 1;
    const received = toMonthlyFromYear(12);
    expect(received).toBe(expected);
  });
});

describe('toWeeklyFromYear', () => {
  it('should return 0 when passed an undefined value', () => {
    const expected = 0;
    const received = toWeeklyFromYear();
    expect(received).toBe(expected);
  });

  it('should return 7', () => {
    const expected = 7;
    const received = toWeeklyFromYear(365);
    expect(received).toBe(expected);
  });
});

describe('toYearlyFromFortnight', () => {
  it('should return 0 when passed an undefined value', () => {
    const expected = 0;
    const received = toYearlyFromFortnight();
    expect(received).toBe(expected);
  });

  it('should return 365', () => {
    const expected = 365;
    const received = toYearlyFromFortnight(14);
    expect(received).toBe(expected);
  });
});

describe('toYearlyFromMonth', () => {
  it('should return 0 when passed an undefined value', () => {
    const expected = 0;
    const received = toYearlyFromMonth();
    expect(received).toBe(expected);
  });

  it('should return 12', () => {
    const expected = 12;
    const received = toYearlyFromMonth(1);
    expect(received).toBe(expected);
  });
});

describe('toYearlyFromWeek', () => {
  it('should return 0 when passed an undefined value', () => {
    const expected = 0;
    const received = toYearlyFromWeek();
    expect(received).toBe(expected);
  });

  it('should return 365', () => {
    const expected = 365;
    const received = toYearlyFromWeek(7);
    expect(received).toBe(expected);
  });
});

describe('toFrequencyAmountsCents', () => {
  it('should return 0 for weekly, fortnightly & monthly', () => {
    const expected = {
      weekly: 0,
      fortnightly: 0,
      monthly: 0,
    };
    const received = toFrequencyAmountsCents();
    expect(received).toEqual(expected);
  });

  it('should return weekly', () => {
    const expected = 365;
    const received = toFrequencyAmountsCents(7).weekly;
    expect(received).toEqual(expected);
  });

  it('should return fortnightly', () => {
    const expected = 365;
    const received = toFrequencyAmountsCents(14).fortnightly;
    expect(received).toEqual(expected);
  });

  it('should return monthly', () => {
    const expected = 12;
    const received = toFrequencyAmountsCents(1).monthly;
    expect(received).toEqual(expected);
  });
});

describe('toYearAmountsCents', () => {
  it('should return 0 for weekly, fortnightly & monthly', () => {
    const expected = {
      annually: 0,
      weekly: 0,
      fortnightly: 0,
      monthly: 0,
    };
    const received = toYearAmountsCents();
    expect(received).toEqual(expected);
  });

  it('should return annually', () => {
    const expected = 1;
    const received = toYearAmountsCents(1).annually;
    expect(received).toEqual(expected);
  });

  it('should return weekly', () => {
    const expected = 7;
    const received = toYearAmountsCents(365).weekly;
    expect(received).toEqual(expected);
  });

  it('should return fortnightly', () => {
    const expected = 14;
    const received = toYearAmountsCents(365).fortnightly;
    expect(received).toEqual(expected);
  });

  it('should return monthly', () => {
    const expected = 1;
    const received = toYearAmountsCents(12).monthly;
    expect(received).toEqual(expected);
  });

  describe('percentageOfAmountInCents', () => {
    it('should return 0 if no percentage given', () => {
      const expected = 0;
      const received = percentageOfAmountInCents(100);
      expect(received).toEqual(expected);
    });

    it('should return 400 when 4% of $100', () => {
      const expected = 400;
      const received = percentageOfAmountInCents(10000, 400);
      expect(received).toEqual(expected);
    });

    it('should return 2012.3328 when 1.63% of $1234.56', () => {
      const expected = 2012.3328;
      const received = percentageOfAmountInCents(123456, 163);
      expect(received).toEqual(expected);
    });
  });
});
