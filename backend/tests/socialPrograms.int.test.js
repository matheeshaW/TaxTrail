const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const app = require('../server')

jest.mock('../services/inequalityService', () => ({
  getLatestGini: jest.fn().mockResolvedValue({
    year: '2019',
    giniIndex: 37.7
  })
}))

let mongoServer
let adminToken
let publicToken
let regionId
let programId

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Social Programs API', () => {
  it('should register admin user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin',
        email: 'admin-social@test.com',
        password: 'password',
        role: 'Admin'
      })

    adminToken = res.body.token
    expect(res.statusCode).toBe(201)
    expect(adminToken).toBeDefined()
  })

  it('should register public user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Public',
        email: 'public-social@test.com',
        password: 'password',
        role: 'Public'
      })

    publicToken = res.body.token
    expect(res.statusCode).toBe(201)
    expect(publicToken).toBeDefined()
  })

  it('should create region (admin only)', async () => {
    const res = await request(app)
      .post('/api/v1/regions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ regionName: 'Western Province' })

    expect(res.statusCode).toBe(201)
    regionId = res.body.data._id
  })

  it('should return 401 if no token provided', async () => {
    const res = await request(app)
      .post('/api/socialprograms')
      .send({})

    expect(res.statusCode).toBe(401)
  })

  it('should return 403 if public tries to create program', async () => {
    const res = await request(app)
      .post('/api/socialprograms')
      .set('Authorization', `Bearer ${publicToken}`)
      .send({
        programName: 'School Meals',
        sector: 'Education',
        targetGroup: 'Low Income',
        beneficiariesCount: 100,
        budgetUsed: 50000,
        year: 2024,
        region: regionId
      })

    expect(res.statusCode).toBe(403)
  })

  it('should return 400 for invalid payload', async () => {
    const res = await request(app)
      .post('/api/socialprograms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        programName: 'Invalid Program',
        sector: 'InvalidSector',
        targetGroup: 'Low Income',
        beneficiariesCount: 100,
        budgetUsed: 50000,
        year: 2024,
        region: regionId
      })

    expect(res.statusCode).toBe(400)
  })

  it('should create a social program', async () => {
    const res = await request(app)
      .post('/api/socialprograms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        programName: 'School Meals',
        sector: 'Education',
        targetGroup: 'Low Income',
        beneficiariesCount: 100,
        budgetUsed: 50000,
        year: 2024,
        region: regionId
      })

    expect(res.statusCode).toBe(201)
    expect(res.body.programName).toBe('School Meals')
    programId = res.body._id
  })

  it('should get all social programs', async () => {
    const res = await request(app)
      .get('/api/socialprograms')

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })

  it('should get social program by ID', async () => {
    const res = await request(app)
      .get(`/api/socialprograms/${programId}`)

    expect(res.statusCode).toBe(200)
    expect(res.body._id).toBe(programId)
  })

  it('should return 400 for invalid social program ID format', async () => {
    const res = await request(app)
      .get('/api/socialprograms/invalid-id')

    expect(res.statusCode).toBe(400)
  })

  it('should update social program', async () => {
    const res = await request(app)
      .put(`/api/socialprograms/${programId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ budgetUsed: 60000 })

    expect(res.statusCode).toBe(200)
    expect(res.body.budgetUsed).toBe(60000)
  })

  it('should delete social program', async () => {
    const res = await request(app)
      .delete(`/api/socialprograms/${programId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.statusCode).toBe(204)
  })

  it('should return 404 after deletion', async () => {
    const res = await request(app)
      .get(`/api/socialprograms/${programId}`)

    expect(res.statusCode).toBe(404)
  })

  it('should return inequality analysis', async () => {
    const res = await request(app)
      .get('/api/socialprograms/inequality-analysis/LKA')

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('giniIndex')
  })
})
