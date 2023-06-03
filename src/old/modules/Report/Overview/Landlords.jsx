import PropTypes from 'prop-types';
import React from 'react';

import { CardStatistic } from '../../Card';

export const ReportOverviewLandlords = (props) => {
  const { report } = props;
  const {
    landlordConcentration1Property: count1,
    landlordConcentration2Properties: count2,
    landlordConcentration3Properties: count3,
    landlordConcentration4PropertiesPlus: count4Up,
  } = report;
  const total = count1 + count2 + count3 + count4Up;

  return (
    <CardStatistic title="Landlord Concentration" className="h-100">
      <p className="my-2">
        1 property{' '}
        <strong className="ml-1">{Math.round((count1 / total) * 100)}%</strong>
      </p>
      <p className="mb-2">
        2 properties{' '}
        <strong className="ml-1">{Math.round((count2 / total) * 100)}%</strong>
      </p>
      <p className="mb-2">
        3 properties{' '}
        <strong className="ml-1">{Math.round((count3 / total) * 100)}%</strong>
      </p>
      <p className="mb-0">
        4+ properties{' '}
        <strong className="ml-1">
          {Math.round((count4Up / total) * 100)}%
        </strong>
      </p>
    </CardStatistic>
  );
};

ReportOverviewLandlords.propTypes = {
  report: PropTypes.shape({
    landlordConcentration1Property: PropTypes.number,
    landlordConcentration2Properties: PropTypes.number,
    landlordConcentration3Properties: PropTypes.number,
    landlordConcentration4PropertiesPlus: PropTypes.number,
  }),
};

ReportOverviewLandlords.defaultProps = {
  report: {
    landlordConcentration1Property: 0,
    landlordConcentration2Properties: 0,
    landlordConcentration3Properties: 0,
    landlordConcentration4PropertiesPlus: 0,
  },
};
