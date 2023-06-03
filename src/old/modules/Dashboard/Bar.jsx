import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

import { DashboardContext } from '../../containers/Dashboard/DashboardProvider';

export const BarChart = ({ categories, series }) => {
  const [barSeries, setBarSeries] = useState([]);
  useEffect(() => {
    if (series) {
      setBarSeries(series);
    }
  }, [series]);
  const { handleClick, isClickable } = React.useContext(DashboardContext);
  const options = {
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      title: {
        text: 'Days',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 600,
          cssClass: 'apexcharts-xaxis-title',
        },
      },
      categories,
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return value.toFixed(0);
        },
      },
    },
    chart: {
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (isClickable) {
            let selectedDay = '1';
            if (categories[config.dataPointIndex] === '2 - 3') {
              selectedDay = '3';
            }
            if (categories[config.dataPointIndex] === '4 - 7') {
              selectedDay = '7';
            }
            if (categories[config.dataPointIndex] === '8 - 14') {
              selectedDay = '14';
            }
            if (categories[config.dataPointIndex] === '15 - 30') {
              selectedDay = '30';
            }
            if (categories[config.dataPointIndex] === '31 - 60') {
              selectedDay = '60';
            }
            if (categories[config.dataPointIndex] === '> 60') {
              selectedDay = '61';
            }
            const url = `arrears?`;
            const param = `&day=${selectedDay}`;
            handleClick(url, param);
          }
        },
      },
    },
  };

  return <Chart options={options} series={barSeries} type="bar" height={300} />;
};

BarChart.propTypes = {
  categories: PropTypes.array,
  series: PropTypes.array,
};
