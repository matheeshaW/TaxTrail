jest.mock('../models/taxContributionModel')
jest.mock('../models/regionModel')
jest.mock('../services/exchangeRateService')

const mongoose = require('mongoose')

const TaxContribution = require('../models/taxContributionModel')
const Region = require('../models/regionModel')
const { getRatesFromBase } = require('../services/exchangeRateService')

const taxService = require('../services/taxContributionService')

describe('TaxContribution Service - Unit Tests', () => {

    afterEach(() => {
        jest.clearAllMocks()
    })

    // CREATE TAX

    it('should create tax when region exists', async () => {
        const mockData = {
            payerType: "Individual",
            incomeBracket: "Low",
            taxType: "Income",
            amount: 5000,
            year: 2023,
            region: new mongoose.Types.ObjectId()
        }

        Region.findById.mockResolvedValue({ _id: mockData.region })
        TaxContribution.create.mockResolvedValue(mockData)

        const result = await taxService.createTax(mockData)

        expect(Region.findById).toHaveBeenCalled()
        expect(TaxContribution.create).toHaveBeenCalledWith(mockData)
        expect(result.amount).toBe(5000)
    })

    it('should throw error if region does not exist', async () => {
        const mockData = {
            region: new mongoose.Types.ObjectId()
        }

        Region.findById.mockResolvedValue(null)

        await expect(taxService.createTax(mockData))
            .rejects
            .toThrow("Region not found")
    })

    // GET ALL TAXES

    it('should return taxes without currency conversion', async () => {
        const mockTaxes = [
            {
                amount: 1000,
                toObject: () => ({ amount: 1000 })
            }
        ]
        TaxContribution.find.mockReturnValue({
            populate: () => ({
                sort: () => ({
                    skip: () => ({
                        limit: () => mockTaxes
                    })
                })
            })
        })

        TaxContribution.countDocuments.mockResolvedValue(1)

        const result = await taxService.getAllTax({})

        expect(result.data[0].amount).toBe(1000)
        expect(result.total).toBe(1)
    })

    it('should convert currency when currency param provided', async () => {
        const mockTaxes = [
            {
                amount: 1000,
                toObject: () => ({ amount: 1000 })
            }
        ]

        TaxContribution.find.mockReturnValue({
            populate: () => ({
                sort: () => ({
                    skip: () => ({
                        limit: () => mockTaxes
                    })
                })
            })
        })

        TaxContribution.countDocuments.mockResolvedValue(1)
        getRatesFromBase.mockResolvedValue({ USD: 0.003 })

        const result = await taxService.getAllTax({ currency: 'USD' })

        expect(getRatesFromBase).toHaveBeenCalledWith('LKR')
        expect(result.data[0].convertedAmount).toBe(3)
    })

    it('should throw error for unsupported currency', async () => {
        const mockTaxes = [
            {
                amount: 1000,
                toObject: () => ({ amount: 1000 })
            }
        ]

        TaxContribution.find.mockReturnValue({
            populate: () => ({
                sort: () => ({
                    skip: () => ({
                        limit: () => mockTaxes
                    })
                })
            })
        })

        TaxContribution.countDocuments.mockResolvedValue(1)
        getRatesFromBase.mockResolvedValue({ EUR: 0.002 })

        await expect(
            taxService.getAllTax({ currency: 'USD' })
        ).rejects.toThrow('Unsupported currency for conversion')
    })

    // GET BY ID

    it('should return tax by ID', async () => {
        const mockTax = { _id: "123" }

        TaxContribution.findById.mockReturnValue({
            populate: () => mockTax
        })

        const result = await taxService.getTaxById(new mongoose.Types.ObjectId())

        expect(result).toEqual(mockTax)
    })

    it('should throw error if tax not found', async () => {
        TaxContribution.findById.mockReturnValue({
            populate: () => null
        })

        await expect(
            taxService.getTaxById(new mongoose.Types.ObjectId())
        ).rejects.toThrow("Tax contribution not found")
    })

    // DELETE

    it('should delete tax successfully', async () => {
        TaxContribution.findByIdAndDelete.mockResolvedValue({ _id: "123" })

        const result = await taxService.deleteTax(new mongoose.Types.ObjectId())

        expect(result._id).toBeDefined()
    })

    it('should throw error if delete target not found', async () => {
        TaxContribution.findByIdAndDelete.mockResolvedValue(null)

        await expect(
            taxService.deleteTax(new mongoose.Types.ObjectId())
        ).rejects.toThrow("Tax record not found")
    })

})