import { getReport, getReportIsLoading } from '..';

describe('report/selectors', () => {
  const state = {
    report: {
      isLoading: true,
      aggregate: 'aggregate',
      rent: 'rent',
      task: 'task',
    },
  };

  it('should handle getReportIsLoading', () => {
    const received = getReportIsLoading(state);
    const expected = true;
    expect(received).toEqual(expected);
  });

  it('should handle getReport', () => {
    const received = getReport(state);
    const expected = state.report;
    expect(received).toEqual(expected);
  });
});
