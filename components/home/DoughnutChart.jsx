// components/DoughnutChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const DoughnutChart = ({ tests }) => {
  const testTypes = tests.reduce((acc, test) => {
    Object.keys(test).forEach(key => {
      if (Array.isArray(test[key])) {
        acc[key] = (acc[key] || 0) + 1;
      }
    });
    return acc;
  }, {});

  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FFCD56'
  ];

  const data = {
    labels: Object.keys(testTypes),
    datasets: [
      {
        label: '# of Tests',
        data: Object.values(testTypes),
        backgroundColor: colors.slice(0, Object.keys(testTypes).length),
      },
    ],
  };

  const options = {
    type: 'doughnut',
    cutout: '60%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
