import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const BarChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.range),
    datasets: [
      {
        label: 'Items per Price Range',
        data: data.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div style={{ width: '60%', height: '60%' }}>
      <h2>Price Range Bar Chart</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
