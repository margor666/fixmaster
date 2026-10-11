// models/Lead.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    serviceType: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new','in_progress','done'],
      default: 'new',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }    
});

module.exports = mongoose.model('Lead', leadSchema);
