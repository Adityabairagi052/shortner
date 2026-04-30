const mongoose = require('mongoose');

const clickEventSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true
  },
  ipAddress: {
    type: String
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  device: {
    type: String // mobile, desktop, tablet
  },
  browser: {
    type: String
  },
  referrer: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('ClickEvent', clickEventSchema);
