import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import logger from './middleware/logger.js';

import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import detectionRoutes from './routes/detectionRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

import { loadModel } from './utils/loadModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

app.use(async (req, res, next) => {
    if (!app.locals.model) {
        try {
            app.locals.model = await loadModel();
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to load the model.',
                error: error.message,
            });
        }
    }
    next();
});

app.use('/users', userRoutes);
app.use('/profiles', profileRoutes);
app.use('/', detectionRoutes);
app.use('/', historyRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

export default app;
