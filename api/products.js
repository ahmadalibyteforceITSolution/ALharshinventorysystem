import { connectToDatabase } from './db.js';
import { Product } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const products = await Product.find({}).sort({ commonCode: 1 });
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const { commonCode, name, categoryId, categoryName, description, unit, stockQty, prices, _id } = req.body;
      
      let product;
      if (_id) {
        product = await Product.findByIdAndUpdate(
          _id,
          { commonCode, name, categoryId, categoryName, description, unit, stockQty, prices },
          { new: true, upsert: true }
        );
      } else {
        product = await Product.findOneAndUpdate(
          { commonCode },
          { commonCode, name, categoryId, categoryName, description, unit, stockQty, prices },
          { new: true, upsert: true }
        );
      }
      return res.status(200).json(product);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Product.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
