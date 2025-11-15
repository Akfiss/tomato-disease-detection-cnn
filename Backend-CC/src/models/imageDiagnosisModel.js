import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.config.js';

const ImageDiagnosis = sequelize.define('image_diagnosis', {
    diagnosis_id: { 
        type: DataTypes.UUID, 
        defaultValue: uuidv4, 
        primaryKey: true 
    },
    image_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    disease_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    confidence_level: { 
        type: DataTypes.FLOAT 
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

export default ImageDiagnosis;
