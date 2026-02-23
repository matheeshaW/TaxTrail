const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); 

let mongoServer;

//Create the fake in-memory database before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Close the real database connection if it's open, then connect to the fake one
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri);
});

// Destroy the fake database after tests are done
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

//THE ACTUAL TESTS
describe('Regional Development API Tests', () => {

  describe('POST /api/v1/regional-development', () => {
    
    it('Should return 401 Unauthorized if no Admin token is provided', async () => {
      //Try to create data WITHOUT logging in
      const res = await request(app)
        .post('/api/v1/regional-development')
        .send({
          region: "65fa1b2c1234567890abcdef",
          year: 2026,
          averageIncome: 50000,
          povertyRate: 5.5
        });

      //Check if the server successfully blocked us
      expect(res.statusCode).toBe(401);
    });

  describe('GET /api/v1/regional-development', () => {
    
    it('Should fetch all regional data and return 200 OK when authenticated', async () => {
      
      //Register a fake user to get a token!
      const authResponse = await request(app)
        .post('/api/auth/register') 
        .send({
          name: "Test User",
          email: "test@taxtrail.com",
          password: "password123",
          role: "Public"
        });

      // Grab the token from the response
      const token = authResponse.body.token;

      // 2. Send the GET request WITH the token in the header
      const res = await request(app)
        .get('/api/v1/regional-development')
        .set('Authorization', `Bearer ${token}`); 

      // 3. Check if it succeeded and returned an empty array
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

  });

  });

});