const axios = require('axios');
let token;
let bankName;

//call external API to onboard fintech.
exports.onboardFintech = async (req, res) => {
    try {
        if (!req.body.name || !req.body.email) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const response = await axios.post(`${process.env.EXTERNAL_API_URL}/api/fintech/onboard`, req.body);
        res.status(201).json({ message: 'Fintech onboarded successfully.', data: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Error onboarding fintech.', error: error.response.data });
    }};

    //Login to external API to get token for fintech.
exports.loginFintech = async (req, res) => {
    try {
        const credentials = {
            apiKey: process.env.API_KEY,
            apiSecret: process.env.API_SECRET
        };
        const response = await axios.post(`${process.env.EXTERNAL_API_URL}/api/auth/token`, credentials);
        token = response.data.token;
        bankName = response.data.fintech.bankName; // Store the bank name in a variable
        console.log('Bank name:', bankName);
        res.status(200).json({ message: 'Fintech logged in successfully.', data: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in fintech.', error: error.response.data });
    }
};

//hold bankName variable to give back to the user when creating account.

exports.getBankName = () => {
    return bankName;
};

exports.getToken = () => {
    return token;
};