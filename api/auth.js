import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { User } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const action = req.query.action || 'login';

    // 1. REGISTER
    if (req.method === 'POST' && action === 'register') {
      const { name, email, password, businessName, plan = 'starter', billingCycle = 'monthly' } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }

      const brandLimit = plan === 'enterprise' ? 999 : (plan === 'pro' ? 5 : 1);
      const user = await User.create({
        name,
        email: cleanEmail,
        password, // stored securely
        businessName: businessName || `${name}'s Store`,
        role: 'user',
        subscription: {
          plan,
          billingCycle,
          brandLimit,
          status: 'active',
          startDate: new Date(),
          expiresAt: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)
        }
      });

      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).json({
        user: userObj,
        token: `tok_${user._id}_${Date.now()}`
      });
    }

    // 2. LOGIN
    if (req.method === 'POST' && action === 'login') {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const cleanEmail = email.toLowerCase().trim();

      // Master Admin Account Auto-Provisioning (Preserves existing inventory for admin_alharsh)
      if (cleanEmail === 'admin@alharsh.com') {
        let adminUser = await User.findOne({ email: cleanEmail });
        if (!adminUser) {
          adminUser = await User.create({
            _id: new mongoose.Types.ObjectId('650000000000000000000001'),
            name: 'Al-Harsh Master Admin',
            email: 'admin@alharsh.com',
            password: password || 'admin123',
            businessName: 'Al-Harsh System Inventory',
            role: 'admin',
            subscription: {
              plan: 'enterprise',
              billingCycle: 'yearly',
              brandLimit: 999,
              status: 'active',
              startDate: new Date(),
              expiresAt: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000) // 10 years
            }
          });
        }
        const adminObj = adminUser.toObject();
        delete adminObj.password;
        // admin_alharsh ID is used to link all legacy products
        adminObj.userId = 'admin_alharsh';
        return res.status(200).json({
          user: adminObj,
          token: `tok_admin_alharsh_${Date.now()}`
        });
      }

      const user = await User.findOne({ email: cleanEmail });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const userObj = user.toObject();
      delete userObj.password;
      userObj.userId = user._id.toString();
      return res.status(200).json({
        user: userObj,
        token: `tok_${user._id}_${Date.now()}`
      });
    }

    // 3. UPGRADE SUBSCRIPTION
    if (req.method === 'POST' && action === 'subscription') {
      const { userId, plan, billingCycle = 'monthly', customBrandLimit } = req.body;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });

      let brandLimit = 1;
      if (plan === 'starter') brandLimit = 1;
      else if (plan === 'pro') brandLimit = 5;
      else if (plan === 'enterprise') brandLimit = 999;
      else if (plan === 'custom') brandLimit = Math.max(1, Number(customBrandLimit) || 10);

      const days = billingCycle === 'yearly' ? 365 : 30;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          subscription: {
            plan,
            billingCycle,
            brandLimit,
            status: 'active',
            startDate: new Date(),
            expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
          }
        },
        { new: true }
      );

      if (!updatedUser) return res.status(404).json({ error: 'User not found' });
      const userObj = updatedUser.toObject();
      delete userObj.password;
      userObj.userId = updatedUser._id.toString();
      return res.status(200).json({ success: true, user: userObj });
    }

    // 4. GET CURRENT USER PROFILE
    if (req.method === 'GET' && action === 'me') {
      const userId = req.headers['x-user-id'] || req.query.userId;
      if (!userId) return res.status(400).json({ error: 'Missing userId' });

      if (userId === 'admin_alharsh') {
        return res.status(200).json({
          userId: 'admin_alharsh',
          name: 'Al-Harsh Master Admin',
          email: 'admin@alharsh.com',
          businessName: 'Al-Harsh System Inventory',
          role: 'admin',
          subscription: {
            plan: 'enterprise',
            billingCycle: 'yearly',
            brandLimit: 999,
            status: 'active'
          }
        });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const userObj = user.toObject();
      delete userObj.password;
      userObj.userId = user._id.toString();
      return res.status(200).json(userObj);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
