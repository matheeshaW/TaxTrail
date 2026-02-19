const mongoose = require("mongoose");

const budgetAllocationSchema = new mongoose.Schema(
  {
    sector: {
      type: String,
      enum: ["Health", "Education", "Welfare", "Infrastructure"],
      required: [true, "Sector is required"],
    },
    allocatedAmount: {
      type: Number,
      required: [true, "Allocated amount is required"],
      min: [0, "Amount can not be negative"],
    },
    targetIncomeGroup: {
      type: String,
      enum: ["Low", "Middle", "High"],
      required: [true, "Target income group is required"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: [true, "Region is required"],
    },
  },
  { timestamps: true },
);

budgetAllocationSchema.index({ region: 1, year: 1 });
budgetAllocationSchema.index({ sector: 1 });

module.exports = mongoose.model("BudgetAllocation", budgetAllocationSchema);
