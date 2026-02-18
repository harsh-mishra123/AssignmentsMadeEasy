// utils/seedAdmin.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      // Create default admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Super Admin',
        email: 'admin@classroom.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Default admin created:');
      console.log('   Email: admin@classroom.com');
      console.log('   Password: admin123');
      
      // Create a test student
      const studentPassword = await bcrypt.hash('student123', salt);
      await User.create({
        name: 'Test Student',
        email: 'student@classroom.com',
        password: studentPassword,
        role: 'student'
      });
      
      console.log('✅ Test student created:');
      console.log('   Email: student@classroom.com');
      console.log('   Password: student123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};

module.exports = seedAdmin;