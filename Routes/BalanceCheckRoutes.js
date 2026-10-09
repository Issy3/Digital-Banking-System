const express = require('express');
const router = express.Router();
const balanceCheckController = require('../Controllers/BalanceController');

router.get('/balance/:accountNumber', balanceCheckController.checkBalance);

module.exports = router;