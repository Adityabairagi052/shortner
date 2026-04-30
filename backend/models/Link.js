const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Link'
  },
  description: {
    type: String
  },
  favicon: {
    type: String
  },
  password: {
    type: String,
    default: null
  },
  expiryDate: {
    type: Date,
    default: null
  },
  clickLimit: {
    type: Number,
    default: null
  },
  totalClicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Link', linkSchema);
