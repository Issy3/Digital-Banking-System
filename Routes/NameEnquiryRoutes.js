const express = require('express');
const router = express.Router();
const nameEnquiryController = require('../Controllers/NameEnquiryController');

router.get('/nameenquiry/:accountNumber', nameEnquiryController.resolveAccountName);

module.exports = router;