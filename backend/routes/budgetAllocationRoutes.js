const express = require("express");
const router = express.Router();

const {
  createAllocation,
  getAllAllocations,
  getSingleAllocation,
  updateAllocation,
  deleteAllocation,
  getSummaryBySector,
} = require("../controllers/budgetAllocationController");

router.get("/summary/by-sector", getSummaryBySector);

router.route("/").post(createAllocation).get(getAllAllocations);

router
  .route("/:id")
  .get(getSingleAllocation)
  .put(updateAllocation)
  .delete(deleteAllocation);

module.exports = router;
