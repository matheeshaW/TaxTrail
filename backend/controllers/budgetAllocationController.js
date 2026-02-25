const BudgetAllocation = require("../models/budgetAllocationModel");
const axios = require("axios");

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

    res.status(200).json({
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

    res.status(200).json({
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

// @desc  Get Inflation-adjusted allocations by year
// @route GET /api/v1/budget-allocations/adjusted/:year
// @access Public
exports.getAdjustedAllocations = async (req, res, next) => {
  try {
    const { year } = req.params;

    const allocations = await BudgetAllocation.find({ year });

    if (allocations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No allocations found for this year",
      });
    }

    const response = await axios.get(
      "https://api.worldbank.org/v2/country/LKA/indicator/FP.CPI.TOTL.ZG?format=json",
    );

    const inflationData = response.data[1];

    const yearData = inflationData.find(
      (item) => item.date === year && item.value !== null,
    );

    const inflationRate = yearData ? yearData.value : 0;

    // 3️⃣ Adjust allocations
    const adjustedAllocations = allocations.map((allocation) => {
      const adjustedAmount =
        allocation.allocatedAmount * (1 + inflationRate / 100);

      return {
        ...allocation.toObject(),
        inflationRate,
        adjustedAmount: Number(adjustedAmount.toFixed(2)),
      };
    });

    res.status(200).json({
      success: true,
      year,
      inflationRate,
      data: adjustedAllocations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inflation data",
    });
  }
};
