import express from "express";
import {
  setInitData,
  getTransactionsData,
  getStatisticsData,
  getBarChartData,
  getPieChartData,
  allCombinedApi,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/initData", setInitData);
router.get("/transactions", getTransactionsData);
router.get("/statistics", getStatisticsData);
router.get("/barchart", getBarChartData);
router.get("/piechart", getPieChartData);
router.get("/combined", allCombinedApi);

export default router;
