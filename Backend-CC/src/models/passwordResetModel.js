import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.config.js';

const PasswordReset = sequelize.define('password_reset', {
    reset_id: { 
        type: DataTypes.UUID, 
        defaultValue: uuidv4, 
        primaryKey: true 
    },
    user_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    token: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    created_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    token_expires: {
        type: DataTypes.DATE
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

export default PasswordReset;
