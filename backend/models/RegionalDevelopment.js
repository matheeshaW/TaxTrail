const mongoose = require('mongoose');

const regionalDevelopmentSchema = new mongoose.Schema({
    regionName:{
        type: String,
        required: [true, 'Please add a region name'],
        enum:['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'],
        trim: true
    },
    year:{
        type: Number,
        required: [true, 'Please add a year'], 
        min: [2000, 'Year must be at least 2000'],
        max: [2030, 'Year must be at most 2030']
    },
    metrics: {
    averageIncome: { 
      type: Number, 
      required: [true, 'Average income is required'] 
    },
    unemploymentRate: { 
      type: Number, 
      required: [true, 'Unemployment rate is required'] 
    },
    povertyRate: { 
      type: Number, 
      required: [true, 'Poverty rate is required'] 
    },
    accessToServicesIndex: { 
      type: Number, 
      default: 50, 
      min: 0, 
      max: 100 
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
},{
    timestamps: true
});

regionalDevelopmentSchema.index({ regionName: 1, year: 1 }, { unique: true });

module.exports=mongoose.model('RegionalDevelopment', regionalDevelopmentSchema);