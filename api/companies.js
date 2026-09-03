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
      if (data._id) {
        company = await Company.findByIdAndUpdate(data._id, data, { new: true });
      } else {
        company = await Company.create(data);
      }
      return res.status(200).json(company);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Company.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
