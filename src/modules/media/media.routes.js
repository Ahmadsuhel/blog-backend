const router = require('express').Router();
const controller = require('./media.controller');
const { authenticate } = require('../../middlewares/authenticate');
const upload = require('../../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Image upload endpoints
 */

/**
 * @swagger
 * /media/cover:
 *   post:
 *     summary: Upload a post cover image
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file — jpeg, png, webp, gif — max 5MB
 *     responses:
 *       200:
 *         description: Returns Cloudinary URL and image details
 *       400:
 *         description: No file or invalid file type
 */
router.post('/cover', authenticate, upload.single('image'), controller.uploadCoverImage);

/**
 * @swagger
 * /media/avatar:
 *   post:
 *     summary: Upload your profile avatar
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Square image recommended — max 5MB
 *     responses:
 *       200:
 *         description: Returns Cloudinary URL and updates your profile avatar
 *       400:
 *         description: No file or invalid file type
 */
router.post('/avatar', authenticate, upload.single('image'), controller.uploadAvatar);

/**
 * @swagger
 * /media/content:
 *   post:
 *     summary: Upload an image inside post content
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image to embed in post body — max 5MB
 *     responses:
 *       200:
 *         description: Returns Cloudinary URL to embed in post content
 *       400:
 *         description: No file or invalid file type
 */
router.post('/content', authenticate, upload.single('image'), controller.uploadContentImage);

/**
 * @swagger
 * /media/delete:
 *   delete:
 *     summary: Delete an image from Cloudinary
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [publicId]
 *             properties:
 *               publicId:
 *                 type: string
 *                 example: blog/covers/abc123xyz
 *     responses:
 *       200:
 *         description: Image deleted from Cloudinary
 *       400:
 *         description: publicId missing or image not found
 */
router.delete('/delete', authenticate, controller.deleteImage);

module.exports = router;