import PropTypes from 'prop-types';
import React from 'react';
import Chart from 'react-apexcharts';

import { DashboardContext } from '../../containers/Dashboard/DashboardProvider';

export const DonutChart = ({
  labels,
  series,
  colors,
  isSemiDonut,
  isExpired = false,
  isUpcoming = false,
  isRentReviews = false,
}) => {
  const hasCount = series ? !!series.find((value) => value !== 0) : false;
  const { handleClick, isClickable } = React.useContext(DashboardContext);

  const options = {
    labels: hasCount ? labels : ['No Data'],
    colors: hasCount ? colors : ['#F4F4F4'],
    chart: {
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (isClickable) {
            const periods = [30, 60, 90, 91];
            const reviews = ['upcoming', 'overdue', 'no_date'];
            const filter =
              labels[config.dataPointIndex].toLowerCase() === 'current'
                ? 'active'
                : labels[config.dataPointIndex].toLowerCase();
            let url = `property/${filter}?`;
            let param = '';

            if (isExpired) {
              url = `property/expired?`;
              param = `&period=${periods[config.dataPointIndex]}`;
            }

            if (isUpcoming) {
              url = `property/active?`;
              param = `&period=${periods[config.dataPointIndex]}`;
            }
            if (isRentReviews) {
              url = `property/${reviews[config.dataPointIndex]}?`;
              param = `&rent_review=true`;
            }
            handleClick(url, param);
          }
        },
      },
    },
    ...(isSemiDonut
      ? {
          plotOptions: {
            pie: {
              startAngle: -90,
              endAngle: 90,
              offsetY: 30,
            },
          },
        }
      : {}),
    responsive: [
      {
        breakpoint: 768, // xs breakpoint
        options: {
          legend: {
            position: 'top',
          },
        },
      },
    ],
  };

  const donutSeries = hasCount ? series : [100];

  return (
    <Chart
      className={hasCount ? '' : 'pe-none'}
      options={options}
      series={donutSeries}
      type="donut"
      width={350}
    />
  );
};

DonutChart.propTypes = {
  labels: PropTypes.array,
  series: PropTypes.array,
  colors: PropTypes.array,
  isSemiDonut: PropTypes.bool,
  isExpired: PropTypes.bool,
  isUpcoming: PropTypes.bool,
  isRentReviews: PropTypes.bool,
};

DonutChart.defaultPropTypes = {
  isSemiDonut: false,
};
