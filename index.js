const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const app = express();
const dotenv = require("dotenv").config();
const cron = require('./cronJob');
connectDb();
app.use(express.json());
//using middleware to add routes
app.use('/api/emailScheduler', require('./routes/emailSchedulerRoutes'));
app.use(errorHandler);
const port = process.env.PORT || 4000
app.listen(port, () => {
    cron.taskEmail();
    console.log(`Server running on port:${port} `);
})