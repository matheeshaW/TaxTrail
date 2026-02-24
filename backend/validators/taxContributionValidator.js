const { body } = require('express-validator')

exports.createTaxValidator = [
  body('payerType')
    .isIn(['Individual', 'Corporate'])
    .withMessage('Invalid payer type'),

  body('incomeBracket')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid income bracket'),

  body('taxType')
    .isIn(['Income', 'VAT', 'Corporate'])
    .withMessage('Invalid tax type'),

  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be positive'),

  body('year')
    .isInt({ min: 2000 })
    .withMessage('Invalid year'),

  body('region')
    .notEmpty()
    .withMessage('Region is required')
]