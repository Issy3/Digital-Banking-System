const Account = require('../Models/Account');
const axios = require('axios');
const Customer = require('../Models/Customer');
const getToken = require('./FintechController').getToken;
const getBankName = require('./FintechController').getBankName;

// receive kyc info, find customer in database, verify customer, send kyc info to external Api, receive account details and save details in account collection.
exports.createAccount = async (req, res) => {
    try {
        const { kycType, kycId, dob } = req.body;

if (!kycType || !kycId || !dob) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        //match customer with kyc info in database.
        const customer = await Customer.findOne({ kycType, kycId, dateOfBirth: dob });
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found with the provided KYC information.' });
        }
        //verify customer.
        if (!customer.isVerified) {
            return res.status(403).json({ message: 'Customer is not verified. Please complete KYC verification first.' });
        }

        
        //send kyc info to external Api.
        const token = await getToken();
        if (!token) {
            return res.status(401).json({ message: 'Fintech not logged in. Please log in first.' });
        }
        const accountDetails = {
            kycType: kycType,
            kycID: kycId,
            dob: dob
        }
        
         //create account in database with kyc info and account details from external Api.
         const response = await axios.post(`${process.env.EXTERNAL_API_URL}/api/account/create`, accountDetails, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const account = new Account({ 
        customer: customer._id, 
        accountNumber: response.data.account.accountNumber, 
        bankCode: response.data.account.bankCode, 
        bankName: getBankName(),
        balance: response.data.account.balance, 
    });
    await account.save();

         console.log(response.data);
        return res.status(201).json({ message: 'Account created successfully by NIBSS.', accountDetails: account });

    }
    catch (error) {

        console.error(error);

        // Surface meaningful errors from the external API (axios throws on 4xx/5xx)
        if (error.response) {
            const status = error.response.status;
            const externalMessage = error.response.data?.message || 'External API error.';

            // Conflict: BVN/NIN already linked to an account
            if (status === 400 || status === 409) {
                return res.status(409).json({ message: externalMessage });
            }

            // Auth failure against external API
            if (status === 401 || status === 403) {
                return res.status(401).json({ message: 'Fintech token rejected by external API. Please log in again.' });
            }

            return res.status(502).json({ message: `External API error: ${externalMessage}` });
        }

        res.status(500).json({ message: 'Internal server error.' });
    }
};
    

// }/