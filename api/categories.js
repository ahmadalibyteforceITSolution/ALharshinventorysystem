import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { Category } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const userId = req.headers['x-user-id'] || req.query.userId || 'admin_alharsh';

    const userQuery = (userId === 'admin_alharsh')
      ? { $or: [{ userId: 'admin_alharsh' }, { userId: { $exists: false } }] }
      : { userId };

    if (req.method === 'GET') {
      const categories = await Category.find(userQuery).sort({ name: 1 });
      return res.status(200).json(categories);
    }

    if (req.method === 'POST') {
      const data = req.body;
      const categoryPayload = {
        ...data,
        userId
      };

      let cat;
      if (data._id && mongoose.Types.ObjectId.isValid(data._id)) {
        cat = await Category.findOneAndUpdate(
          { _id: data._id, ...userQuery },
          categoryPayload,
          { new: true }
        );
      } else {
        cat = await Category.findOneAndUpdate(
          { name: data.name, ...userQuery },
          categoryPayload,
          { new: true, upsert: true }
        );
      }
      return res.status(200).json(cat);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      if (mongoose.Types.ObjectId.isValid(id)) {
        await Category.findOneAndDelete({ _id: id, ...userQuery });
      } else {
        await Category.findOneAndDelete({ name: id, ...userQuery });
      }
      return res.status(200).json({ success: true, deletedId: id });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
