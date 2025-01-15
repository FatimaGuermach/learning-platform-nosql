// Question: Comment organiser le point d'entrée de l'application ?
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
const express = require('express');
const config = require('./config/env');
const db = require('./config/db');
const courseRoutes = require('./routes/courseRoutes');
// const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Middleware configuration
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Mounting routes
app.use('/api/courses', courseRoutes);
// app.use('/api/students', studentRoutes);

async function startServer() {
  try {
    // Initialize database connections (MongoDB and Redis)
    await db.connectMongo();
    await db.connectRedis();

    console.log('Database connections initialized successfully.');

    // Start the server
    const port = config.port || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Clean shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Closing connections...');
  try {
    if (db.mongoClient) {
      await db.mongoClient.close();
      console.log('MongoDB connection closed.');
    }
    if (db.redisClient) {
      await db.redisClient.disconnect();
      console.log('Redis connection closed.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();
