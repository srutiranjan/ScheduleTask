const asyncHandler = require('express-async-handler');
const ScheduledEmail = require('../email_sceduler/models/emailSchedulerModel');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const taskEmail = asyncHandler(async () => {
    const emails = await ScheduledEmail.find({ status: 'pending' });

    if (emails.length === 0) {
        return console.log('No pending Email for sending email!');
    }

    const transporter = nodemailer.createTransport({
        secure: true,
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        }
    });

    cron.schedule('* * * * * *', async () => {
        const emailStatus = [];

        for (const email of emails) {
            const mailOptions = {
                from: process.env.USER,
                to: email.recipient,
                subject: email.subject,
                text: email.body
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                emailStatus.push({
                    updateOne: {
                        filter: { _id: email._id },
                        update: { $set: { status: 'sent', sentAt: new Date().toLocaleString(), messageId: info.messageId } }
                    }
                });
                console.log('Email sent: ' + info.response);
            } catch (error) {
                emailStatus.push({
                    updateOne: {
                        filter: { _id: email._id },
                        update: { $set: { status: 'failed', sentAt: new Date().toLocaleString(), error: error.message } }
                    }
                });
                console.log("Error:", error.message);
            }
        }

        //console.log("Email status:", emailStatus);
        await ScheduledEmail.bulkWrite(emailStatus);
    });
});

module.exports = {
    taskEmail
};
