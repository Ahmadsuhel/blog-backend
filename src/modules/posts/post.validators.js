const { body } = require('express-validator');

const createPostValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 300 }).withMessage('Title must be 5-300 characters'),

  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),

  body('excerpt')
    .optional()
    .isLength({ max: 500 }).withMessage('Excerpt must be under 500 characters'),

  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),

  body('coverImage')
    .optional()
    .isURL().withMessage('Cover image must be a valid URL'),
];

const updatePostValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 300 }).withMessage('Title must be 5-300 characters'),

  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),

  body('excerpt')
    .optional()
    .isLength({ max: 500 }).withMessage('Excerpt must be under 500 characters'),

  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),

  body('coverImage')
    .optional()
    .isURL().withMessage('Cover image must be a valid URL'),
];

module.exports = { createPostValidator, updatePostValidator };