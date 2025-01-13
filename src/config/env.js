const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
    'MONGODB_URI',
    'MONGODB_DB_NAME',
    'REDIS_URI',
    'PORT'
];

function validateEnv() {
    const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
    
    if (missingVars.length > 0) {
        throw new Error(
            `Les variables d'environnement suivantes sont manquantes : ${missingVars.join(', ')}`
        );
    }
    console.log("✅ Toutes les variables d'environnement requises sont définies.");
}

// Exécute la validation au démarrage
validateEnv();

module.exports = {
    mongodb: {
        uri: process.env.MONGODB_URI,
        dbName: process.env.MONGODB_DB_NAME
    },
    redis: {
        uri: process.env.REDIS_URI
    },
    port: process.env.PORT || 3000
};
