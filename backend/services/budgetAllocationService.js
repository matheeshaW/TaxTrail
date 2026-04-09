const BudgetAllocation = require("../models/budgetAllocationModel");
const axios = require("axios");
const mongoose = require("mongoose");
const Region = require("../models/regionModel");

// Create new budget allocation
const createAllocation = async (data) => {
  if (data.region) {
    if (!mongoose.Types.ObjectId.isValid(data.region)) {
      const error = new Error("Invalid region ID format");
      error.statusCode = 400;
      throw error;
    }

    const region = await Region.findById(data.region);
    if (!region) {
      const error = new Error("Region not found");
      error.statusCode = 404;
      throw error;
    }
  }
  return await BudgetAllocation.create(data);
};

// Get all allocations with filtering and pagination
const getAllAllocations = async (queryParams) => {
  const {
    sector,
    year,
    region,
    targetIncomeGroup,
    page = 1,
    limit = 10,
  } = queryParams;

  const filter = {};

  if (sector) filter.sector = sector;
  if (year) filter.year = Number(year);
  if (region) filter.region = region;
  if (targetIncomeGroup) filter.targetIncomeGroup = targetIncomeGroup;

  const total = await BudgetAllocation.countDocuments(filter);

  const allocations = await BudgetAllocation.find(filter)
    .populate("region")
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: allocations,
  };
};

// Get single allocation by ID
const getAllocationById = async (id) => {
  // add this validation block
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid allocation ID format");
    error.statusCode = 400;
    throw error;
  }

  const allocation = await BudgetAllocation.findById(id).populate("region");

  if (!allocation) {
    const error = new Error("Allocation not found");
    error.statusCode = 404;
    throw error;
  }

  return allocation;
};

// Update allocation by ID
const updateAllocation = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid allocation ID format");
    error.statusCode = 400;
    throw error;
  }

  const allocation = await BudgetAllocation.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!allocation) {
    const error = new Error("Allocation not found");
    error.statusCode = 404;
    throw error;
  }

  return allocation;
};

// Delete allocation by ID
const deleteAllocation = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid allocation ID format");
    error.statusCode = 400;
    throw error;
  }

  const allocation = await BudgetAllocation.findByIdAndDelete(id);

  if (!allocation) {
    const error = new Error("Allocation not found");
    error.statusCode = 404;
    throw error;
  }

  return allocation;
};

// Get allocation summary grouped by sector
const getSummaryBySector = async (year) => {
  const pipeline = [];

  // Add year filter if provided
  if (year) {
    pipeline.push({ $match: { year: Number(year) } });
  }

  // Group by sector with count
  pipeline.push({
    $group: {
      _id: "$sector",
      totalAllocated: { $sum: "$allocatedAmount" },
      count: { $sum: 1 },
    },
  });

  return await BudgetAllocation.aggregate(pipeline);
};

// Get available years with data
const getAvailableYears = async () => {
  const years = await BudgetAllocation.aggregate([
    {
      $group: {
        _id: "$year",
      },
    },
    { $sort: { _id: -1 } },
  ]);
  return years.map((y) => y._id);
};

// Get inflation-adjusted allocations for a given year
const getAdjustedAllocations = async (year) => {
  const yearNum = Number(year);
  const allocations = await BudgetAllocation.find({ year: yearNum });

  if (allocations.length === 0) {
    const error = new Error("No allocations found for this year");
    error.statusCode = 404;
    throw error;
  }

  let inflationRate = 0;

  try {
    const response = await axios.get(
      "https://api.worldbank.org/v2/country/LKA/indicator/FP.CPI.TOTL.ZG?format=json",
      {
        timeout: 5000,
      },
    );

    // Validate response shape: expect an array with inflation data at index 1
    if (
      !response ||
      !Array.isArray(response.data) ||
      response.data.length < 2 ||
      !Array.isArray(response.data[1])
    ) {
      const error = new Error(
        "Unexpected response format from World Bank API when retrieving inflation data",
      );
      error.statusCode = 502;
      throw error;
    }

    const inflationData = response.data[1];

    const yearData = inflationData.find(
      (item) => item.date === String(yearNum) && item.value !== null,
    );

    // Preserve existing behavior: default inflationRate to 0 if no yearData
    inflationRate = yearData ? yearData.value : 0;
  } catch (err) {
    // Translate axios/network/shape errors into controlled errors
    if (err && err.statusCode) {
      // Already translated (e.g., shape error above)
      throw err;
    }

    const errorMessageTimeout =
      "World Bank API request timed out while retrieving inflation data";
    const errorMessageGeneric =
      "Failed to fetch inflation data from World Bank API";

    const error = new Error(
      err && err.code === "ECONNABORTED"
        ? errorMessageTimeout
        : errorMessageGeneric,
    );

    error.statusCode = err && err.code === "ECONNABORTED" ? 503 : 502;
    throw error;
  }
  const adjustedAllocations = allocations.map((allocation) => {
    const adjustedAmount =
      allocation.allocatedAmount * (1 + inflationRate / 100);

    return {
      ...allocation.toObject(),
      inflationRate,
      adjustedAmount: Number(adjustedAmount.toFixed(2)),
    };
  });

  return {
    year,
    inflationRate,
    data: adjustedAllocations,
  };
};

module.exports = {
  createAllocation,
  getAllAllocations,
  getAllocationById,
  updateAllocation,
  deleteAllocation,
  getSummaryBySector,
  getAdjustedAllocations,
  getAvailableYears,
};
