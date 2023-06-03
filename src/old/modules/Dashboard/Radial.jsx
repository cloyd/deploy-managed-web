import PropTypes from 'prop-types';
import React from 'react';
import Chart from 'react-apexcharts';

import { DashboardContext } from '../../containers/Dashboard/DashboardProvider';

export const RadialChart = ({ labels, series, total, colors }) => {
  const { handleClick, isClickable } = React.useContext(DashboardContext);
  /*
    The Radial chart only takes values as percentage.
    This code from https://codepen.io/PlippiePlop/pen/abyZgPp?editors=0010
    converts the data to count.
   */

  const options = {
    chart: {
      type: 'radialBar',
      /*
        https://github.com/apexcharts/react-apexcharts/issues/146
        Issue: Using state values in react in a label formatter fails to update labels
        Workaround: Setting a different id for the chart every render
      */
      id: `radial-${Math.random()}`,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (isClickable) {
            const url = `property/${labels[
              config.dataPointIndex
            ].toLowerCase()}?`;
            handleClick(url);
          }
        },
      },
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          total: {
            show: true,
            label: 'Total',
            formatter: () => {
              return total;
            },
          },
          value: {
            show: true,
            formatter: (val) => {
              return val;
            },
          },
        },
      },
    },
    labels,
    colors,
    legend: {
      show: true,
      position: 'top',
    },
  };

  return (
    <Chart options={options} series={series} type="radialBar" height={300} />
  );
};

RadialChart.propTypes = {
  labels: PropTypes.array,
  series: PropTypes.array,
  total: PropTypes.number,
  colors: PropTypes.array,
};
