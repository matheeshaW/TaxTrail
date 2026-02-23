const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const app = require('../server')


let mongoServer
let token
let regionId

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


    it('should register admin user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: "Admin",
                email: "admin@test.com",
                password: "password",
                role: "Admin"
            })
        expect(res.statusCode).toEqual(200),
        expect(res.body.token).toBeDefined()

        token = res.body.token
    })

    it('should create a region', async () => {
        const res = await request(app)
            .post('/api/v1/regions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                regionName: "Western Province"
            })
        expect(res.statusCode).toEqual(201)
        regionId = res.body.data._id
    })

    it('should create a tax contribution', async () => {

        const res = await request(app)
            .post('/api/v1/tax-contributions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                payerType: "Individual",
                incomeBracket: "Low",
                taxType: "Income",
                amount: 5000,
                year: 2023,
                region: regionId
            })
        expect(res.statusCode).toEqual(201)
        expect(res.body.data.amount).toEqual(5000)

    })

    it('should get tax contributions', async () => {
        const res = await request(app)
            .get('/api/v1/tax-contributions')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.data.length).toBe(1)
    })
    
})