const express = require("express");
const router = express.Router();

const {
  createAllocation,
} = require("../controllers/budgetAllocationController");

// POST /api/v1/budget-allocations
router.post("/", createAllocation);

module.exports = router;
