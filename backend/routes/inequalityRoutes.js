const express = require('express')
const router = express.Router()

const { fetchInequality } = require('../controllers/inequalityController')

router.get('/gini/:country', fetchInequality)

module.exports = router