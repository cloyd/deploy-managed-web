import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';
import addMonths from 'date-fns/addMonths';
import addWeeks from 'date-fns/addWeeks';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import eachYearOfInterval from 'date-fns/eachYearOfInterval';
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isPast from 'date-fns/isPast';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import isSameYear from 'date-fns/isSameYear';
import isToday from 'date-fns/isToday';
import lastDayOfQuarter from 'date-fns/lastDayOfQuarter';
import setDate from 'date-fns/setDate';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import startOfQuarter from 'date-fns/startOfQuarter';
import subDays from 'date-fns/subDays';
import subMonths from 'date-fns/subMonths';
import subQuarters from 'date-fns/subQuarters';
import subWeeks from 'date-fns/subWeeks';
import subYears from 'date-fns/subYears';

export const INPUT_FORMATS = [
  'dd-MM-yyyy',
  'dd/MM/yyyy',
  'dd-MM-yy',
  'dd/MM/yy',
];

export const formats = {
  au: 'dd-MM-yyyy',
  datetimeLocal: "yyyy-MM-dd'T'HH:mm",
  dateLocal: 'yyyy-MM-dd', // 2019-12-01
  fullMonthYear: 'MMMM yyyy',
  short: 'd MMM yyyy', // 1 Jan 2018
  shortDayMonth: 'd MMM', // 1 Jan
  shortDayMonthYear: 'd MMM yy', // 1 Jan 23
  shortNoYear: 'EEE d MMM', // Mon 1 Jan
  shortWithTime: "d MMM yyyy 'at' h:mma", // 1 Jan 2018 at 1.30pm
  shortWithYear: 'EEE d MMM yyyy', // Mon 1 Jan 2019
  timeShortDate: 'h:mma - d MMM', // 1:30pm - 1 Jan
  time: 'h:mm', // 1:30
  timeMeridian: 'h:mmaaa', // 1:30pm
};

export const formatDate = (date, key) => {
  return date ? format(new Date(date), formats[key] || formats['short']) : '';
};

export const formatDateRange = (startsAt, endsAt) => {
  return [
    formatDate(startsAt, 'shortWithYear'),
    '-',
    formatDate(startsAt, 'time'),
    'to',
    formatDate(endsAt, 'timeMeridian'),
  ].join(' ');
};

export const lackingDays = (difference, daysInFrequency) => {
  const lacking = difference % daysInFrequency;

  if (lacking > 0) {
    return daysInFrequency - lacking;
  } else if (lacking < 0) {
    return Math.abs(lacking);
  } else {
    return lacking;
  }
};

export const nextEffectiveDate = (date, startDate, frequency) => {
  let effectiveDate = startOfDay(new Date(+date));

  if (frequency === 'monthly') {
    const dayOfMonth = date.getDate();
    const startDayOfMonth = startDate.getDate();
    const lastDateofStartingMonth = endOfMonth(startDate);

    if (dayOfMonth > startDayOfMonth) {
      effectiveDate = addMonths(effectiveDate, 1);

      // if lease start date is end of month
      if (startDayOfMonth === endOfMonth(startDate).getDate()) {
        return (effectiveDate = setDate(
          effectiveDate,
          endOfMonth(addMonths(date, 1)).getDate()
        ));
      }
    }

    if (
      isSameDate(startDate, lastDateofStartingMonth) ||
      startDayOfMonth > getDaysInMonth(date)
    ) {
      effectiveDate = setDate(effectiveDate, endOfMonth(date).getDate());
    } else {
      effectiveDate = setDate(effectiveDate, startDayOfMonth);
    }
  } else {
    const daysInPeriod = frequency === 'fortnightly' ? 14 : 7;
    const difference = differenceInCalendarDays(date, startDate);

    effectiveDate = addDays(
      effectiveDate,
      lackingDays(difference, daysInPeriod)
    );
  }

  return effectiveDate;
};

const isSameDate = (firstDate, secondDate) => {
  return (
    isSameDay(new Date(firstDate), new Date(secondDate)) &&
    isSameMonth(new Date(firstDate), new Date(secondDate)) &&
    isSameYear(new Date(firstDate), new Date(secondDate))
  );
};

export const middayToday = () => {
  return addHours(startOfDay(new Date()), 12);
};

export const startOfToday = () => {
  return startOfDay(new Date());
};

export const datePlusOneWeek = () => {
  return addWeeks(new Date(), 1);
};

export const daysAgo = (value) => {
  return subDays(new Date(), value);
};

export const isInFuture = (value) => {
  return isAfter(new Date(value), new Date());
};

export const isInPast = (value) => {
  return isPast(new Date(value)) && !isToday(new Date(value));
};

export const isOverFortnightAgo = (value) => {
  return value < daysAgo(14);
};

export const pastDay = (value) => {
  return [subDays(new Date(), value), new Date()];
};

export const daysBetween = (dateA, dateB = new Date()) => {
  return differenceInCalendarDays(new Date(dateA), new Date(dateB));
};

export const weeksAgo = (value) => {
  return subWeeks(new Date(), value);
};

export const pastWeek = (value) => {
  return [subWeeks(new Date(), value), new Date()];
};

export const monthsAgo = (value) => {
  return subMonths(startOfMonth(new Date()), value);
};

export const nextDay = (value) => {
  return addDays(new Date(value), 1);
};

export const lastMonth = (value) => {
  const date = subMonths(new Date(), value);
  return [startOfMonth(date), endOfMonth(date)];
};

export const thisMonth = (value) => {
  return [startOfMonth(new Date()), new Date()];
};

export const timeAgoInWords = (value) => {
  return `${formatDistanceToNowStrict(new Date(value))} ago`;
};

export const yearsAgo = (value) => {
  return subYears(new Date(), value);
};

export const thisFinancialYear = () => {
  let currentMonth = getMonth(new Date());
  let currentYear = getYear(new Date());
  let startDate, endDate;

  if (currentMonth >= 6) {
    startDate = new Date(currentYear, 6, 1);
    endDate = new Date(currentYear + 1, 5, 30);
  } else {
    startDate = new Date(currentYear - 1, 6, 1);
    endDate = new Date(currentYear, 5, 30);
  }

  return [startDate, endDate];
};

export const financialYear = (value) => {
  let startDate = new Date(value - 1, 6, 1);
  let endDate = new Date(value, 5, 30);

  return [startDate, endDate];
};

export const financialYearFromMonth = (month, year) =>
  year + (month > 5 ? 1 : 0);

export const lastQuarter = (value) => {
  let startDate = subQuarters(startOfQuarter(new Date()), value);
  let endDate = lastDayOfQuarter(startDate);

  return [startDate, endDate];
};

export const financialYearsSince = (value) => {
  let createdDay = new Date(value);
  let today = new Date();
  let thisYear = getYear(today);
  let beginningOfFinancialYear = new Date(thisYear, 6, 1);
  let untilDay = isBefore(today, beginningOfFinancialYear)
    ? new Date(thisYear, 11, 31)
    : new Date(thisYear + 1, 11, 31);

  let years = isBefore(createdDay, untilDay)
    ? eachYearOfInterval({ start: createdDay, end: untilDay })
    : [];

  return years.map((item) => getYear(item));
};
