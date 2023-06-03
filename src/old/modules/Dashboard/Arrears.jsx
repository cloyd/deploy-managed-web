import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

import { AreaChart, BarChart } from '.';
import { ARREARS } from '../../redux/dashboard/constants';

const { DAYS_LABELS, DEFAULT_OPTION, SELECT_OPTIONS, SELECT_STYLE } = ARREARS;

export const ArrearsChart = ({ data }) => {
  const [chartType, setChartType] = useState(DEFAULT_OPTION);
  const [percent, setPercent] = useState();
  const [percentSeries, setPercentSeries] = useState();
  const [days, setDays] = useState();
  const [daysSeries, setDaysSeries] = useState();

  useEffect(() => {
    if (data) {
      setPercent(data?.percent);
      setDays(data?.days);
    }
  }, [data]);

  useEffect(() => {
    if (percent) {
      setPercentSeries([
        {
          data: percent.data,
          name: 'Percent',
        },
      ]);
    }
  }, [percent]);

  useEffect(() => {
    if (days) {
      setDaysSeries([
        {
          data: days.data,
          name: 'Properties',
        },
      ]);
    }
  }, [days]);

  const onSelectChartType = useCallback(
    (chart) => {
      setChartType(chart);
      if (chart.value === 'days') {
        setDays(days);
      }
    },
    [days]
  );

  return (
    <Card>
      <CardHeader className="d-flex bg-white justify-content-between border-400 p-1">
        <CardTitle className="mb-0 pt-2 pl-3" tag="h5">
          Arrears
        </CardTitle>
        <Select
          onChange={onSelectChartType}
          options={SELECT_OPTIONS}
          value={chartType}
          styles={SELECT_STYLE}
        />
      </CardHeader>
      <CardBody>
        {chartType.value === 'percent' ? (
          <AreaChart categories={percent?.days} series={percentSeries} />
        ) : (
          <BarChart categories={DAYS_LABELS} series={daysSeries} />
        )}
      </CardBody>
    </Card>
  );
};

ArrearsChart.propTypes = {
  data: PropTypes.object.isRequired,
};
