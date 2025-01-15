const db = require("../config/db");


async function cacheData(key, data, ttl) {
    try {
        const redisClient = db.getrediseClient();
        const value = JSON.stringify(data);
        const result = await redisClient.set(key, value, "EX", ttl);
        return result; // Retourne "OK" si l'opération réussit
    } catch (error) {
        console.error("Erreur lors de la mise en cache :", error);
        throw error;
    }
}


async function getCachedData(key) {
    try {
        const redisClient = db.getrediseClient();
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Erreur lors de la récupération du cache :", error);
        throw error;
    }
}


async function deleteCachedData(key) {
    try {
        const redisClient = db.getrediseClient();
        const result = await redisClient.del(key);
        return result; // Retourne 1 si supprimée, 0 sinon
    } catch (error) {
        console.error("Erreur lors de la suppression du cache :", error);
        throw error;
    }
}


async function isKeyCached(key) {
    try {
        const redisClient = db.getrediseClient();
        const result = await redisClient.exists(key);
        return result === 1; // Retourne true si la clé existe, sinon false
    } catch (error) {
        console.error("Erreur lors de la vérification du cache :", error);
        throw error;
    }
}

// Exportation des services Redis
module.exports = {
    cacheData,
    getCachedData,
    deleteCachedData,
    isKeyCached
};
