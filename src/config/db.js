// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : 
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse 

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo() {

  try {
    mongoClient = new MongoClient(config.mongodb.uri, { useUnifiedTopology: true });
    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log("Connexion réussie à MongoDB");
  } catch (error) {
    console.error("Erreur de connexion MongoDB:", error);
  }
}

async function connectRedis() {
  return new Promise((resolve, reject) => {
    const connectAttempt = () => {
      redisClient = redis.createClient(config.redis.uri);

      redisClient.on('connect', () => {
        console.log('Connexion réussie à Redis');
        resolve(redisClient); 
      });

      redisClient.on('error', (err) => {
        console.error('Erreur de connexion Redis:', err);
        setTimeout(connectAttempt, 5000); 
      });
    };

    connectAttempt(); 
  });
}

// Export des fonctions et clients
module.exports = {
  connectRedis,
  connectMongo
};