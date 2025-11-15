import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.config.js';

const User = sequelize.define('user', {
    user_id: { 
        type: DataTypes.UUID, 
        defaultValue: uuidv4, 
        primaryKey: true 
    },
    email: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    google_id: { 
        type: DataTypes.STRING 
    },
    created_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    updated_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, {
    timestamps: true,
    underscored: true,
    freezeTableName: true
});

export default User;
