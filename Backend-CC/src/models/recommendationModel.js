import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.config.js';

const Recommendation = sequelize.define('recommendation', {
    recommendation_id: { 
        type: DataTypes.UUID, 
        defaultValue: uuidv4, 
        primaryKey: true 
    },
    disease_id: { 
        type: DataTypes.UUID, 
        allowNull: false 
    },
    recommendation_text: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

export default Recommendation;
