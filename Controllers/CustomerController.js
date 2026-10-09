// Customer Controller
const Customer = require('../Models/Customer');
const onboardKycController = require('./KycController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new customer and validate first.
exports.createCustomer = async (req, res) => {
if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.phone || !req.body.dateOfBirth || !req.body.kycType || !req.body.kycId) {
    return res.status(400).json({ message: 'All fields are required.' });
}
if (!['bvn', 'nin'].includes(req.body.kycType)) {
    return res.status(400).json({ message: 'Invalid KYC type. Must be either "bvn" or "nin".' });
}

try {
    // Check for if customer with the same email, phone, or kycId already exists
if (await Customer.findOne({ email: req.body.email })) {
    return res.status(409).json({ message: 'Customer with this email already exists.' });
}
if (await Customer.findOne({ phone: req.body.phone })) {
    return res.status(409).json({ message: 'Customer with this phone number already exists.' });
}
if (await Customer.findOne({ kycId: req.body.kycId })) {
    return res.status(409).json({ message: 'Customer with this KYC ID already exists.' });
}
await onboardKycController.onboardKyc(req.body.kycType, req.body.kycId, req.body.dateOfBirth);

const hashedPassword = await bcrypt.hash(req.body.password, 10);

const customer = new Customer({
    ...req.body,
    password: hashedPassword,
    isVerified: true
});    await customer.save();
const customerResponse = customer.toObject();
delete customerResponse.password;

res.status(201).json({
    message: 'Customer created successfully.',
    customer: customerResponse
});} catch (error) {
    res.status(500).json({ message: 'Error creating customer.', error: error.message });
}};


// Customer login
exports.loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.'
            });
        }

        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            customer.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const token = jwt.sign(
            {
                customerId: customer._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        return res.status(200).json({
            message: 'Customer logged in successfully.',
            token
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error.',
            error: error.message
        });
    }
};