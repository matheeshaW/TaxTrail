jest.mock('../models/SocialProgram')
jest.mock('../models/regionModel')
jest.mock('../services/inequalityService')

const mongoose = require('mongoose')

const SocialProgram = require('../models/SocialProgram')
const Region = require('../models/regionModel')
const { getLatestGini } = require('../services/inequalityService')

const {
  validateProgramRules,
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  getInequalityAnalysis
} = require('../services/socialProgramService')

describe('SocialProgram Service - Unit Tests', () => {
  const userId = new mongoose.Types.ObjectId()
  const regionId = new mongoose.Types.ObjectId()

  const baseProgramData = () => ({
    programName: 'Food Aid',
    sector: 'Welfare',
    targetGroup: 'Low Income',
    beneficiariesCount: 100,
    budgetUsed: 500000,
    year: 2023,
    region: regionId
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('validateProgramRules', () => {
    it('should throw when Low Income has zero beneficiaries', () => {
      try {
        validateProgramRules({
          targetGroup: 'Low Income',
          beneficiariesCount: 0,
          budgetUsed: 1000,
          year: 2023
        })
        expect.fail('expected throw')
      } catch (e) {
        expect(e.status).toBe(400)
        expect(e.message).toContain('Beneficiaries count must be greater than zero')
      }
    })

    it('should throw when year is in the future', () => {
      const futureYear = new Date().getFullYear() + 1
      try {
        validateProgramRules({
          targetGroup: 'Middle Income',
          beneficiariesCount: 10,
          budgetUsed: 1000,
          year: futureYear
        })
        expect.fail('expected throw')
      } catch (e) {
        expect(e.status).toBe(400)
        expect(e.message).toContain('cannot exceed current year')
      }
    })

    it('should throw when budget per beneficiary exceeds threshold', () => {
      try {
        validateProgramRules({
          targetGroup: 'Low Income',
          beneficiariesCount: 1,
          budgetUsed: 2000000,
          year: 2023
        })
        expect.fail('expected throw')
      } catch (e) {
        expect(e.status).toBe(400)
        expect(e.message).toContain('Budget per beneficiary exceeds')
      }
    })
  })

  describe('createProgram', () => {
    it('should create program when region exists', async () => {
      const data = baseProgramData()
      const created = { ...data, _id: new mongoose.Types.ObjectId(), createdBy: userId }

      Region.findById.mockResolvedValue({ _id: regionId })
      SocialProgram.create.mockResolvedValue(created)

      const result = await createProgram(data, userId)

      expect(Region.findById).toHaveBeenCalledWith(regionId)
      expect(SocialProgram.create).toHaveBeenCalledWith({
        ...data,
        createdBy: userId
      })
      expect(result.programName).toBe('Food Aid')
    })

    it('should throw when region does not exist', async () => {
      const data = baseProgramData()
      Region.findById.mockResolvedValue(null)

      await expect(createProgram(data, userId)).rejects.toMatchObject({
        status: 400,
        message: 'Region does not exist'
      })
      expect(SocialProgram.create).not.toHaveBeenCalled()
    })
  })

  describe('getAllPrograms', () => {
    it('should return programs with populate chain', async () => {
      const mockPrograms = [{ programName: 'A' }]
      SocialProgram.find.mockReturnValue({
        populate: () => ({
          populate: () => Promise.resolve(mockPrograms)
        })
      })

      const result = await getAllPrograms()

      expect(SocialProgram.find).toHaveBeenCalled()
      expect(result).toEqual(mockPrograms)
    })
  })

  describe('getProgramById', () => {
    it('should return program when found', async () => {
      const mockProgram = { programName: 'X' }
      SocialProgram.findById.mockReturnValue({
        populate: () => ({
          populate: () => Promise.resolve(mockProgram)
        })
      })

      const id = new mongoose.Types.ObjectId()
      const result = await getProgramById(id)

      expect(SocialProgram.findById).toHaveBeenCalledWith(id)
      expect(result).toEqual(mockProgram)
    })

    it('should throw when program not found', async () => {
      SocialProgram.findById.mockReturnValue({
        populate: () => ({
          populate: () => Promise.resolve(null)
        })
      })

      await expect(getProgramById(new mongoose.Types.ObjectId())).rejects.toMatchObject({
        status: 404,
        message: 'Program not found'
      })
    })
  })

  describe('updateProgram', () => {
    it('should throw when program does not exist', async () => {
      SocialProgram.findById.mockResolvedValue(null)

      await expect(
        updateProgram(new mongoose.Types.ObjectId(), { programName: 'N' })
      ).rejects.toMatchObject({
        status: 404,
        message: 'Program not found'
      })
    })

    it('should update when validation passes', async () => {
      const id = new mongoose.Types.ObjectId()
      const existing = {
        targetGroup: 'Middle Income',
        beneficiariesCount: 50,
        budgetUsed: 100000,
        year: 2022
      }
      const updated = { ...existing, programName: 'Updated' }

      SocialProgram.findById.mockResolvedValue(existing)
      Region.findById.mockResolvedValue({ _id: regionId })
      SocialProgram.findByIdAndUpdate.mockResolvedValue(updated)

      const result = await updateProgram(id, {
        programName: 'Updated',
        region: regionId
      })

      expect(Region.findById).toHaveBeenCalledWith(regionId)
      expect(SocialProgram.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ programName: 'Updated', region: regionId }),
        { new: true, runValidators: true }
      )
      expect(result.programName).toBe('Updated')
    })
  })

  describe('deleteProgram', () => {
    it('should return deleted document when found', async () => {
      const doc = { _id: new mongoose.Types.ObjectId() }
      SocialProgram.findByIdAndDelete.mockResolvedValue(doc)

      const result = await deleteProgram(doc._id)

      expect(result).toEqual(doc)
    })

    it('should throw when program not found', async () => {
      SocialProgram.findByIdAndDelete.mockResolvedValue(null)

      await expect(deleteProgram(new mongoose.Types.ObjectId())).rejects.toMatchObject({
        status: 404,
        message: 'Program not found'
      })
    })
  })

  describe('getInequalityAnalysis', () => {
    it('should aggregate programs and use gini from inequality service', async () => {
      getLatestGini.mockResolvedValue({ year: '2019', giniIndex: 37.7 })
      SocialProgram.find.mockResolvedValue([
        { budgetUsed: 100, beneficiariesCount: 10 },
        { budgetUsed: 200, beneficiariesCount: 20 }
      ])

      const result = await getInequalityAnalysis('LK')

      expect(getLatestGini).toHaveBeenCalledWith('LK')
      expect(result.country).toBe('LK')
      expect(result.totalPrograms).toBe(2)
      expect(result.totalBudgetUsed).toBe(300)
      expect(result.totalBeneficiaries).toBe(30)
      expect(result.giniIndex).toBe(37.7)
      expect(result.analysis).toBeDefined()
      expect(result.sdgAlignment).toContain('SDG 10')
    })

    it('should use high-inequality limited-programs message when gini high and few programs', async () => {
      getLatestGini.mockResolvedValue({ year: '2020', giniIndex: 50 })
      SocialProgram.find.mockResolvedValue([{ budgetUsed: 1, beneficiariesCount: 1 }])

      const result = await getInequalityAnalysis('X')

      expect(result.totalPrograms).toBe(1)
      expect(result.analysis).toContain('Policy gap')
    })
  })
})