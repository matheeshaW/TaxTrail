const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const app = require('../server')


let mongoServer
let adminToken
let publicToken
let regionId
let taxId

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
}
)

afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

describe('Tax Contribution API', () => {

    //Register ADMIN
    it('should register admin user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: "Admin",
                email: "admin@test.com",
                password: "password",
                role: "Admin"
            })
        expect(res.statusCode).toEqual(201),
        expect(res.body.token).toBeDefined()
        adminToken = res.body.token
    })

      // REGISTER PUBLIC USER
    it('should register public user', async () => {
        const res = await request(app)
        .post('/api/auth/register')
        .send({
            name: "Public",
            email: "public@test.com",
            password: "password",
            role: "Public"
        })

        expect(res.statusCode).toBe(201)
        publicToken = res.body.token
    })

    // CREATE REGION
    it('should create region (admin only)', async () => {
        const res = await request(app)
        .post('/api/v1/regions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ regionName: "Western Province" })

        expect(res.statusCode).toBe(201)
        regionId = res.body.data._id
    })

        // FAIL: NO TOKEN
    it('should return 401 if no token provided', async () => {
        const res = await request(app)
        .post('/api/v1/tax-contributions')
        .send({})

        expect(res.statusCode).toBe(401)
    })


    // FAIL: PUBLIC USER TRYING TO CREATE
    it('should return 403 if public tries to create tax', async () => {
        const res = await request(app)
        .post('/api/v1/tax-contributions')
        .set('Authorization', `Bearer ${publicToken}`)
        .send({
            payerType: "Individual",
            incomeBracket: "Low",
            taxType: "Income",
            amount: 5000,
            year: 2023,
            region: regionId
        })

        expect(res.statusCode).toBe(403)
    })

        // FAIL: VALIDATION ERROR
    it('should return 400 for invalid payload', async () => {
        const res = await request(app)
        .post('/api/v1/tax-contributions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            payerType: "WrongEnum",
            amount: -100
        })

        expect(res.statusCode).toBe(400)
    })


        // SUCCESS CREATE
    it('should create a tax contribution', async () => {
        const res = await request(app)
        .post('/api/v1/tax-contributions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
            payerType: "Individual",
            incomeBracket: "Low",
            taxType: "Income",
            amount: 5000,
            year: 2023,
            region: regionId
        })

        expect(res.statusCode).toBe(201)
        expect(res.body.data.amount).toBe(5000)

        taxId = res.body.data._id
    })

        // GET ALL
    it('should get all tax contributions', async () => {
        const res = await request(app)
        .get('/api/v1/tax-contributions')
        .set('Authorization', `Bearer ${adminToken}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.data.length).toBe(1)
    })

        // GET SINGLE
    it('should get single tax contribution by ID', async () => {
        const res = await request(app)
        .get(`/api/v1/tax-contributions/${taxId}`)
        .set('Authorization', `Bearer ${adminToken}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.data._id).toBe(taxId)
    })

        // FAIL: INVALID OBJECT ID
    it('should return 400 for invalid tax ID format', async () => {
        const res = await request(app)
        .get('/api/v1/tax-contributions/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)

        expect(res.statusCode).toBe(400)
    })


        // UPDATE
    it('should update tax contribution', async () => {
        const res = await request(app)
        .put(`/api/v1/tax-contributions/${taxId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 10000 })

        expect(res.statusCode).toBe(200)
        expect(res.body.data.amount).toBe(10000)
    })

        // DELETE
    it('should delete tax contribution', async () => {
        const res = await request(app)
        .delete(`/api/v1/tax-contributions/${taxId}`)
        .set('Authorization', `Bearer ${adminToken}`)

        expect(res.statusCode).toBe(200)
    })


        // FAIL: NOT FOUND AFTER DELETE
    it('should return 404 after deletion', async () => {
        const res = await request(app)
        .get(`/api/v1/tax-contributions/${taxId}`)
        .set('Authorization', `Bearer ${adminToken}`)

        expect(res.statusCode).toBe(404)
    })

        // SUMMARY BY REGION
    it('should get tax contribution summary by region', async () => {
        const res = await request(app)
        .get('/api/v1/tax-contributions/summary/region')
        .set('Authorization', `Bearer ${adminToken}`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toBeDefined()
        expect(res.body.data).toBeDefined()
    })
})