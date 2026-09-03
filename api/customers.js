import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { Customer } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const customers = await Customer.find({}).sort({ name: 1 });
      return res.status(200).json(customers);
    }

    if (req.method === 'POST') {
      const data = req.body;
      let customer;
      if (data._id && mongoose.Types.ObjectId.isValid(data._id)) {
        customer = await Customer.findByIdAndUpdate(data._id, data, { new: true });
      } else {
        customer = await Customer.findOneAndUpdate(
          { name: data.name },
          data,
          { new: true, upsert: true }
        );
      }
      return res.status(200).json(customer);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      if (mongoose.Types.ObjectId.isValid(id)) {
        await Customer.findByIdAndDelete(id);
      } else {
        await Customer.findOneAndDelete({ $or: [{ name: id }, { phone: id }] });
      }
      return res.status(200).json({ success: true, deletedId: id });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
