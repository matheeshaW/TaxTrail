const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");

let mongoServer;
let adminToken;
let publicToken;
let regionId;
let allocationId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Budget Allocation API", () => {
  // REGISTER ADMIN
  it("should register admin user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: "admin@test.com",
      password: "password",
      role: "Admin",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  // REGISTER PUBLIC USER
  it("should register public user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Public",
      email: "public@test.com",
      password: "password",
      role: "Public",
    });

    expect(res.statusCode).toBe(201);
    publicToken = res.body.token;
  });

  // CREATE REGION
  it("should create a region (admin only)", async () => {
    const res = await request(app)
      .post("/api/v1/regions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ regionName: "Western Province" });

    expect(res.statusCode).toBe(201);
    regionId = res.body.data._id;
  });

  // FAIL: NO TOKEN
  it("should return 401 if no token provided", async () => {
    const res = await request(app).post("/api/v1/budget-allocations").send({});

    expect(res.statusCode).toBe(401);
  });

  // FAIL: PUBLIC USER TRYING TO CREATE
  it("should return 403 if public user tries to create allocation", async () => {
    const res = await request(app)
      .post("/api/v1/budget-allocations")
      .set("Authorization", `Bearer ${publicToken}`)
      .send({
        sector: "Education",
        allocatedAmount: 500000,
        targetIncomeGroup: "Low",
        year: 2023,
        region: regionId,
      });

    expect(res.statusCode).toBe(403);
  });

  // FAIL: VALIDATION ERROR
  it("should return 400 for invalid payload", async () => {
    const res = await request(app)
      .post("/api/v1/budget-allocations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        sector: "InvalidSector",
        allocatedAmount: -100,
        targetIncomeGroup: "WrongGroup",
      });

    expect(res.statusCode).toBe(400);
  });

  // SUCCESS: CREATE
  it("should create a budget allocation with populated region", async () => {
    const res = await request(app)
      .post("/api/v1/budget-allocations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        sector: "Education",
        allocatedAmount: 500000,
        targetIncomeGroup: "Low",
        year: 2023,
        region: regionId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data._id).toBeDefined();
    expect(res.body.data.allocatedAmount).toBe(500000);
    expect(res.body.data.sector).toBe("Education");
    expect(res.body.data.targetIncomeGroup).toBe("Low");
    expect(res.body.data.year).toBe(2023);

    // Assert region is populated as object, not just ObjectId
    expect(res.body.data.region).toBeDefined();
    expect(typeof res.body.data.region).toBe("object");
    expect(res.body.data.region._id).toBe(regionId);
    expect(res.body.data.region.regionName).toBe("Western Province");

    allocationId = res.body.data._id;
  });

  // GET ALL - ADMIN
  it("should get all budget allocations", async () => {
    const res = await request(app)
      .get("/api/v1/budget-allocations")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  // GET ALL WITH FILTERS
  it("should filter allocations by sector and year", async () => {
    const res = await request(app)
      .get("/api/v1/budget-allocations?sector=Education&year=2023")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // GET ALL - PUBLIC USER
  it("should allow public user to get all allocations", async () => {
    const res = await request(app)
      .get("/api/v1/budget-allocations")
      .set("Authorization", `Bearer ${publicToken}`);

    expect(res.statusCode).toBe(200);
  });

  // GET SINGLE
  it("should get a single budget allocation by ID with populated region", async () => {
    const res = await request(app)
      .get(`/api/v1/budget-allocations/${allocationId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(allocationId);

    // Assert region is populated
    expect(res.body.data.region).toBeDefined();
    expect(typeof res.body.data.region).toBe("object");
    expect(res.body.data.region.regionName).toBe("Western Province");
  });

  // FAIL: INVALID OBJECT ID
  it("should return 400 for invalid allocation ID format", async () => {
    const res = await request(app)
      .get("/api/v1/budget-allocations/invalid-id")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
  });

  // FAIL: NOT FOUND
  it("should return 404 for non-existent allocation ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/v1/budget-allocations/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  // UPDATE (PATCH - partial update)
  it("should partially update a budget allocation with populated region", async () => {
    const res = await request(app)
      .patch(`/api/v1/budget-allocations/${allocationId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ allocatedAmount: 750000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.allocatedAmount).toBe(750000);

    // Assert region remains populated after update
    expect(res.body.data.region).toBeDefined();
    expect(typeof res.body.data.region).toBe("object");
    expect(res.body.data.region.regionName).toBe("Western Province");
  });

  // FAIL: PUBLIC USER TRYING TO UPDATE
  it("should return 403 if public user tries to update allocation", async () => {
    const res = await request(app)
      .patch(`/api/v1/budget-allocations/${allocationId}`)
      .set("Authorization", `Bearer ${publicToken}`)
      .send({ allocatedAmount: 100 });

    expect(res.statusCode).toBe(403);
  });

  // SUMMARY BY SECTOR - ADMIN
  it("should get allocation summary by sector", async () => {
    const res = await request(app)
      .get("/api/v1/budget-allocations/summary/by-sector")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.data).toBeDefined();
  });

  // SUMMARY BY SECTOR - PUBLIC USER
  it("should allow public user to get summary by sector", async () => {
    const res = await request(app)
      .get("/api/v1/budget-allocations/summary/by-sector")
      .set("Authorization", `Bearer ${publicToken}`);

    expect(res.statusCode).toBe(200);
  });

  // ADJUSTED ALLOCATIONS BY YEAR - ADMIN
  it("should get inflation-adjusted allocations by year", async () => {
    const res = await request(app)
      .get("/api/v1/budget-allocations/adjusted/2023")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.inflationRate).toBeDefined();
  });

  // FAIL: ADJUSTED ALLOCATIONS - YEAR WITH NO DATA
  it("should return 404 for adjusted allocations with no matching year", async () => {
    const res = await request(app)
      .get("/api/v1/budget-allocations/adjusted/1800")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  // DELETE
  it("should delete a budget allocation", async () => {
    const res = await request(app)
      .delete(`/api/v1/budget-allocations/${allocationId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Allocation deleted successfully");
  });

  // FAIL: PUBLIC USER TRYING TO DELETE
  it("should return 403 if public user tries to delete allocation", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/v1/budget-allocations/${fakeId}`)
      .set("Authorization", `Bearer ${publicToken}`);

    expect(res.statusCode).toBe(403);
  });

  // FAIL: NOT FOUND AFTER DELETE
  it("should return 404 after deletion", async () => {
    const res = await request(app)
      .get(`/api/v1/budget-allocations/${allocationId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  // Specific enum validation tests
  it("should return 400 for invalid targetIncomeGroup enum", async () => {
    const res = await request(app)
      .post("/api/v1/budget-allocations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        sector: "Education",
        allocatedAmount: 500000,
        targetIncomeGroup: "VeryHigh", // INVALID
        year: 2023,
        region: regionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid sector enum", async () => {
    const res = await request(app)
      .post("/api/v1/budget-allocations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        sector: "Transportation", // INVALID
        allocatedAmount: 500000,
        targetIncomeGroup: "Low",
        year: 2023,
        region: regionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Test year < 2000
  it("should return 400 for year less than 2000", async () => {
    const res = await request(app)
      .post("/api/v1/budget-allocations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        sector: "Health",
        allocatedAmount: 500000,
        targetIncomeGroup: "Low",
        year: 1999, // INVALID
        region: regionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // Test negative amount (express-validator catches this)
  it("should return 400 for negative allocatedAmount", async () => {
    const res = await request(app)
      .post("/api/v1/budget-allocations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        sector: "Health",
        allocatedAmount: -5000, // INVALID - express-validator catches this
        targetIncomeGroup: "Low",
        year: 2023,
        region: regionId,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined(); // This has errors array
  });

  // Test region filter
  it("should filter allocations by region", async () => {
    // First create another allocation for testing
    await request(app)
      .post("/api/v1/budget-allocations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        sector: "Health",
        allocatedAmount: 300000,
        targetIncomeGroup: "Middle",
        year: 2024,
        region: regionId,
      });

    const res = await request(app)
      .get(`/api/v1/budget-allocations?region=${regionId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Test pagination
  it("should handle pagination with page and limit parameters", async () => {
    const res = await request(app)
      .get("/api/v1/budget-allocations?page=1&limit=5")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.pages).toBeDefined();
    expect(res.body.total).toBeDefined();
  });

  // Test available years endpoint
  it("should get available years with data", async () => {
    const res = await request(app)
      .get("/api/v1/budget-allocations/summary/available-years")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
