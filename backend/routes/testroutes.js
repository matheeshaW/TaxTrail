const express = require('express')

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
router.post('/', (req, res) => {
    res.json({mssg: 'create a new test file'})
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