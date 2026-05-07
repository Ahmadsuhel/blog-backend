const Like = require('./like.model');
const Bookmark = require('./bookmark.model');
const Post = require('../posts/post.model');
const User = require('../users/user.model');
const { ApiError } = require('../../utils/ApiResponse');
const { getPagination, getPaginationMeta } = require('../../utils/pagination');
const { createNotification } = require('../notifications/notification.service');


// Like a post
const likePost = async (userId, postId) => {
    const post = await Post.findOne({
        where: { id: postId, status: 'published' },
    });
    if (!post) throw new ApiError(404, 'Post not found');

    const existing = await Like.findOne({ where: { userId, postId } });
    if (existing) throw new ApiError(409, 'You have already liked this post');

    await Like.create({ userId, postId });

    // Increment likesCount on post
    await post.increment('likesCount');
    await createNotification({
        receiverId: post.authorId,
        senderId: userId,
        type: 'like',
        message: 'liked your post',
        link: `/posts/${post.slug}`,
        postId: post.id,
    });
    await post.reload();

    return { likesCount: post.likesCount };
};

// Unlike a post
const unlikePost = async (userId, postId) => {
    const post = await Post.findOne({
        where: { id: postId, status: 'published' },
    });
    if (!post) throw new ApiError(404, 'Post not found');

    const like = await Like.findOne({ where: { userId, postId } });
    if (!like) throw new ApiError(404, 'You have not liked this post');

    await like.destroy();

    // Decrement likesCount on post
    await post.decrement('likesCount');
    await post.reload();

    return { likesCount: post.likesCount };
};

// Check if user liked a post
const isLiked = async (userId, postId) => {
    const like = await Like.findOne({ where: { userId, postId } });
    return { isLiked: !!like };
};

// Get all users who liked a post
const getPostLikes = async (postId, query) => {
    const post = await Post.findByPk(postId);
    if (!post) throw new ApiError(404, 'Post not found');

    const { page, limit, offset } = getPagination(query);

    const { count, rows } = await Like.findAndCountAll({
        where: { postId },
        include: [
            {
                model: User,
                attributes: ['id', 'name', 'avatar'],
            },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return {
        likes: rows.map((l) => l.User),
        meta: getPaginationMeta(count, page, limit),
    };
};

// Bookmark a post
const bookmarkPost = async (userId, postId) => {
    const post = await Post.findOne({
        where: { id: postId, status: 'published' },
    });
    if (!post) throw new ApiError(404, 'Post not found');

    const existing = await Bookmark.findOne({ where: { userId, postId } });
    if (existing) throw new ApiError(409, 'Post already bookmarked');

    await Bookmark.create({ userId, postId });
    return { message: 'Post bookmarked successfully' };
};

// Remove bookmark
const removeBookmark = async (userId, postId) => {
    const bookmark = await Bookmark.findOne({ where: { userId, postId } });
    if (!bookmark) throw new ApiError(404, 'Bookmark not found');

    await bookmark.destroy();
    return { message: 'Bookmark removed successfully' };
};

// Get all bookmarked posts of logged in user
const getMyBookmarks = async (userId, query) => {
    const { page, limit, offset } = getPagination(query);

    const { count, rows } = await Bookmark.findAndCountAll({
        where: { userId },
        include: [
            {
                model: Post,
                where: { status: 'published' },
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'name', 'avatar'],
                    },
                ],
            },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return {
        bookmarks: rows.map((b) => b.Post),
        meta: getPaginationMeta(count, page, limit),
    };
};

// Check if user bookmarked a post
const isBookmarked = async (userId, postId) => {
    const bookmark = await Bookmark.findOne({ where: { userId, postId } });
    return { isBookmarked: !!bookmark };
};

module.exports = {
    likePost,
    unlikePost,
    isLiked,
    getPostLikes,
    bookmarkPost,
    removeBookmark,
    getMyBookmarks,
    isBookmarked,
};