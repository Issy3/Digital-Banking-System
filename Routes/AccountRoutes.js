const express = require('express');
const router = express.Router();
const createAccountController = require('../Controllers/AccountController');

router.post('/createaccount', createAccountController.createAccount);

module.exports = router;