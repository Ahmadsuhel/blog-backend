const { Op } = require('sequelize');
const User = require('./user.model');
const Follow = require('./follow.model');
const Post = require('../posts/post.model');
const { ApiError } = require('../../utils/ApiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');
const { createNotification } = require('../notifications/notification.service');

// Get public profile of any user by id
const getUserProfile = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: [
            'id', 'name', 'email', 'avatar',
            'bio', 'role', 'createdAt',
        ],
    });

    if (!user) throw new ApiError(404, 'User not found');

    // Count followers and following
    const followersCount = await Follow.count({
        where: { followingId: userId },
    });

    const followingCount = await Follow.count({
        where: { followerId: userId },
    });

    // Count published posts
    const postsCount = await Post.count({
        where: { authorId: userId, status: 'published' },
    });

    return {
        ...user.toJSON(),
        followersCount,
        followingCount,
        postsCount,
    };
};

// Update logged in user's own profile
const updateProfile = async (userId, data) => {
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'User not found');

    // Only allow these fields to be updated
    const allowed = ['name', 'bio', 'avatar'];
    const updates = {};
    allowed.forEach((field) => {
        if (data[field] !== undefined) updates[field] = data[field];
    });

    await user.update(updates);
    return user.toSafeObject();
};

// Change password
const changePassword = async (userId, { currentPassword, newPassword }) => {
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'User not found');

    if (!user.password) {
        throw new ApiError(400, 'Password change not available for Google accounts');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new ApiError(401, 'Current password is incorrect');

    if (currentPassword === newPassword) {
        throw new ApiError(400, 'New password must be different from current password');
    }

    user.password = newPassword;
    await user.save();
};

// Follow a user
const followUser = async (followerId, followingId) => {
    if (followerId === followingId) {
        throw new ApiError(400, 'You cannot follow yourself');
    }

    const targetUser = await User.findByPk(followingId);
    if (!targetUser) throw new ApiError(404, 'User not found');

    const existing = await Follow.findOne({
        where: { followerId, followingId },
    });

    if (existing) throw new ApiError(409, 'You are already following this user');

    await Follow.create({ followerId, followingId });
    await createNotification({
        receiverId: followingId,
        senderId: followerId,
        type: 'follow',
        message: 'started following you',
        link: `/users/${followerId}`,
    });


    const followersCount = await Follow.count({ where: { followingId } });
    return { followersCount };
};

// Unfollow a user
const unfollowUser = async (followerId, followingId) => {
    if (followerId === followingId) {
        throw new ApiError(400, 'You cannot unfollow yourself');
    }

    const follow = await Follow.findOne({ where: { followerId, followingId } });
    if (!follow) throw new ApiError(404, 'You are not following this user');

    await follow.destroy();

    const followersCount = await Follow.count({ where: { followingId } });
    return { followersCount };
};

// Get followers list of a user
const getFollowers = async (userId, query) => {
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const { page, limit, offset } = getPagination(query);

    const { count, rows } = await Follow.findAndCountAll({
        where: { followingId: userId },
        include: [
            {
                model: User,
                as: 'follower',
                attributes: ['id', 'name', 'avatar', 'bio'],
            },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return {
        followers: rows.map((f) => f.follower),
        meta: getPaginationMeta(count, page, limit),
    };
};

// Get following list of a user
const getFollowing = async (userId, query) => {
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const { page, limit, offset } = getPagination(query);

    const { count, rows } = await Follow.findAndCountAll({
        where: { followerId: userId },
        include: [
            {
                model: User,
                as: 'following',
                attributes: ['id', 'name', 'avatar', 'bio'],
            },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return {
        following: rows.map((f) => f.following),
        meta: getPaginationMeta(count, page, limit),
    };
};

// Get published posts of any user
const getUserPosts = async (userId, query) => {
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const { page, limit, offset } = getPagination(query);

    const { count, rows } = await Post.findAndCountAll({
        where: { authorId: userId, status: 'published' },
        order: [['publishedAt', 'DESC']],
        limit,
        offset,
    });

    return {
        posts: rows,
        meta: getPaginationMeta(count, page, limit),
    };
};

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