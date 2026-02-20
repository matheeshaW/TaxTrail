const mongoose = require('mongoose');

const regionalDevelopmentSchema = new mongoose.Schema({
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
    required: [true, 'Please provide a Region ID']
  },
  year: {
    type: Number,
    required: [true, 'Please add a year'], 
    min: [2000, 'Year must be at least 2000'],
    max: [2030, 'Year must be at most 2030']
  },
  averageIncome: { 
    type: Number, 
    required: [true, 'Average income is required'],
    min: [0, 'Income cannot be negative']
  },
  unemploymentRate: { 
    type: Number, 
    required: [true, 'Unemployment rate is required'],
    min: [0, 'Cannot be less than 0'],
    max: [100, 'Cannot be more than 100']
  },
  povertyRate: { 
    type: Number, 
    required: [true, 'Poverty rate is required'],
    min: [0, 'Cannot be less than 0'],
    max: [100, 'Cannot be more than 100']
  },
  accessToServicesIndex: { 
    type: Number, 
    default: 50, 
    min: 0, 
    max: 100 
  }
}, {
  timestamps: true 
});

regionalDevelopmentSchema.index({ region: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('RegionalDevelopment', regionalDevelopmentSchema);