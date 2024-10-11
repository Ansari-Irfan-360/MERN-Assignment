import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import './App.css';

const App = () => {
  const [month, setMonth] = useState('03'); 
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [page, setPage] = useState(1); 
  const [totalTransactions, setTotalTransactions] = useState(0); 
  const [perPage] = useState(10);
  
  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/transactions`, {
        params: { month, search, page, perPage }
      });
      console.log("Fetched Transactions:", data); 
      setTransactions(data.transactions);
      setTotalTransactions(data.totalTransactions); 
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/statistics`, {
        params: { month }
      });
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics', error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/barchart`, {
        params: { month }
      });
      setBarChartData(data);
    } catch (error) {
      console.error('Error fetching bar chart data', error);
    }
  };

  const fetchPieChartData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/piechart`, {
        params: { month }
      });
      setPieChartData(data);
    } catch (error) {
      console.error('Error fetching pie chart data', error);
    }
  };


  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
    fetchPieChartData();
  }, [month, search, page]); 

  return (
    <div className="App">
      <h1>Transactions Dashboard</h1>

      <div className="table-section">
        <div className="controls">
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); 
            }}
          />
        </div>

        <TransactionsTable 
          transactions={transactions} 
          page={page}
          setPage={setPage}
          totalTransactions={totalTransactions}
          perPage={perPage}
        />
      </div>

      {statistics && (
        <div className="statistics-section" >
          <Statistics statistics={statistics} month={month}/>
        </div>
      )}

      <div className="charts-container">
        {barChartData.length > 0 && <BarChart data={barChartData} />}
        {pieChartData.length > 0 && <PieChart data={pieChartData} />}
      </div>
    </div>
  );
};

export default App;
