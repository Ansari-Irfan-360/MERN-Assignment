import axios from 'axios';
import Transaction from '../models/Transaction.js';

const setInitData = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    const transactionsData = data.map((item) => ({
      ID: item.id,                      
      title: item.title,                
      description: item.description,    
      price: item.price,                
      category: item.category,          
      sold: item.sold,                  
      image: item.image,                
      dateOfSale: new Date(item.dateOfSale),  
    }));

    await Transaction.insertMany(transactionsData);
    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactionsData = async (req, res) => {
  const { search, page = 1, perPage = 10, month } = req.query;

  let query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  try {
    const data = await Transaction.find(query);

    const filteredTransactions = data.filter((item) => {
      const saleDate = new Date(item.dateOfSale);
      return saleDate.getMonth() === month - 1; 
    });

    const totalTransactions = filteredTransactions.length;

    const startIndex = (page - 1) * perPage;

    const transactions = filteredTransactions.slice(
      startIndex,
      startIndex + Number(perPage)
    );

    console.log("Paginated Transactions:", transactions);

    res.status(200).json({ totalTransactions, transactions });
  } catch (error) {
    console.error("Error :", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getStatisticsData = async (req, res) => {
  const { month } = req.query;

  try {

    const soldItemsData = await Transaction.find({
      sold: true,
    });

    const soldItems = soldItemsData.filter(item => {
      const saleDate = new Date(item.dateOfSale);
      return saleDate.getMonth() === month - 1;  
    }).length;

    const notSoldItemsData = await Transaction.find({
      sold: false,
    });

    const notSoldItems = notSoldItemsData.filter(item => {
      const saleDate = new Date(item.dateOfSale);
      return saleDate.getMonth() === month - 1;  
    }).length;

    const totalSalesData = await Transaction.find({
      sold: true,
    });

    let totalSales = 0;
    totalSalesData
      .forEach(item => {
        const saleDate = new Date(item.dateOfSale);
        if(saleDate.getMonth() === month - 1){
          totalSales+=item.price;
        }; 
      })

    res.status(200).json({
      totalSales,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    console.error("Error :", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getBarChartData = async (req, res) => {
  const { month } = req.query;

  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];

  try {

    const allTransactions = await Transaction.find();

    const filteredTransactions = allTransactions.filter(transaction => {
      const saleDate = new Date(transaction.dateOfSale);
      return saleDate.getMonth() === month - 1;  
    });

    const chartData = await Promise.all(
      priceRanges.map(async (range) => {
        const filteredByPrice = filteredTransactions.filter(transaction => {
          return transaction.price >= range.min && (range.max === Infinity || transaction.price < range.max);
        });
        return { range: `${range.min}-${range.max === Infinity ? '∞' : range.max}`, count: filteredByPrice.length };
      })
    );

    res.status(200).json(chartData);
  } catch (error) {
    console.error("Error :", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getPieChartData = async (req, res) => {
  const { month } = req.query;

  try {
    const allTransactions = await Transaction.find();

    const filteredTransactions = allTransactions.filter(transaction => {
      const saleDate = new Date(transaction.dateOfSale);
      return saleDate.getMonth() === month - 1;  
    });

    const categories = filteredTransactions.reduce((acc, transaction) => {
      const existingCategory = acc.find(item => item._id === transaction.category);
      if (existingCategory) {
        existingCategory.count += 1;
      } else {
        acc.push({ _id: transaction.category, count: 1 });
      }
      return acc;
    }, []);

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error :", error.message);
    res.status(500).json({ message: error.message });
  }
};

const allCombinedApi = async (req, res) => {
  try {
    const statistics = await getStatisticsData(req, res);
    const barChart = await getBarChartData(req, res);
    const pieChart = await getPieChartData(req, res);

    res.status(200).json({
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  setInitData,
  getTransactionsData,
  getStatisticsData,
  getBarChartData,
  getPieChartData,
  allCombinedApi,
};