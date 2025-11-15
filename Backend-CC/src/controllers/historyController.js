import { Image, Disease, ImageDiagnosis, Recommendation, DiseaseArticle } from '../models/associations.js';
import { parseRecommendations } from '../utils/parser.js';

export const getUserDetectionHistory = async (req, res) => {
    const { userId } = req.user;
    const { limit, offset } = req.pagination;

    try {
        const { count, rows } = await Image.findAndCountAll({
            where: { user_id: userId },
            include: [
                {
                    model: Disease,
                    attributes: ['disease_name', 'description'],
                    as: 'disease_model',
                    include: [
                        {
                            model: Recommendation,
                            attributes: ['recommendation_text'],
                            as: 'recommendations'
                        },
                        {
                            model: DiseaseArticle,
                            attributes: ['article_content', 'article_url', 'thumbnail'],
                            as: 'disease_articles'
                        }
                    ]
                },
                {
                    model: ImageDiagnosis,
                    attributes: ['confidence_level'],
                    as: 'image_diagnoses'
                }
            ],
            limit,
            offset,
            order: [['upload_date', 'DESC']]
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            message: 'Detection history retrieved successfully',
            data: {
                totalItems: count,
                totalPages,
                currentPage: Math.ceil(offset / limit) + 1,
                detections: rows.map(image => {
                    const disease = image.disease_model ? {
                        name: image.disease_model.disease_name,
                        description: image.disease_model.description,
                        recommendations: image.disease_model.recommendations ? image.disease_model.recommendations.map(r => parseRecommendations(r.recommendation_text)).flat() : [],
                        articles: image.disease_model.disease_articles ? image.disease_model.disease_articles.map(a => ({
                            content: a.article_content,
                            url: a.article_url,
                            thumbnail: a.thumbnail
                        })) : []
                    } : null;

                    const confidenceLevel = image.image_diagnoses && image.image_diagnoses.length > 0 ? 
                        image.image_diagnoses[0].confidence_level : null;

                    const actionRequired = disease && disease.name !== 'Healthy';

                    return {
                        imageId: image.image_id,
                        imageUrl: image.image_url,
                        uploadDate: image.upload_date,
                        disease,
                        confidenceLevel,
                        actionRequired
                    };
                })
            }
        });
    } catch (error) {
        console.error('Error retrieving detection history:', error);
        res.status(500).json({ message: 'There was an error retrieving the detection history' });
    }
};
