jest.mock("../models/budgetAllocationModel");
jest.mock("../models/regionModel");
jest.mock("axios");

const mongoose = require("mongoose");
const axios = require("axios");

const BudgetAllocation = require("../models/budgetAllocationModel");
const Region = require("../models/regionModel");

const budgetService = require("../services/budgetAllocationService");

describe("BudgetAllocation Service - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // CREATE ALLOCATION

  it("should create allocation when region exists", async () => {
    const mockData = {
      sector: "Education",
      allocatedAmount: 500000,
      targetIncomeGroup: "Low",
      year: 2023,
      region: new mongoose.Types.ObjectId(),
    };

    const mockAllocation = {
      ...mockData,
      _id: new mongoose.Types.ObjectId(),
      populate: jest.fn().mockResolvedValue({
        ...mockData,
        _id: new mongoose.Types.ObjectId(),
        region: { _id: mockData.region, regionName: "Western Province" },
      }),
    };

    Region.findById.mockResolvedValue({ _id: mockData.region });
    BudgetAllocation.create.mockResolvedValue(mockAllocation);

    const result = await budgetService.createAllocation(mockData);

    expect(Region.findById).toHaveBeenCalledWith(mockData.region);
    expect(BudgetAllocation.create).toHaveBeenCalledWith(mockData);
    expect(result.allocatedAmount).toBe(500000);
    expect(result.sector).toBe("Education");
  });

  it("should throw error if region does not exist", async () => {
    const mockData = {
      sector: "Education",
      allocatedAmount: 500000,
      targetIncomeGroup: "Low",
      year: 2023,
      region: new mongoose.Types.ObjectId(),
    };

    Region.findById.mockResolvedValue(null);

    await expect(budgetService.createAllocation(mockData)).rejects.toThrow(
      "Region not found",
    );
  });

  it("should throw error for invalid region ID format", async () => {
    const mockData = {
      sector: "Health",
      allocatedAmount: 300000,
      targetIncomeGroup: "Middle",
      year: 2023,
      region: "invalid-id",
    };

    await expect(budgetService.createAllocation(mockData)).rejects.toThrow(
      "Invalid region ID format",
    );
  });

  // GET ALL ALLOCATIONS

  it("should return allocations without filters", async () => {
    const mockAllocations = [
      {
        _id: new mongoose.Types.ObjectId(),
        sector: "Education",
        allocatedAmount: 500000,
        targetIncomeGroup: "Low",
        year: 2023,
        region: {
          _id: new mongoose.Types.ObjectId(),
          regionName: "Western Province",
        },
      },
    ];

    BudgetAllocation.find.mockReturnValue({
      populate: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => Promise.resolve(mockAllocations),
          }),
        }),
      }),
    });

    BudgetAllocation.countDocuments.mockResolvedValue(1);

    const result = await budgetService.getAllAllocations({});

    expect(result.data.length).toBe(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.pages).toBe(1);
    expect(result.data[0].sector).toBe("Education");
  });

  it("should filter allocations by sector", async () => {
    const mockAllocations = [
      {
        _id: new mongoose.Types.ObjectId(),
        sector: "Health",
        allocatedAmount: 300000,
        year: 2023,
      },
    ];

    BudgetAllocation.find.mockReturnValue({
      populate: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => Promise.resolve(mockAllocations),
          }),
        }),
      }),
    });

    BudgetAllocation.countDocuments.mockResolvedValue(1);

    const result = await budgetService.getAllAllocations({ sector: "Health" });

    expect(BudgetAllocation.find).toHaveBeenCalledWith({ sector: "Health" });
    expect(result.data[0].sector).toBe("Health");
  });

  it("should filter allocations by year", async () => {
    const mockAllocations = [
      {
        _id: new mongoose.Types.ObjectId(),
        sector: "Education",
        year: 2024,
      },
    ];

    BudgetAllocation.find.mockReturnValue({
      populate: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => Promise.resolve(mockAllocations),
          }),
        }),
      }),
    });

    BudgetAllocation.countDocuments.mockResolvedValue(1);

    const result = await budgetService.getAllAllocations({ year: "2024" });

    expect(BudgetAllocation.find).toHaveBeenCalledWith({ year: 2024 });
    expect(result.data[0].year).toBe(2024);
  });

  it("should filter allocations by region", async () => {
    const regionId = new mongoose.Types.ObjectId();
    const mockAllocations = [
      {
        _id: new mongoose.Types.ObjectId(),
        region: regionId,
      },
    ];

    BudgetAllocation.find.mockReturnValue({
      populate: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => Promise.resolve(mockAllocations),
          }),
        }),
      }),
    });

    BudgetAllocation.countDocuments.mockResolvedValue(1);

    const result = await budgetService.getAllAllocations({ region: regionId });

    expect(BudgetAllocation.find).toHaveBeenCalledWith({ region: regionId });
    expect(result.data[0].region).toBe(regionId);
  });

  it("should filter allocations by targetIncomeGroup", async () => {
    const mockAllocations = [
      {
        _id: new mongoose.Types.ObjectId(),
        targetIncomeGroup: "High",
      },
    ];

    BudgetAllocation.find.mockReturnValue({
      populate: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => Promise.resolve(mockAllocations),
          }),
        }),
      }),
    });

    BudgetAllocation.countDocuments.mockResolvedValue(1);

    const result = await budgetService.getAllAllocations({
      targetIncomeGroup: "High",
    });

    expect(BudgetAllocation.find).toHaveBeenCalledWith({
      targetIncomeGroup: "High",
    });
    expect(result.data[0].targetIncomeGroup).toBe("High");
  });

  it("should handle pagination with page and limit", async () => {
    const mockAllocations = Array(5).fill({
      _id: new mongoose.Types.ObjectId(),
      sector: "Education",
    });

    BudgetAllocation.find.mockReturnValue({
      populate: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => Promise.resolve(mockAllocations),
          }),
        }),
      }),
    });

    BudgetAllocation.countDocuments.mockResolvedValue(20);

    const result = await budgetService.getAllAllocations({ page: 2, limit: 5 });

    expect(BudgetAllocation.find).toHaveBeenCalled();
    expect(result.page).toBe(2);
    expect(result.pages).toBe(4);
    expect(result.total).toBe(20);
  });

  // GET ALLOCATION BY ID

  it("should return allocation by ID with populated region", async () => {
    const allocationId = new mongoose.Types.ObjectId();
    const mockAllocation = {
      _id: allocationId,
      sector: "Education",
      allocatedAmount: 500000,
      region: {
        _id: new mongoose.Types.ObjectId(),
        regionName: "Western Province",
      },
    };

    BudgetAllocation.findById.mockReturnValue({
      populate: () => Promise.resolve(mockAllocation),
    });

    const result = await budgetService.getAllocationById(allocationId);

    expect(result._id).toBe(allocationId);
    expect(result.sector).toBe("Education");
    expect(result.region.regionName).toBe("Western Province");
  });

  it("should throw error if allocation not found", async () => {
    const allocationId = new mongoose.Types.ObjectId();

    BudgetAllocation.findById.mockReturnValue({
      populate: () => Promise.resolve(null),
    });

    await expect(budgetService.getAllocationById(allocationId)).rejects.toThrow(
      "Allocation not found",
    );
  });

  it("should throw error for invalid allocation ID format", async () => {
    await expect(budgetService.getAllocationById("invalid-id")).rejects.toThrow(
      "Invalid allocation ID format",
    );
  });

  // UPDATE ALLOCATION

  it("should update allocation successfully with populated region", async () => {
    const allocationId = new mongoose.Types.ObjectId();
    const updateData = { allocatedAmount: 750000 };
    const mockAllocation = {
      _id: allocationId,
      sector: "Education",
      allocatedAmount: 750000,
      region: {
        _id: new mongoose.Types.ObjectId(),
        regionName: "Western Province",
      },
    };

    BudgetAllocation.findByIdAndUpdate.mockReturnValue({
      populate: () => Promise.resolve(mockAllocation),
    });

    const result = await budgetService.updateAllocation(
      allocationId,
      updateData,
    );

    expect(BudgetAllocation.findByIdAndUpdate).toHaveBeenCalledWith(
      allocationId,
      updateData,
      { new: true, runValidators: true },
    );
    expect(result.allocatedAmount).toBe(750000);
    expect(result.region).toBeDefined();
  });

  it("should throw error if allocation to update not found", async () => {
    const allocationId = new mongoose.Types.ObjectId();

    BudgetAllocation.findByIdAndUpdate.mockReturnValue({
      populate: () => Promise.resolve(null),
    });

    await expect(
      budgetService.updateAllocation(allocationId, { allocatedAmount: 100 }),
    ).rejects.toThrow("Allocation not found");
  });

  it("should throw error for invalid allocation ID format on update", async () => {
    await expect(
      budgetService.updateAllocation("invalid-id", { allocatedAmount: 100 }),
    ).rejects.toThrow("Invalid allocation ID format");
  });

  // DELETE ALLOCATION

  it("should delete allocation successfully", async () => {
    const allocationId = new mongoose.Types.ObjectId();
    const mockAllocation = {
      _id: allocationId,
      sector: "Education",
    };

    BudgetAllocation.findByIdAndDelete.mockResolvedValue(mockAllocation);

    const result = await budgetService.deleteAllocation(allocationId);

    expect(BudgetAllocation.findByIdAndDelete).toHaveBeenCalledWith(
      allocationId,
    );
    expect(result._id).toBe(allocationId);
  });

  it("should throw error if allocation to delete not found", async () => {
    const allocationId = new mongoose.Types.ObjectId();

    BudgetAllocation.findByIdAndDelete.mockResolvedValue(null);

    await expect(budgetService.deleteAllocation(allocationId)).rejects.toThrow(
      "Allocation not found",
    );
  });

  it("should throw error for invalid allocation ID format on delete", async () => {
    await expect(budgetService.deleteAllocation("invalid-id")).rejects.toThrow(
      "Invalid allocation ID format",
    );
  });

  // SUMMARY BY SECTOR

  it("should return allocation summary grouped by sector", async () => {
    const mockSummary = [
      { _id: "Education", totalAllocated: 500000, count: 1 },
      { _id: "Health", totalAllocated: 300000, count: 1 },
    ];

    BudgetAllocation.aggregate.mockResolvedValue(mockSummary);

    const result = await budgetService.getSummaryBySector();

    expect(BudgetAllocation.aggregate).toHaveBeenCalled();
    expect(result.length).toBe(2);
    expect(result[0].totalAllocated).toBe(500000);
  });

  it("should filter summary by year", async () => {
    const mockSummary = [
      { _id: "Education", totalAllocated: 500000, count: 2 },
    ];

    BudgetAllocation.aggregate.mockResolvedValue(mockSummary);

    const result = await budgetService.getSummaryBySector(2023);

    expect(BudgetAllocation.aggregate).toHaveBeenCalled();
    const pipeline = BudgetAllocation.aggregate.mock.calls[0][0];
    expect(pipeline[0]).toEqual({ $match: { year: 2023 } });
    expect(result.length).toBe(1);
  });

  // AVAILABLE YEARS

  it("should return available years with data", async () => {
    const mockYears = [{ _id: 2024 }, { _id: 2023 }, { _id: 2022 }];

    BudgetAllocation.aggregate.mockResolvedValue(mockYears);

    const result = await budgetService.getAvailableYears();

    expect(BudgetAllocation.aggregate).toHaveBeenCalled();
    expect(result).toEqual([2024, 2023, 2022]);
  });

  it("should return empty array when no years available", async () => {
    BudgetAllocation.aggregate.mockResolvedValue([]);

    const result = await budgetService.getAvailableYears();

    expect(result).toEqual([]);
  });

  // INFLATION-ADJUSTED ALLOCATIONS

  it("should get inflation-adjusted allocations for a given year", async () => {
    const mockAllocations = [
      {
        _id: new mongoose.Types.ObjectId(),
        sector: "Education",
        allocatedAmount: 500000,
        year: 2023,
        toObject: () => ({
          sector: "Education",
          allocatedAmount: 500000,
          year: 2023,
        }),
      },
    ];

    const mockApiResponse = {
      data: [
        {}, // metadata
        [
          { date: "2023", value: 2.5 },
          { date: "2022", value: 1.8 },
        ],
      ],
    };

    BudgetAllocation.find.mockResolvedValue(mockAllocations);
    axios.get.mockResolvedValue(mockApiResponse);

    const result = await budgetService.getAdjustedAllocations(2023);

    expect(BudgetAllocation.find).toHaveBeenCalledWith({ year: 2023 });
    expect(axios.get).toHaveBeenCalled();
    expect(result.year).toBe(2023);
    expect(result.inflationRate).toBe(2.5);
    expect(result.data[0].adjustedAmount).toBe(512500);
  });

  it("should handle missing inflation data and default to 0", async () => {
    const mockAllocations = [
      {
        _id: new mongoose.Types.ObjectId(),
        sector: "Education",
        allocatedAmount: 500000,
        year: 1999,
        toObject: () => ({
          sector: "Education",
          allocatedAmount: 500000,
          year: 1999,
        }),
      },
    ];

    const mockApiResponse = {
      data: [
        {},
        [{ date: "2023", value: 2.5 }], // No data for 1999
      ],
    };

    BudgetAllocation.find.mockResolvedValue(mockAllocations);
    axios.get.mockResolvedValue(mockApiResponse);

    const result = await budgetService.getAdjustedAllocations(1999);

    expect(result.inflationRate).toBe(0);
    expect(result.data[0].adjustedAmount).toBe(500000);
  });

  it("should throw error if no allocations found for year", async () => {
    BudgetAllocation.find.mockResolvedValue([]);

    await expect(budgetService.getAdjustedAllocations(2023)).rejects.toThrow(
      "No allocations found for this year",
    );
  });

  it("should throw error when World Bank API returns unexpected response format", async () => {
    const mockAllocations = [
      {
        allocatedAmount: 500000,
        year: 2023,
        toObject: () => ({ allocatedAmount: 500000, year: 2023 }),
      },
    ];

    BudgetAllocation.find.mockResolvedValue(mockAllocations);
    axios.get.mockResolvedValue({
      data: null, // Invalid response
    });

    await expect(budgetService.getAdjustedAllocations(2023)).rejects.toThrow(
      "Unexpected response format from World Bank API",
    );
  });

  it("should handle API timeout error", async () => {
    const mockAllocations = [
      {
        allocatedAmount: 500000,
        year: 2023,
        toObject: () => ({ allocatedAmount: 500000, year: 2023 }),
      },
    ];

    BudgetAllocation.find.mockResolvedValue(mockAllocations);
    const timeoutError = new Error("Request timeout");
    timeoutError.code = "ECONNABORTED";
    axios.get.mockRejectedValue(timeoutError);

    await expect(budgetService.getAdjustedAllocations(2023)).rejects.toThrow(
      "World Bank API request timed out",
    );
  });

  it("should handle API connection error", async () => {
    const mockAllocations = [
      {
        allocatedAmount: 500000,
        year: 2023,
        toObject: () => ({ allocatedAmount: 500000, year: 2023 }),
      },
    ];

    BudgetAllocation.find.mockResolvedValue(mockAllocations);
    axios.get.mockRejectedValue(new Error("Connection failed"));

    await expect(budgetService.getAdjustedAllocations(2023)).rejects.toThrow(
      "Failed to fetch inflation data from World Bank API",
    );
  });
});
