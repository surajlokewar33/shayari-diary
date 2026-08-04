import mongoose from 'mongoose';
import 'dotenv/config';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  try {
    await db.collection('poems').dropIndex('title_text_body_text_tags_text');
    console.log('Old text index dropped successfully.');
  } catch (err) {
    console.log('Index may not exist or already dropped:', err.message);
  }
  await mongoose.disconnect();
}

main();