const Transaction = require('../Models/Transaction');
const Account = require('../Models/Account');

exports.getTransactionHistory = async (req, res) => {
    try {
        const account = await Account.findOne({
            accountNumber: req.params.accountNumber
        });

        if (!account) {
            return res.status(404).json({
                message: 'Account not found.'
            });
        }

        // Check that the logged-in customer owns this account
        if (account.customer.toString() !== req.customerId) {
            return res.status(403).json({
                message: 'You are not authorized to view this account history.'
            });
        }

        const transactions = await Transaction.find({
            $or: [
                { senderAccount: account.accountNumber },
                { receiverAccount: account.accountNumber }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Transaction history retrieved successfully.',
            data: transactions
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error.',
            error: error.message
        });
    }
};