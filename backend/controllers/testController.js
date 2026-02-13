const Test = require('../models/testModel')
const mongoose = require('mongoose')

// get all test

const getTests = async (req, res) => {
    const tests = await Test.find({}).sort({createdAt: -1})
    res.status(200).json(tests) 
}

// get a single test

const getTest = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such test'})
    }

    const test = await Test.findById(id)

    if(!test){
        return res.status(404).json({error: 'No such test'})
    }
    res.status(200).json(test)
}

// create a new test

const createTest = async (req, res) => {
    const {title, content} = req.body

    //add doc to db
    try{
        const test = await Test.create({title, content})
        res.status(200).json(test)
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
}

// delete a test

const deleteTest = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such test'})
    }

    const test = await Test.findOneAndDelete({_id: id})
    if(!test){
        return res.status(404).json({error: 'No such test'})
    }
    res.status(200).json(test)
}

// update a test

const updateTest = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such test'})
    }

    const test = await Test.findOneAndUpdate({_id: id}, {
        ...req.body
    })
    
    if(!test){
        return res.status(404).json({error: 'No such test'})
    }
    res.status(200).json(test)
}

module.exports = { 
    getTests,
    getTest,
    createTest,
    deleteTest,
    updateTest
 }
