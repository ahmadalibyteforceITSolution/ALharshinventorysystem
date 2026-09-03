import { connectToDatabase } from './db.js';
import { Category } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const categories = await Category.find({}).sort({ name: 1 });
      return res.status(200).json(categories);
    }

    if (req.method === 'POST') {
      const data = req.body;
      let cat;
      if (data._id) {
        cat = await Category.findByIdAndUpdate(data._id, data, { new: true });
      } else {
        cat = await Category.create(data);
      }
      return res.status(200).json(cat);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Category.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
