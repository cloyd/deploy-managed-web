import PropTypes from 'prop-types';
import React from 'react';
import Chart from 'react-apexcharts';

import { DashboardContext } from '../../containers/Dashboard/DashboardProvider';

export const AreaChart = ({ categories, series = [] }) => {
  const { handleClick, isClickable } = React.useContext(DashboardContext);
  const options = {
    stroke: {
      curve: 'smooth',
    },
    markers: {
      size: 5,
    },
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      min: () => 0,
      max: () => 100,
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      intersect: true,
      shared: false,
    },
    chart: {
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (isClickable) {
            let url = `arrears?`;
            let param = `&day_type=day_of_week&day=${categories[
              config.dataPointIndex
            ].toLowerCase()}`;

            if (config.dataPointIndex === categories.length - 1) {
              url = 'arrears?';
              param = '&day_type=day_of_week&day=latest';
            }
            handleClick(url, param);
          }
        },
      },
    },
  };

  return (
    <Chart
      className="clickable-area"
      // eslint-disable-next-line react/jsx-no-bind
      options={options}
      series={series}
      type="area"
      height="300"
    />
  );
};

AreaChart.propTypes = {
  categories: PropTypes.array,
  series: PropTypes.array,
};
