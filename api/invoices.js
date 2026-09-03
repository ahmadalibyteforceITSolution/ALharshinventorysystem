import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { Invoice } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const invoices = await Invoice.find({}).sort({ createdAt: -1 });
      return res.status(200).json(invoices);
    }

    if (req.method === 'POST') {
      const data = req.body;
      let invoice;
      if (data._id && mongoose.Types.ObjectId.isValid(data._id)) {
        invoice = await Invoice.findByIdAndUpdate(data._id, data, { new: true });
      } else {
        invoice = await Invoice.findOneAndUpdate(
          { invoiceNumber: data.invoiceNumber },
          data,
          { new: true, upsert: true }
        );
      }
      return res.status(200).json(invoice);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      if (mongoose.Types.ObjectId.isValid(id)) {
        await Invoice.findByIdAndDelete(id);
      } else {
        await Invoice.findOneAndDelete({ invoiceNumber: id });
      }
      return res.status(200).json({ success: true, deletedId: id });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
