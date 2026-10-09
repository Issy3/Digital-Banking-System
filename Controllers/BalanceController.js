const axios = require('axios');

//write account balance check function
exports.checkBalance = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.EXTERNAL_API_URL}/api/account/balance/${req.params.accountNumber}`, {
    headers: {
            'Authorization': req.headers.authorization
    }
        });
        return res.status(200).json({ message: 'Balance retrieved successfully.', data: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.', error: error.response.data });
    }
}
