
jest.mock('../models/RegionalDevelopment')
jest.mock('../models/regionModel')
jest.mock('axios') 

const mongoose = require('mongoose')
const axios = require('axios')

// IMPORT MODELS
const RegionalData = require('../models/RegionalDevelopment')
const Region = require('../models/regionModel')


const regionalService = require('../services/regionalDevService') 
const sdgService = require('../services/sdgService')

describe('Regional Development Service - Master Unit Tests', () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    // SDG API LOGIC 
    describe('SDG API Fallback Logic', () => {
        it('should return live World Bank API data when the network is successful', async () => {
            const mockApiData = { data: [ { page: 1 }, [ { value: 29.3, date: '2023' } ] ] }
            axios.get.mockResolvedValueOnce(mockApiData)

            const result = await sdgService.getGlobalInequalityData()

            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(result.globalBenchmark).toBe(29.3)
        })

        it('should gracefully return the offline fallback cache if the World Bank API times out', async () => {
            axios.get.mockRejectedValueOnce(new Error('ETIMEDOUT'))

            const result = await sdgService.getGlobalInequalityData()

            expect(axios.get).toHaveBeenCalledTimes(1)
            expect(result.globalBenchmark).toBe(27.7) 
           
        })
    })

    // DATABASE CRUD
    describe('Database Operations (CRUD)', () => {

        // CREATE REGIONAL DATA

        it('should create regional data when region exists', async () => {
            const mockData = {
                region: new mongoose.Types.ObjectId(),
                year: 2026,
                averageIncome: 45000,
                unemploymentRate: 8.1,
                povertyRate: 8.5
            }

            Region.findById.mockResolvedValue({ _id: mockData.region })
            RegionalData.create.mockResolvedValue(mockData)

            const result = await regionalService.createRegionalData(mockData)

            expect(Region.findById).toHaveBeenCalled()
            expect(RegionalData.create).toHaveBeenCalledWith(mockData)
            expect(result.averageIncome).toBe(45000)
        })

        it('should throw error if region does not exist', async () => {
            const mockData = {
                region: new mongoose.Types.ObjectId()
            }

            Region.findById.mockResolvedValue(null)

            await expect(regionalService.createRegionalData(mockData))
                .rejects
                .toThrow("Region not found") 
        })

        //  GET ALL REGIONAL DATA

        it('should return regional data records', async () => {
            const mockRegionalRecords = [
                {
                    averageIncome: 45000,
                    year: 2026,
                    toObject: () => ({ averageIncome: 45000 })
                }
            ]
            
            RegionalData.find.mockReturnValue({
                populate: () => ({
                    sort: () => ({
                        skip: () => ({
                            limit: () => mockRegionalRecords
                        })
                    })
                })
            })

            RegionalData.countDocuments.mockResolvedValue(1)

            const result = await regionalService.getAllRegionalData({})

            expect(result.data[0].averageIncome).toBe(45000)
            expect(result.total).toBe(1)
        })

        // GET BY ID 

        it('should return regional data by ID', async () => {
            const mockRecord = { _id: "123", averageIncome: 45000 }

            RegionalData.findById.mockReturnValue({
                populate: () => mockRecord
            })

            const result = await regionalService.getRegionalDataById(new mongoose.Types.ObjectId())

            expect(result).toEqual(mockRecord)
        })

        it('should throw error if regional data not found', async () => {
            RegionalData.findById.mockReturnValue({
                populate: () => null
            })

            await expect(
                regionalService.getRegionalDataById(new mongoose.Types.ObjectId())
            ).rejects.toThrow("Regional data not found")
        })

        // DELETE

        it('should delete regional data successfully', async () => {
            RegionalData.findByIdAndDelete.mockResolvedValue({ _id: "123" })

            const result = await regionalService.deleteRegionalData(new mongoose.Types.ObjectId())

            expect(result._id).toBeDefined()
        })

        it('should throw error if delete target not found', async () => {
            RegionalData.findByIdAndDelete.mockResolvedValue(null)

            await expect(
                regionalService.deleteRegionalData(new mongoose.Types.ObjectId())
            ).rejects.toThrow("Regional record not found")
        })

    })
})