const express = require("express");
const router = express.Router();

const protect = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')

const {
  createAllocation,
  getAllAllocations,
  getSingleAllocation,
  updateAllocation,
  deleteAllocation,
  getSummaryBySector,
} = require("../controllers/budgetAllocationController");

router.get("/summary/by-sector", protect, authorize('Public'), getSummaryBySector);

router.route("/").post(protect, authorize('Admin'), createAllocation).get(protect, authorize('Admin', 'Public'), getAllAllocations);

router
  .route("/:id")
  .get(protect, authorize('Admin', 'Public'), getSingleAllocation)
  .put(protect, authorize('Admin'), updateAllocation)
  .delete(protect, authorize('Admin'), deleteAllocation);

module.exports = router;
