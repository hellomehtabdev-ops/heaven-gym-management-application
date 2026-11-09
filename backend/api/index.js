import mongoose from 'mongoose';
import app from '../app.js';
import { connectDB } from '../config/db.config.js';
import { validateJwtConfiguration } from '../utils/jwt.utils.js';

let connectionPromise;
let jwtConfigurationValidated = false;

async function ensureDatabaseConnection() {
  if (mongoose.connection.readyState === 1) return;

  if (!connectionPromise) {
    connectionPromise = connectDB().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;
}

export default async function handler(req, res) {
  // CORS preflight must be answered without waiting for a database connection.
  if (req.method === 'OPTIONS') {
    return app(req, res);
  }

  try {
    if (!jwtConfigurationValidated) {
      validateJwtConfiguration();
      jwtConfigurationValidated = true;
    }

    await ensureDatabaseConnection();
    return app(req, res);
  } catch (error) {
    console.error('API initialization failed:', error);
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      requestId: req.headers['x-request-id'] || null,
    });
  }
}
