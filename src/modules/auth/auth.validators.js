const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),

  body('role')
    .optional()
    .isIn(['reader', 'writer']).withMessage('Role must be reader or writer'),
];

const loginValidator = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidator, loginValidator };