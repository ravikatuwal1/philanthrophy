import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/Post.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedPosts = async () => {
  try {
    const admin = await User.findOne({ isAdmin: true });

    if (!admin) {
      console.log('Admin user not found. Run seedAdmin.js first.');
      process.exit();
    }

    const posts = [
      {
        title: 'Sri Sri Thakur Philosophy – Part 1',
        content: '<p>Content of the first blog post...</p>',
        author: admin._id,
        likes: [],
        approved: true
      },
      {
        title: 'Sri Sri Thakur Philosophy – Part 2',
        content: '<p>Content of the second blog post...</p>',
        author: admin._id,
        likes: [],
        approved: true
      },
      {
        title: 'Sri Sri Thakur Philosophy – Part 3',
        content: '<p>Content of the third blog post...</p>',
        author: admin._id,
        likes: [],
        approved: true
      }
    ];

    await Post.insertMany(posts);
    console.log('Sample posts seeded');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPosts().then(() => mongoose.disconnect())
  .catch(err => console.error(err));;
