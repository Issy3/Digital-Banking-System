const express = require('express');
const router = express.Router();

const transactionController = require('../Controllers/TransactionController');
const transactionHistoryController = require('../Controllers/TransactionHistoryController')
const authenticateCustomer = require('../Middleware/authMiddleware').authenticateCustomer;


router.get('/transactionstatus/:transactionId', transactionController.checkTransactionStatus);
router.get('/transactionhistory/:accountNumber', authenticateCustomer, transactionHistoryController.getTransactionHistory);

module.exports = router;