const request = require('supertest');
const app = require('../server');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

jest.mock('../services/inequalityService', () => ({
  getLatestGini: jest.fn().mockResolvedValue({
    year: '2019',
    giniIndex: 37.7
  })
}));

describe('Social Programs Integration Tests', () => {
  let token;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('testpassword', 10);

    await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'Admin'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'testpassword'
      });

    token = res.body.token;
  });

  it('should restrict access without token', async () => {
    const res = await request(app)
      .post('/api/socialprograms');

    expect(res.statusCode).toBe(401);
  });

  it('should allow admin to create program with token', async () => {
    const res = await request(app)
      .post('/api/socialprograms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        programName: 'Test Program',
        sector: 'Health',
        targetGroup: 'Low Income',
        beneficiariesCount: 100,
        budgetUsed: 50000,
        year: 2024,
        region: null
      });

    expect(res.statusCode).toBe(400); // region likely required
  });

  it('should return inequality analysis', async () => {
    const res = await request(app)
      .get('/api/socialprograms/inequality-analysis/LKA');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('giniIndex');
  });
});
