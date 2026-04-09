const express = require("express");
const router = express.Router();
const validate = require("../middleware/validateMiddleware");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createAllocation,
  getAllAllocations,
  getSingleAllocation,
  updateAllocation,
  deleteAllocation,
  getSummaryBySector,
  getAvailableYears,
  getAdjustedAllocations,
} = require("../controllers/budgetAllocationController");

const {
  createBudgetValidator,
  updateBudgetValidator,
} = require("../validators/budgetAllocationValidator");

router.get(
  "/summary/by-sector",
  protect,
  authorize("Admin", "Public"),
  getSummaryBySector,
);

// GET available years with data
router.get(
  "/summary/available-years",
  protect,
  authorize("Admin", "Public"),
  getAvailableYears,
);

router
  .route("/")
  .post(
    protect,
    authorize("Admin"),
    createBudgetValidator,
    validate,
    createAllocation,
  )
  .get(protect, authorize("Admin", "Public"), getAllAllocations);

router
  .route("/adjusted/:year")
  .get(protect, authorize("Admin", "Public"), getAdjustedAllocations);

router
  .route("/:id")
  .get(protect, authorize("Admin", "Public"), getSingleAllocation)
  .patch(
    protect,
    authorize("Admin"),
    updateBudgetValidator,
    validate,
    updateAllocation,
  )
  .delete(protect, authorize("Admin"), deleteAllocation);

module.exports = router;
