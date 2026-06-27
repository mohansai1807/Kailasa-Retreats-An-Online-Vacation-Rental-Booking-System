const mongoose = require('mongoose');
const User = require('../models/user');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wunderlust');
  console.log('Connected to MongoDB');
  const username = 'mohanasai';
  const user = await User.findOne({ username });
  if (!user) {
    console.error(`User ${username} not found`);
    process.exit(1);
  }
  user.role = 'admin';
  await user.save();
  console.log(`User ${username} updated to admin.`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
