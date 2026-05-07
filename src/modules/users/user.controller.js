const userService = require('./user.service');
const { ApiResponse, ApiError } = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { validationResult } = require('express-validator');

const getUserProfile = asyncHandler(async (req, res) => {
    const profile = await userService.getUserProfile(req.params.id);
    res.json(new ApiResponse(200, 'Profile fetched successfully', profile));
});

const updateProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(422, 'Validation failed', errors.array());
    }
    const user = await userService.updateProfile(req.user.id, req.body);
    res.json(new ApiResponse(200, 'Profile updated successfully', user));
});

const changePassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(422, 'Validation failed', errors.array());
    }
    await userService.changePassword(req.user.id, req.body);
    res.json(new ApiResponse(200, 'Password changed successfully'));
});

const followUser = asyncHandler(async (req, res) => {
    const result = await userService.followUser(req.user.id, req.params.id);
    res.json(new ApiResponse(200, 'User followed successfully', result));
});

const unfollowUser = asyncHandler(async (req, res) => {
    const result = await userService.unfollowUser(req.user.id, req.params.id);
    res.json(new ApiResponse(200, 'User unfollowed successfully', result));
});

const getFollowers = asyncHandler(async (req, res) => {
    const result = await userService.getFollowers(req.params.id, req.query);
    res.json(new ApiResponse(200, 'Followers fetched successfully', result));
});

const getFollowing = asyncHandler(async (req, res) => {
    const result = await userService.getFollowing(req.params.id, req.query);
    res.json(new ApiResponse(200, 'Following fetched successfully', result));
});

const getUserPosts = asyncHandler(async (req, res) => {
    const result = await userService.getUserPosts(req.params.id, req.query);
    res.json(new ApiResponse(200, 'User posts fetched successfully', result));
});

module.exports = {
    getUserProfile,
    updateProfile,
    changePassword,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getUserPosts,
};