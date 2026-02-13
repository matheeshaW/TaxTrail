const express = require('express')
const Test = require('../models/testModel')
const mongoose = require('mongoose')

const router = express.Router()

//GET all test files
router.get('/', (req, res) => {
    res.json({mssg: 'get all test files'})
})

//GET a single test file

router.get('/:id', (req, res) => {
    res.json({mssg: 'get a single test file'})
})

//POST a new test file
router.post('/', async (req, res) => {
    const {title, content} = req.body
    try{
        const test = await Test.create({title, content})
        res.status(200).json(test)
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
    
})

//DELETE a test file
router.delete('/:id', (req, res) => {
    res.json({mssg: 'delete a test file'})
})

//UPDATE a test file
router.patch('/:id', (req, res) => {
    res.json({mssg: 'update a test file'})
})

module.exports = router