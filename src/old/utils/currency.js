export const centsToDollar = (value, hasZeros = false) => {
  const dollars = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(toPositive(value / 100));

  return hasZeros ? dollars : dollars.replace(/\.00$/, '');
};

export const dollarToCents = (value) => {
  return toCents(`${value || 0}`.match(/[+-]?\d+(\.\d+)?/g)[0]);
};

export const formatNumberWithCommas = (value) => {
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const fromPercent = (value = 0) => {
  return Math.round(value * 100);
};

export const roundTo = (num, decimals = 2) => {
  return +(+num).toFixed(decimals);
};

export const toCents = (value) => {
  return toPositive(fromPercent(value));
};

export const toDollars = (value = 0) => {
  return toDollarAmount(value).toFixed(2);
};

export const toDollarAmount = (value = 0) => {
  return toPositive(value / 100);
};

export const toDollarFormattedAmount = (value = 0) => {
  const amount = toDollarAmount(value);

  return amount >= 1.0e15
    ? `$${amount.toExponential(2)}`
    : amount >= 1.0e12 && amount < 1.0e15
    ? `$${(amount / 1.0e12).toFixed(2)}t`
    : amount >= 1.0e9 && amount < 1.0e12
    ? `$${(amount / 1.0e9).toFixed(2)}b`
    : amount >= 1.0e6 && amount < 1.0e9
    ? `$${(amount / 1.0e6).toFixed(2)}m`
    : `$${formatNumberWithCommas(amount.toFixed(0))}`;
};

export const toPercent = (value = 0) => {
  return (value / 100).toFixed(2);
};

export const toPercentAmount = (value) => {
  return Number(toPercent(value));
};

export const toPercentFormattedAmount = (value) => {
  return `${toPercentAmount(value)}%`;
};

export const toPositive = (value) => {
  return value ? Math.abs(value) : 0;
};

export const toFortnightlyFromYear = (value = 0) => {
  return (value / 365) * 14;
};

export const toMonthlyFromYear = (value = 0) => {
  return value / 12;
};

export const toWeeklyFromYear = (value = 0) => {
  return (value / 365) * 7;
};

export const toYearlyFromFortnight = (value = 0) => {
  return (value / 14) * 365;
};

export const toYearlyFromMonth = (value = 0) => {
  return value * 12;
};

export const toYearlyFromWeek = (value = 0) => {
  return (value / 7) * 365;
};

export const toFrequencyAmountsCents = (value = 0) => {
  return {
    weekly: toYearlyFromWeek(value),
    fortnightly: toYearlyFromFortnight(value),
    monthly: toYearlyFromMonth(value),
  };
};

export const toYearAmountsCents = (annually = 0) => {
  return {
    annually,
    weekly: toWeeklyFromYear(annually),
    fortnightly: toFortnightlyFromYear(annually),
    monthly: toMonthlyFromYear(annually),
  };
};

export const percentageOfAmountInCents = (valueCents = 0, percent = 0) =>
  (valueCents * toPercent(percent)) / 100;
