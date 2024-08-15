// components/DoughnutChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const DoughnutChart = ({tests}) => {
  const testTypes = tests.reduce((acc, test) => {
    acc[test.testType] = (acc[test.testType] || 0) + 1;
    return acc;
  }, {});

  const testNames = {
    'blood-test': 'Blood Test',
    'urine-test': 'Urine Test',
    // Add more mappings as needed
  };

  const colors = {
    'blood-test': '#EF4444',
    'urine-test': '#F59E0B',
    'sugar-test': '#008080',
    // Add more colors as needed
  };

  const data = {
    labels: Object.keys(testTypes).map(type => testNames[type]),
    datasets: [
      {
        label: '# of Tests',
        data: Object.values(testTypes),
        backgroundColor: Object.keys(testTypes).map(type => colors[type]),
      },
    ],
  };

  const options = {
    type: 'doughnut',
    cutout:'60%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
