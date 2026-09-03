import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { Customer } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const userId = req.headers['x-user-id'] || req.query.userId || 'admin_alharsh';

    const userQuery = (userId === 'admin_alharsh')
      ? { $or: [{ userId: 'admin_alharsh' }, { userId: { $exists: false } }] }
      : { userId };

    if (req.method === 'GET') {
      const customers = await Customer.find(userQuery).sort({ name: 1 });
      return res.status(200).json(customers);
    }

    if (req.method === 'POST') {
      const data = req.body;
      const customerPayload = {
        ...data,
        userId
      };

      let customer;
      if (data._id && mongoose.Types.ObjectId.isValid(data._id)) {
        customer = await Customer.findOneAndUpdate(
          { _id: data._id, ...userQuery },
          customerPayload,
          { new: true }
        );
      } else {
        customer = await Customer.create(customerPayload);
      }
      return res.status(200).json(customer);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      if (mongoose.Types.ObjectId.isValid(id)) {
        await Customer.findOneAndDelete({ _id: id, ...userQuery });
      } else {
        await Customer.findOneAndDelete({ $or: [{ name: id }, { phone: id }], ...userQuery });
      }
      return res.status(200).json({ success: true, deletedId: id });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
