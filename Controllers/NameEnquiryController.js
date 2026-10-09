//create a controller to Resolves an account number to the account holder's registered name
const axios = require('axios');
const getToken = require('../Controllers/FintechController').getToken;

//resolve account number to account holder's name
exports.resolveAccountName = async (req, res) => {
    try {
        if (!req.params.accountNumber) {
            return res.status(400).json({ message: 'Account number is required.' });
        }

        const token = await getToken();
        if (!token) {
            return res.status(401).json({ message: 'Fintech not logged in. Please log in first.' });
        }

        const response = await axios.get(`${process.env.EXTERNAL_API_URL}/api/account/name-enquiry/${req.params.accountNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            });
        

        return res.status(200).json({ message: 'Account name resolved successfully.', data: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.', error: error.response.data });
    }
}
