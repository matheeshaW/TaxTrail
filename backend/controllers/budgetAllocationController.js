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

// @desc  get all allocation (with filtering)
// @route  GET /api/v1/budget-allocations
// @access  public
exports.getAllAllocations = async (req, res, next) => {
  try {
    const { sector, year, region } = req.query;

    const filter = {};

    if (sector) filter.sector = sector;
    if (year) filter.year = year;
    if (region) filter.region = region;

    const allocations = await BudgetAllocation.find(filter).populate("region");

    res.status(201).json({
      success: true,
      count: allocations.length,
      data: allocations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  get single allocation
// @route  GET /api/v1/budget-allocations/:id
// @access  public
exports.getSingleAllocation = async (req, res, next) => {
  try {
    const allocation = await BudgetAllocation.findById(req.params.id).populate(
      "region",
    );

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    res.status(201).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  update allocation
// @route  PUT /api/v1/budget-allocations/:id
// @access Admin
exports.updateAllocation = async (req, res, next) => {
  try {
    const allocation = await BudgetAllocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  delete allocation
// @route  /api/v1/budget-allocations/:id
// @access  Admin
exports.deleteAllocation = async (req, res, next) => {
  try {
    const allocation = await BudgetAllocation.findByIdAndDelete(req.params.id);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Allocation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get allocation summary by sector
// @route   GET /api/v1/budget-allocations/summary/by-sector
// @access  Public
exports.getSummaryBySector = async (req, res, next) => {
  try {
    const summary = await BudgetAllocation.aggregate([
      {
        $group: {
          _id: "$sector",
          totalAllocated: { $sum: "$allocatedAmount" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
