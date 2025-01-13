const { ObjectId } = require('mongodb');
const db = require("../config/db");


async function findOneById(collectionName, id) {
    try {
        const dbClient = db.getdb();
        const collection = dbClient.collection(collectionName);
        const result = await collection.findOne({ _id: new ObjectId(id) });
        return result;
    } catch (error) {
        console.error("Erreur lors de la recherche par ID :", error);
        throw error;
    }
}


async function insertOne(collectionName, document) {
    try {
        const dbClient = db.getdb();
        const collection = dbClient.collection(collectionName);
        const result = await collection.insertOne(document);
        return result;
    } catch (error) {
        console.error("Erreur lors de l'insertion :", error);
        throw error;
    }
}


 // Fonction pour mettre à jour un document par ID dans une collection MongoDB.

async function updateOneById(collectionName, id, update) {
    try {
        const dbClient = db.getdb();
        const collection = dbClient.collection(collectionName);
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            update
        );
        return result;
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        throw error;
    }
}


async function deleteOneById(collectionName, id) {
    try {
        const dbClient = db.getdb();
        const collection = dbClient.collection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result;
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        throw error;
    }
}

// Exportation des services pour les rendre disponibles dans d'autres fichiers
module.exports = {
    findOneById,
    insertOne,
    updateOneById,
    deleteOneById
};
