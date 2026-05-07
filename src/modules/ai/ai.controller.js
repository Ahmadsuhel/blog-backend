const aiService = require('./ai.service');
const { ApiResponse, ApiError } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const improveWriting = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) throw new ApiError(400, 'content is required');
    const result = await aiService.improveWriting(content);
    res.json(new ApiResponse(200, 'Writing improved', result));
});

const fixGrammar = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) throw new ApiError(400, 'content is required');
    const result = await aiService.fixGrammar(content);
    res.json(new ApiResponse(200, 'Grammar fixed', result));
});

const summarizePost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) throw new ApiError(400, 'content is required');
    const result = await aiService.summarizePost(content);
    res.json(new ApiResponse(200, 'Post summarized', result));
});

const generateTitles = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) throw new ApiError(400, 'content is required');
    const result = await aiService.generateTitles(content);
    res.json(new ApiResponse(200, 'Titles generated', result));
});

const generateExcerpt = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) throw new ApiError(400, 'content is required');
    const result = await aiService.generateExcerpt(content);
    res.json(new ApiResponse(200, 'Excerpt generated', result));
});

const generateTags = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) throw new ApiError(400, 'content is required');
    const result = await aiService.generateTags(content);
    res.json(new ApiResponse(200, 'Tags generated', result));
});

const continueWriting = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) throw new ApiError(400, 'content is required');
    const result = await aiService.continueWriting(content);
    res.json(new ApiResponse(200, 'Content continued', result));
});

const analyzeTone = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) throw new ApiError(400, 'content is required');
    const result = await aiService.analyzeTone(content);
    res.json(new ApiResponse(200, 'Tone analyzed', result));
});

module.exports = {
    improveWriting,
    fixGrammar,
    summarizePost,
    generateTitles,
    generateExcerpt,
    generateTags,
    continueWriting,
    analyzeTone,
};