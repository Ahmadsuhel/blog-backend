const router = require('express').Router();
const controller = require('./ai.controller');
const { authenticate } = require('../../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: AI Assistant
 *   description: AI writing assistant powered by Gemini
 */

/**
 * @swagger
 * /ai/improve:
 *   post:
 *     summary: Improve writing quality
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: this is my blog post about javascript it is very good language for web development
 *     responses:
 *       200:
 *         description: Returns original and improved content
 */
router.post('/improve', authenticate, controller.improveWriting);

/**
 * @swagger
 * /ai/fix-grammar:
 *   post:
 *     summary: Fix grammar and spelling errors
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: their going to the store but they doesnt have money
 *     responses:
 *       200:
 *         description: Returns original and fixed content
 */
router.post('/fix-grammar', authenticate, controller.fixGrammar);

/**
 * @swagger
 * /ai/summarize:
 *   post:
 *     summary: Summarize a long blog post
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: Paste your long blog post content here to get a short summary...
 *     responses:
 *       200:
 *         description: Returns a 3-5 sentence summary
 */
router.post('/summarize', authenticate, controller.summarizePost);

/**
 * @swagger
 * /ai/generate-titles:
 *   post:
 *     summary: Generate 5 title suggestions from content
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: This post is about building REST APIs with Node.js and Express using PostgreSQL...
 *     responses:
 *       200:
 *         description: Returns array of 5 title suggestions
 */
router.post('/generate-titles', authenticate, controller.generateTitles);

/**
 * @swagger
 * /ai/generate-excerpt:
 *   post:
 *     summary: Generate a compelling excerpt from content
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: This post covers everything you need to know about async await in JavaScript...
 *     responses:
 *       200:
 *         description: Returns a 2-3 sentence excerpt
 */
router.post('/generate-excerpt', authenticate, controller.generateExcerpt);

/**
 * @swagger
 * /ai/generate-tags:
 *   post:
 *     summary: Generate tag suggestions from content
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: This post is about building REST APIs with Node.js and Express...
 *     responses:
 *       200:
 *         description: Returns array of 5 tag suggestions
 */
router.post('/generate-tags', authenticate, controller.generateTags);

/**
 * @swagger
 * /ai/continue:
 *   post:
 *     summary: Continue writing — generate next paragraphs
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: JavaScript is one of the most popular programming languages in the world...
 *     responses:
 *       200:
 *         description: Returns next 1-2 paragraphs to continue your post
 */
router.post('/continue', authenticate, controller.continueWriting);

/**
 * @swagger
 * /ai/analyze-tone:
 *   post:
 *     summary: Analyze tone and writing style of content
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: In this tutorial we will explore the fundamentals of Node.js...
 *     responses:
 *       200:
 *         description: Returns tone, readability level, sentiment and feedback
 */
router.post('/analyze-tone', authenticate, controller.analyzeTone);

module.exports = router;