// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');
// Récupérer un cours par ID
async function getCourseById(req, res) {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID invalide.' });
        }

        // Vérifier le cache Redis
        const cachedCourse = await redisService.getCachedData(`course:${id}`);
        if (cachedCourse) {
            return res.status(200).json({ course: cachedCourse });
        }

        // Si non en cache, récupérer depuis MongoDB
        const course = await mongoService.findOneById('courses', id);

        if (!course) {
            return res.status(404).json({ message: 'Cours non trouvé.' });
        }

        // Mettre en cache pour des accès futurs
        await redisService.cacheData(`course:${id}`, course, 3600); // 1 heure

        return res.status(200).json({ course });
    } catch (error) {
        console.error('Erreur lors de la récupération du cours :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
}

// Mettre à jour un cours
async function updateCourse(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Vérifier si l'ID est valide
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID invalide.' });
        }

        // Mettre à jour le cours dans MongoDB
        const result = await mongoService.updateOneById('courses', id, { $set: updates });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Cours non trouvé.' });
        }

        // Mettre à jour le cache Redis
        const updatedCourse = await mongoService.findOneById('courses', id);
        await redisService.cacheData(`course:${id}`, updatedCourse, 3600); // 1 heure

        return res.status(200).json({ message: 'Cours mis à jour avec succès.', course: updatedCourse });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du cours :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
}

// Supprimer un cours
async function deleteCourse(req, res) {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID invalide.' });
        }

        // Supprimer le cours de MongoDB
        const result = await mongoService.deleteOneById('courses', id);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Cours non trouvé.' });
        }

        // Supprimer du cache Redis
        await redisService.deleteCachedData(`course:${id}`);

        return res.status(200).json({ message: 'Cours supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du cours :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
}

async function getAllCourses(req, res) {
    try {
        const cacheKey = 'courses'; // Clé de cache pour les cours

        // Vérifier si les cours sont déjà en cache (Redis)
        const cachedCourses = await redisService.getCachedData(cacheKey);
        if (cachedCourses) {
            console.log('Données récupérées depuis le cache');
            return res.status(200).json({ courses: cachedCourses });
        }

        // Si les cours ne sont pas en cache, récupérer depuis MongoDB
        const courses = await mongoService.findAll('courses');

        // Mettre en cache les cours dans Redis avec une durée de vie (TTL) de 1 heure
        await redisService.cacheData(cacheKey, courses, 3600); // TTL = 3600 secondes (1 heure)

        console.log('Données récupérées depuis MongoDB');
        return res.status(200).json({ courses });
    } catch (error) {
        console.error('Erreur lors de la récupération des cours :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
}
async function createCourse(req, res) {
    try {
        const { title, description, instructor, duration } = req.body;

        // Valider les données
        if (!title || !description || !instructor || !duration) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // Créer le document
        const course = { title, description, instructor, duration, createdAt: new Date() };

        // Insérer dans MongoDB
        const result = await mongoService.insertOne('courses', course);

        // Mettre en cache le cours nouvellement créé
        await redisService.cacheData(`course:${result.insertedId}`, course, 3600); // 1 heure

        return res.status(201).json({ message: 'Cours créé avec succès.', courseId: result.insertedId });
    } catch (error) {
        console.error('Erreur lors de la création du cours :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
}


// Exporter les contrôleurs
module.exports = {
    createCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    getAllCourses,
};
