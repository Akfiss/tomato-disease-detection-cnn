import { Image, ImageDiagnosis, Disease, Recommendation, DiseaseArticle } from '../models/associations.js';
import { v4 as uuidv4 } from 'uuid';
import { bucket } from '../config/storage.config.js';
import { imageToTensor, validateImage } from '../utils/imageHelpers.js';
import { parseRecommendations } from '../utils/parser.js';

const class_names = [
    'Bacterial spot', 'Early blight', 'Late blight', 'Leaf mold',
    'Septoria leaf spot', 'Spider mites two-spotted spider mite',
    'Target spot', 'Yellow leaf curl virus', 'Mosaic virus', 'Healthy'
];

export const detectDisease = async (req, res) => {
    const { userId } = req.user;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "No image file provided." });
    }

    const validation = await validateImage(file.buffer);
    if (!validation.isValid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const newFileName = `images/${uuidv4()}-${file.originalname}`;
        const blob = bucket.file(newFileName);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err) => {
            console.error('Upload error:', err);
            return res.status(500).json({ message: 'Failed to upload image' });
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            const model = req.app.locals.model; 
            const imageTensor = imageToTensor(validation.data, validation.width, validation.height);
            const predictions = model.predict(imageTensor);
            const predictionScores = predictions.dataSync();
            const predictedClassIndex = predictions.argMax(1).dataSync()[0];
            const predictedClassName = class_names[predictedClassIndex];
            const predictedClassScore = (predictionScores[predictedClassIndex] * 100).toFixed(2);

            const actionRequired = predictedClassName !== 'Healthy';

            const disease = await Disease.findOne({ where: { disease_name: predictedClassName } });
            if (!disease) {
                return res.status(404).json({ message: 'Disease not found in database' });
            }

            const image = await Image.create({
                image_id: uuidv4(),
                user_id: userId,
                disease_id: disease.disease_id, 
                image_url: publicUrl,
                upload_date: new Date()
            });

            await ImageDiagnosis.create({
                diagnosis_id: uuidv4(),
                image_id: image.image_id,
                disease_id: disease.disease_id,
                confidence_level: predictedClassScore,
            });

            const recommendations = actionRequired ? await Recommendation.findAll({
                where: { disease_id: disease.disease_id },
                attributes: ['recommendation_text']
            }) : [];

            const parsedRecommendations = recommendations
                .map(r => parseRecommendations(r.recommendation_text))
                .flat();

            const articles = actionRequired ? await DiseaseArticle.findAll({
                where: { disease_id: disease.disease_id },
                attributes: ['article_content', 'article_url', 'thumbnail']
            }) : [];

            res.status(200).json({
                message: 'Detection process completed',
                data: {
                    condition: predictedClassName,
                    confidence: predictedClassScore,
                    description: disease.description,
                    actionRequired: actionRequired,
                    recommendations: parsedRecommendations,
                    articles: articles.map(a => ({
                        content: a.article_content,
                        url: a.article_url,
                        thumbnail: a.thumbnail
                    }))
                }
            });            
        });

        blobStream.end(file.buffer);
    } catch (error) {
        console.error('Detection error:', error);
        res.status(500).json({ message: 'There was an error detecting the disease' });
    }
};
