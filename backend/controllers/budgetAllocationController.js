const BudgetAllocation = require("../models/budgetAllocationModel");

// @desc  create new budget allocation
// @route  POST /api/v1/budget-allocations
// @access  Admin
exports.createAllocation = async (req, res, next) => {
  try {
    const allocation = await BudgetAllocation.create(req.body);

    res.status(201).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
