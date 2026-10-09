const express = require('express');
const router = express.Router();
const customerController = require('../Controllers/CustomerController');

// Create a new customer
router.post('/createcustomer', customerController.createCustomer);
router.post('/customer/login', customerController.loginCustomer);

module.exports = router;