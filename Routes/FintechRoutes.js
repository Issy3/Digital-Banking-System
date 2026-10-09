const express = require('express');
const router = express.Router();
const onboardFintechController = require('../Controllers/FintechController');
const loginFintechController = require('../Controllers/FintechController');

// Onboard a new fintech
router.post('/onboardfintech', onboardFintechController.onboardFintech);
router.post('/loginfintech', loginFintechController.loginFintech);

module.exports = router;