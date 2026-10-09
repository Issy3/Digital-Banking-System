const express = require('express');
const router = express.Router();
const transferController = require('../Controllers/TransferController');

router.post('/transfer', transferController.initiateTransfer);

module.exports = router;