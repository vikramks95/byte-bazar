const User = require('../models/User');

const seedUsers = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@bazaar.com' });
    if (!adminExists) {
      await User.create({
        name: 'Demo Admin',
        email: 'admin@bazaar.com',
        password: 'admin123',
        role: 'admin',
        phone: '+91 9999999999'
      });
      console.log('Seeded: Admin account (admin@bazaar.com / admin123)');
    }

    // Check if seller already exists
    const sellerExists = await User.findOne({ email: 'seller@bazaar.com' });
    if (!sellerExists) {
      await User.create({
        name: 'Demo Seller',
        email: 'seller@bazaar.com',
        password: 'seller123',
        role: 'seller',
        phone: '+91 8888888888'
      });
      console.log('Seeded: Seller account (seller@bazaar.com / seller123)');
    }

    // Check if buyer already exists
    const buyerExists = await User.findOne({ email: 'buyer@bazaar.com' });
    if (!buyerExists) {
      await User.create({
        name: 'Demo Buyer',
        email: 'buyer@bazaar.com',
        password: 'buyer123',
        role: 'buyer',
        phone: '+91 7777777777'
      });
      console.log('Seeded: Buyer account (buyer@bazaar.com / buyer123)');
    }
  } catch (error) {
    console.error('Error seeding users:', error.message);
  }
};

module.exports = seedUsers;
