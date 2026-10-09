// Initiates an interbank fund transfer between two accounts.
// The transfer is debited from the sender's account and credited to the recipient's account.

const axios = require('axios');
const getToken = require('../Controllers/FintechController').getToken;
const Transaction = require('../Models/Transaction');
const Account = require('../Models/Account');

exports.initiateTransfer = async (req, res) => {
    try {
        const token = await getToken();

        if (!token) {
            return res.status(401).json({
                message: 'Fintech not logged in. Please log in first.'
            });
        }

        if (!req.body.from || !req.body.to || !req.body.amount) {
            return res.status(400).json({
                message: 'All fields are required.'
            });
        }

        if (req.body.amount <= 0) {
            return res.status(400).json({
                message: 'Amount must be greater than zero.'
            });
        }

        if (req.body.from === req.body.to) {
            return res.status(400).json({
                message: 'Invalid transfer.'
            });
        }

        // Find the sender's account in our database
        const account = await Account.findOne({
            accountNumber: req.body.from
        });

        if (!account) {
            return res.status(404).json({
                message: 'Sender account not found.'
            });
        }

        // Check that the recipient account exists
        const accountCheck = await axios.get(
            `${process.env.EXTERNAL_API_URL}/api/account/name-enquiry/${req.body.to}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        console.log(accountCheck.data);

        // Make transfer request to NIBSS
        const response = await axios.post(
            `${process.env.EXTERNAL_API_URL}/api/transfer`,
            req.body,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        // Save successful transaction locally
        const transaction = new Transaction({
            account: account._id,
            reference: response.data.reference,
            amount: req.body.amount,
            senderAccount: req.body.from,
            receiverAccount: req.body.to,
            status: 'completed'
        });

        await transaction.save();

        // Get sender's updated balance
        const senderBalance = await axios.get(
            `${process.env.EXTERNAL_API_URL}/api/account/balance/${req.body.from}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        console.log(response.data);

        return res.status(200).json({
            message: 'Transfer successful.',
            data: response.data,
            balance: senderBalance.data.balance,
            transaction: transaction
        });

    } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                message: 'Recipient account does not exist.'
            });
        }

        return res.status(500).json({
            message: 'Internal server error.',
            error: error.response ? error.response.data : error.message
        });
    }
};