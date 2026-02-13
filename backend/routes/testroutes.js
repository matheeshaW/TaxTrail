const express = require('express')
const { 
    createTest,
    getTests,
    getTest,
    deleteTest,
    updateTest
 } = require('../controllers/testController')


const router = express.Router()

//GET all test files
router.get('/', getTests)

//GET a single test file

router.get('/:id', getTest)

//POST a new test file
router.post('/', createTest)

//DELETE a test file
router.delete('/:id', deleteTest
)

//UPDATE a test file
router.patch('/:id', updateTest)

module.exports = router