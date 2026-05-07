const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('../users/user.model');

const Notification = sequelize.define(
    'Notification',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        // who receives the notification
        receiverId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        // who triggered the notification
        senderId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM(
                'like',
                'comment',
                'reply',
                'follow',
                'mention'
            ),
            allowNull: false,
        },
        // message shown to the user
        message: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        // link to navigate to when clicked
        link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        // optional reference ids
        postId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        commentId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    },
    {
        tableName: 'notifications',
        timestamps: true,
    }
);

// Associations
User.hasMany(Notification, { foreignKey: 'receiverId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

User.hasMany(Notification, { foreignKey: 'senderId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

module.exports = Notification;