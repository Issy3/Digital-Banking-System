const axios = require('axios');
const getToken = require('./FintechController').getToken;

// Handle kyc onboarding and validation
exports.onboardKyc = async (kycType, kycId, dob) => {
    // Implementation for onboarding KYC
    try {
        const token = await getToken();
        if (!token) {
            throw new Error('Fintech not logged in. Please log in first.');
        }
        if (!['bvn', 'nin'].includes(kycType)) {
            throw new Error('Invalid KYC type. Must be either "bvn" or "nin".');
        }
        if (!dob || isNaN(Date.parse(dob))) {
            throw new Error('Invalid date of birth. Please provide a valid date.');
        }
        if (kycType === 'bvn') {
            const response = await axios.post(`${process.env.EXTERNAL_API_URL}/api/validateBvn`, {
                bvn: kycId,
                dob: dob
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.data.success) {
                throw new Error('Invalid BVN or date of birth.', { details: response.data });
            }
        }
        if (kycType === 'nin') {
            const response = await axios.post(`${process.env.EXTERNAL_API_URL}/api/validateNin`, {
                nin: kycId,
                dob: dob
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.message !== 'NIN Verified!!') {
                throw new Error('Invalid NIN or date of birth.', { details: response.data });
            }
        }
    } catch (error) {
        throw new Error(error.message);
    }
    return true; // Return true if KYC onboarding is successful
};

//get validation of bvn/nin details from external API.
exports.validateKyc = async (req, res) => {
    try {
        const { kycType, kycId, dob } = req.body;
        const token = await getToken();
        if (!token) {
            return res.status(401).json({ message: 'Fintech not logged in. Please log in first.' });
        }
        if (!kycType || !kycId || !dob) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (!['bvn', 'nin'].includes(kycType)) {
            return res.status(400).json({ message: 'Invalid KYC type. Must be either "bvn" or "nin".' });
        }

        if (kycType === 'bvn') {
            const response = await axios.post(`${process.env.EXTERNAL_API_URL}/api/validateBvn`, {
                bvn: kycId,
                dob: dob
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.data.success) {
                return res.status(400).json({ message: 'Invalid BVN or date of birth.', details: response.data });
            }
        }
        if (kycType === 'nin') {
            const response = await axios.post(`${process.env.EXTERNAL_API_URL}/api/validateNin`, {
                nin: kycId,
                dob: dob
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.message !== 'NIN Verified!!') {
                return res.status(400).json({ message: 'Invalid NIN or date of birth.', details: response.data });
            }
        }
        // If validation is successful, return a success response
        return res.status(200).json({ message: 'KYC validation successful.' });
    } catch (error) {
        console.error('Error validating KYC:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};