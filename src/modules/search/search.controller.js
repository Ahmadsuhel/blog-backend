const searchService = require('./search.service');
const { ApiResponse } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const searchPosts = asyncHandler(async (req, res) => {
  const result = await searchService.searchPosts(req.query);
  res.json(new ApiResponse(200, 'Search results', result));
});

module.exports = { searchPosts };