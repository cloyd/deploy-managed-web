import { financialYearFromMonth } from '.';

/* 
  Map reports array to:
    {
      year: [...],
    }
*/
export const aggregateByYear = (reports) =>
  reports.reduce((acc, report) => {
    // Remove the timezone so date isn't converted to local
    const date = new Date(
      report.periodStartsAt.slice(
        0,
        report.periodStartsAt.split('').findIndex((char) => char === '+')
      )
    );
    const year = date.getFullYear();

    const financialYearRecord = acc[year] || [];
    financialYearRecord.push(report);
    acc[year] = financialYearRecord;

    return acc;
  }, []);

/* 
  Map reports array to:
    {
      year: {
        month: [...],
      }
    }
*/
export const aggregateByYearMonth = (reports) =>
  reports.reduce((acc, report) => {
    // Remove the timezone so date isn't converted to local
    const date = new Date(
      report.periodStartsAt.slice(
        0,
        report.periodStartsAt.split('').findIndex((char) => char === '+')
      )
    );
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthText = `${date.toLocaleString('default', {
      month: 'long',
    })} ${year % 2000}`;

    const financialYear = financialYearFromMonth(month, year);

    let financialYearMap = acc[financialYear] || {};
    let financialYearMonthRecord = financialYearMap[monthText] || [];
    financialYearMonthRecord.push(report);

    acc[financialYear] = financialYearMap;
    acc[financialYear][monthText] = financialYearMonthRecord;

    return acc;
  }, {});
