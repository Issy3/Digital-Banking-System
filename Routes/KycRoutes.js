const express = require('express');
const router = express.Router();
const validateKycController = require('../Controllers/KycController');

// Validate KYC
router.post('/validatekyc', validateKycController.validateKyc);
// Onboard KYC
router.post('/onboardkyc', validateKycController.onboardKyc);

module.exports = router;