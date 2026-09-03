import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { Company } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const companies = await Company.find({}).sort({ isDefault: -1, name: 1 });
      return res.status(200).json(companies);
    }

    if (req.method === 'POST') {
      const data = req.body;
      let company;
      if (data._id && mongoose.Types.ObjectId.isValid(data._id)) {
        company = await Company.findByIdAndUpdate(data._id, data, { new: true });
      } else {
        company = await Company.findOneAndUpdate(
          { name: data.name },
          data,
          { new: true, upsert: true }
        );
      }
      return res.status(200).json(company);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      if (mongoose.Types.ObjectId.isValid(id)) {
        await Company.findByIdAndDelete(id);
      } else {
        await Company.findOneAndDelete({ $or: [{ name: id }, { code: id }] });
      }
      return res.status(200).json({ success: true, deletedId: id });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
