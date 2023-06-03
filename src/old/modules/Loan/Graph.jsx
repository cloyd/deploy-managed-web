import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
} from 'chart.js';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

import { formatDate, toDollarAmount } from '../../utils';

Chart.register(
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement
);

const OPTIONS = {
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

function getBarData(instalments = []) {
  return instalments.map((instalment) => ({
    x: formatDate(instalment.dueDate, 'shortDayMonth'),
    y: toDollarAmount(instalment.amountCents),
  }));
}

function getLineData(instalments = [], incomeCents) {
  if (!incomeCents) return;

  const incomeDollars = toDollarAmount(incomeCents);

  return instalments.map((instalment) => ({
    x: instalment.dueDate,
    y: incomeDollars,
  }));
}

export const LoanGraph = ({ incomeCents, instalments }) => {
  const data = useMemo(() => {
    const datasets = [
      {
        label: 'Loan Balance',
        backgroundColor: 'rgba(243, 191, 242, 0.75)',
        borderColor: 'rgb(255, 99, 132)',
        stack: 'combined',
        order: 0,
        data: getBarData(instalments),
      },
    ];

    if (incomeCents > 0) {
      datasets.push({
        label: 'Net Rental income',
        backgroundColor: 'rgb(2, 255, 255)',
        borderColor: 'rgb(2, 255, 255)',
        borderWidth: 2,
        order: 1,
        type: 'line',
        data: getLineData(instalments, incomeCents),
      });
    }

    return { datasets };
  }, [incomeCents, instalments]);

  return <Bar options={OPTIONS} data={data} />;
};

LoanGraph.propTypes = {
  incomeCents: PropTypes.number,
  instalments: PropTypes.array,
};

LoanGraph.defaultProps = {
  incomeCents: 0,
  instalments: [],
};
