import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.config.js';

const Image = sequelize.define('image', {
    image_id: { 
        type: DataTypes.UUID, 
        defaultValue: uuidv4, 
        primaryKey: true 
    },
    user_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    disease_id: { 
        type: DataTypes.UUID 
    },
    image_url: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    upload_date: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

export default Image;
