const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./user.model');

const Follow = sequelize.define(
    'Follow',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        followerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        followingId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
    },
    {
        tableName: 'follows',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['followerId', 'followingId'],
            },
        ],
    }
);

// A user has many followers
User.belongsToMany(User, {
    through: Follow,
    foreignKey: 'followingId',
    otherKey: 'followerId',
    as: 'followers',
});

// A user follows many users
User.belongsToMany(User, {
    through: Follow,
    foreignKey: 'followerId',
    otherKey: 'followingId',
    as: 'following',
});
Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'following' });

module.exports = Follow;