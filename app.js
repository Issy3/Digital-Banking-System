const express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config();

const connectDB = require('./Config/dbConfig');
connectDB(); // Connect to the database

const router = require('./Routes/CustomerRoutes');
const fintechRouter = require('./Routes/FintechRoutes');
const kycRouter = require('./Routes/KycRoutes');
const accountRouter = require('./Routes/AccountRoutes');
const nameEnquiryRouter = require('./Routes/NameEnquiryRoutes');
const transferRouter = require('./Routes/TransferRoutes');
const balanceRouter = require('./Routes/BalanceCheckRoutes');
const transactionStatusRouter = require('./Routes/TransactionRoutes');


app.use('/api', router);
app.use('/api', fintechRouter);
app.use('/api', kycRouter);
app.use('/api', accountRouter);
app.use('/api', nameEnquiryRouter);
app.use('/api', transferRouter);
app.use('/api', balanceRouter);
app.use('/api', transactionStatusRouter);


const PORT = process.env.PORT || 777;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});