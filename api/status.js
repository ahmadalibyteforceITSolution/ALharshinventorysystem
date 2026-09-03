import { connectToDatabase } from './db.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    res.status(200).json({
      status: 'connected',
      database: 'MongoDB Atlas',
      cluster: 'cluster0.oe0inne.mongodb.net',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
