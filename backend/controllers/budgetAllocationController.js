const budgetAllocationService = require("../services/budgetAllocationService");

// @desc   Create new budget allocation
// @route  POST /api/v1/budget-allocations
// @access Admin
exports.createAllocation = async (req, res, next) => {
  try {
    const allocation = await budgetAllocationService.createAllocation(req.body);

    res.status(201).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    if (
      (error && error.name === "ValidationError") ||
      (error && error.name === "CastError")
    ) {
      error.statusCode = error.statusCode || 400;
    }
    return next(error);
  }
};

// @desc   Get all allocations (with filtering)
// @route  GET /api/v1/budget-allocations
// @access Public
exports.getAllAllocations = async (req, res, next) => {
  try {
    const result = await budgetAllocationService.getAllAllocations(req.query);

    res.status(200).json({
      success: true,
      total: result.total,
      page: result.page,
      pages: result.pages,
      data: result.data,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc   Get single allocation
// @route  GET /api/v1/budget-allocations/:id
// @access Public
exports.getSingleAllocation = async (req, res, next) => {
  try {
    const allocation = await budgetAllocationService.getAllocationById(
      req.params.id,
    );

    res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc   Update allocation
// @route  PATCH /api/v1/budget-allocations/:id
// @access Admin
exports.updateAllocation = async (req, res, next) => {
  try {
    const allocation = await budgetAllocationService.updateAllocation(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc   Delete allocation
// @route  DELETE /api/v1/budget-allocations/:id
// @access Admin
exports.deleteAllocation = async (req, res, next) => {
  try {
    await budgetAllocationService.deleteAllocation(req.params.id);

    res.status(200).json({
      success: true,
      message: "Allocation deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// @desc   Get allocation summary by sector
// @route  GET /api/v1/budget-allocations/summary/by-sector
// @access Public
exports.getSummaryBySector = async (req, res, next) => {
  try {
    const summary = await budgetAllocationService.getSummaryBySector();

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc   Get inflation-adjusted allocations by year
// @route  GET /api/v1/budget-allocations/adjusted/:year
// @access Public
exports.getAdjustedAllocations = async (req, res, next) => {
  try {
    const result = await budgetAllocationService.getAdjustedAllocations(
      req.params.year,
    );

    res.status(200).json({
      success: true,
      year: result.year,
      inflationRate: result.inflationRate,
      data: result.data,
    });
  } catch (error) {
    return next(error);
  }
};
