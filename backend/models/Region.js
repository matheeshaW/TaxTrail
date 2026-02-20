const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  regionName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

regionSchema.index({ regionName: 1 });

module.exports = mongoose.model("Region", regionSchema);