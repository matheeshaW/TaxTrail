const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); 

let mongoServer;
let adminToken; 
let createdDataId; 
let validRegionId; 

//Create fake DB, register Admin, and create a Region
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri);

  // Register an Admin user immediately
  const authResponse = await request(app)
    .post('/api/auth/register')
    .send({
      name: "Admin Test",
      email: "admin_test@taxtrail.com",
      password: "password123",
      role: "Admin"
    });
  adminToken = authResponse.body.token;

  const regionResponse = await request(app)
    .post('/api/v1/regions')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      regionName: "Test Province"
    });
    
 
  validRegionId = regionResponse.body.data ? regionResponse.body.data._id : regionResponse.body._id;
});

//delete the fake database
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// THE TESTS (Full CRUD Coverage)
describe('Regional Development API - Full CRUD Tests', () => {

 
  it('Should return 401 Unauthorized if no token is provided', async () => {
    const res = await request(app).post('/api/v1/regional-development').send({
      region: validRegionId, year: 2026, averageIncome: 50000, povertyRate: 5.5
    });
    expect(res.statusCode).toBe(401);
  });

  //CREATE (POST)
  it('Should create new regional data when Admin is logged in', async () => {
    const res = await request(app)
      .post('/api/v1/regional-development')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        region: validRegionId,
        year: 2026,
        averageIncome: 45000,
        unemploymentRate: 8.1,
        povertyRate: 8.5
      });
    
    expect(res.statusCode).toBe(201); 
    expect(res.body.success).toBe(true);
    createdDataId = res.body.data._id; 
  });

  //READ (GET)
  it('Should fetch all regional data', async () => {
    const res = await request(app)
      .get('/api/v1/regional-development')
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1); 
  });

  // UPDATE (PUT)
  it('Should update existing regional data', async () => {
    const res = await request(app)
      .put(`/api/v1/regional-development/${createdDataId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        averageIncome: 55000 
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.averageIncome).toBe(55000); 
  });

  //ANALYTICS (GET Inequality Index)
  it('Should calculate the inequality index', async () => {
    const res = await request(app)
      .get('/api/v1/regional-development/inequality-index')
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.analysis).toBeDefined();
  });

  //DELETE
  it('Should delete the regional data', async () => {
    const res = await request(app)
      .delete(`/api/v1/regional-development/${createdDataId}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Data deleted successfully');
  });

});