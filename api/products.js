import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { Product } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const userId = req.headers['x-user-id'] || req.query.userId || 'admin_alharsh';

    // Query filter: admin_alharsh sees legacy products + their own; other users see ONLY their own
    const userQuery = (userId === 'admin_alharsh')
      ? { $or: [{ userId: 'admin_alharsh' }, { userId: { $exists: false } }] }
      : { userId };

    if (req.method === 'GET') {
      const products = await Product.find(userQuery).sort({ commonCode: 1 });
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      let { commonCode, name, categoryId, categoryName, description, unit, stockQty, prices, _id } = req.body;
      
      if ((!categoryName || categoryName === 'General') && categoryId) {
        try {
          const { Category } = await import('./models.js');
          const cat = mongoose.Types.ObjectId.isValid(categoryId) 
            ? await Category.findById(categoryId)
            : await Category.findOne({ name: categoryId });
          if (cat) categoryName = cat.name;
        } catch (_) {}
      }

      const productPayload = {
        userId,
        commonCode,
        name,
        categoryId,
        categoryName,
        description,
        unit,
        stockQty,
        prices
      };

      let product;
      if (_id && mongoose.Types.ObjectId.isValid(_id)) {
        product = await Product.findOneAndUpdate(
          { _id, ...userQuery },
          productPayload,
          { new: true, upsert: true }
        );
      } else {
        product = await Product.findOneAndUpdate(
          { commonCode, ...userQuery },
          productPayload,
          { new: true, upsert: true }
        );
      }
      return res.status(200).json(product);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Missing product ID or commonCode' });
      }

      if (mongoose.Types.ObjectId.isValid(id)) {
        await Product.findOneAndDelete({ _id: id, ...userQuery });
      } else {
        await Product.findOneAndDelete({ commonCode: id, ...userQuery });
      }
      return res.status(200).json({ success: true, deletedId: id });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
