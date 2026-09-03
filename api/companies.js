import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { Company, User } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const userId = req.headers['x-user-id'] || req.query.userId || 'admin_alharsh';

    const userQuery = (userId === 'admin_alharsh')
      ? { $or: [{ userId: 'admin_alharsh' }, { userId: { $exists: false } }] }
      : { userId };

    if (req.method === 'GET') {
      const companies = await Company.find(userQuery).sort({ isDefault: -1, name: 1 });
      return res.status(200).json(companies);
    }

    if (req.method === 'POST') {
      const data = req.body;
      const isNew = !data._id;

      // Check Brand Limit based on user's subscription
      if (isNew) {
        let brandLimit = 1; // default Starter
        if (userId === 'admin_alharsh') {
          brandLimit = 999;
        } else if (mongoose.Types.ObjectId.isValid(userId)) {
          const user = await User.findById(userId);
          brandLimit = user?.subscription?.brandLimit || 1;
        }

        const existingBrandCount = await Company.countDocuments(userQuery);
        if (existingBrandCount >= brandLimit) {
          return res.status(403).json({
            error: `Brand limit reached! Your current plan allows up to ${brandLimit} brand(s). Please upgrade your subscription to add more brands.`,
            brandLimit,
            currentCount: existingBrandCount
          });
        }
      }

      const companyPayload = {
        ...data,
        userId
      };

      let company;
      if (data._id && mongoose.Types.ObjectId.isValid(data._id)) {
        company = await Company.findOneAndUpdate(
          { _id: data._id, ...userQuery },
          companyPayload,
          { new: true }
        );
      } else {
        company = await Company.create(companyPayload);
      }
      return res.status(200).json(company);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      if (mongoose.Types.ObjectId.isValid(id)) {
        await Company.findOneAndDelete({ _id: id, ...userQuery });
      } else {
        await Company.findOneAndDelete({ $or: [{ name: id }, { code: id }], ...userQuery });
      }
      return res.status(200).json({ success: true, deletedId: id });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
