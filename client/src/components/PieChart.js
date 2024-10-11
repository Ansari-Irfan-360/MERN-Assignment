import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const PieChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: 'Items per Category',
        data: data.map((item) => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div style={{ width: '30%', height: '30%'}}>
      <h2>Category Pie Chart</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
