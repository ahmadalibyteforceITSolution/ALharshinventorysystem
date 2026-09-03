import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { Invoice } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const userId = req.headers['x-user-id'] || req.query.userId || 'admin_alharsh';

    const userQuery = (userId === 'admin_alharsh')
      ? { $or: [{ userId: 'admin_alharsh' }, { userId: { $exists: false } }] }
      : { userId };

    if (req.method === 'GET') {
      const invoices = await Invoice.find(userQuery).sort({ createdAt: -1 });
      return res.status(200).json(invoices);
    }

    if (req.method === 'POST') {
      const data = req.body;
      const invoicePayload = {
        ...data,
        userId
      };

      let invoice;
      if (data._id && mongoose.Types.ObjectId.isValid(data._id)) {
        invoice = await Invoice.findOneAndUpdate(
          { _id: data._id, ...userQuery },
          invoicePayload,
          { new: true }
        );
      } else {
        invoice = await Invoice.findOneAndUpdate(
          { invoiceNumber: data.invoiceNumber, ...userQuery },
          invoicePayload,
          { new: true, upsert: true }
        );
      }
      return res.status(200).json(invoice);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      if (mongoose.Types.ObjectId.isValid(id)) {
        await Invoice.findOneAndDelete({ _id: id, ...userQuery });
      } else {
        await Invoice.findOneAndDelete({ invoiceNumber: id, ...userQuery });
      }
      return res.status(200).json({ success: true, deletedId: id });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
