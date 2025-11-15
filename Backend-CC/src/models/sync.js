import db from '../config/db.config.js';
// import { User, PasswordReset, Profile, Disease, DiseaseArticle, Image, ImageDiagnosis, Recommendation } from './associations.js';

const syncDatabase = async () => {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');

        await db.sync({ force: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await db.close();
    }
};

syncDatabase();
