const axios = require('axios');

//transaction status check
exports.checkTransactionStatus = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.EXTERNAL_API_URL}/api/transaction/${req.params.transactionId}`, {
    headers: {
            'Authorization': req.headers.authorization
    }
        });
        return res.status(200).json({ message: 'Transaction status retrieved successfully.', data: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.', error: error.response.data });
    }
}
