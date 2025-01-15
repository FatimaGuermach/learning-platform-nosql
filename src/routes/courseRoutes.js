// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : 
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: 

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');


router.post('/', courseController.createCourse);

// Récupérer un cours par ID
router.get('/:id', courseController.getCourseById);


// Mettre à jour un cours par ID
router.put('/:id', courseController.updateCourse);

// Supprimer un cours par ID
router.delete('/:id', courseController.deleteCourse);

// Récupérer tous les cours
router.get('/', courseController.getAllCourses);

module.exports = router;