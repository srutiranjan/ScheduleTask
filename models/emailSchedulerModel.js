const mongoose = require('mongoose');

const ScheduledEmailSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  messageId: {
    type: String,
    default: '',
  },
  error: {
    type: String,
  },
});

module.exports = mongoose.model('ScheduledEmail', ScheduledEmailSchema);
