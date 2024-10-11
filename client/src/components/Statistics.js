import React from 'react';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Statistics = ({ statistics, month }) => {
  const monthIndex = parseInt(month) - 1; 
  const monthName = monthNames[monthIndex]; 

  return (
    <div className="statistics">
      <h2>Statistics - {monthName}</h2> 
      <div>Total Sales: ${statistics.totalSales.toFixed(2)}</div>
      <div>Sold Items: {statistics.soldItems}</div>
      <div>Not Sold Items: {statistics.notSoldItems}</div>
    </div>
  );
};

export default Statistics;
