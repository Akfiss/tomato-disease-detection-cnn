import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.config.js';

const Profile = sequelize.define('profile', {
    profile_id: { 
        type: DataTypes.UUID, 
        defaultValue: uuidv4, 
        primaryKey: true 
    },
    user_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    created_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    updated_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    profile_picture_url: { 
        type: DataTypes.STRING 
    }
}, {
    timestamps: true,
    underscored: true,
    freezeTableName: true
});

export default Profile;
