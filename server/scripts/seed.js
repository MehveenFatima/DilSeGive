// Replaces all campaigns with the sample data: `npm run seed` (from server/)
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Campaign from '../models/Campaign.js';
import seedCampaigns from '../data/seedCampaigns.js';

dotenv.config();

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set. Copy .env.example to .env first.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  await Campaign.deleteMany({});
  const created = await Campaign.insertMany(seedCampaigns);
  console.log(`Seeded ${created.length} campaigns`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('Seeding failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
