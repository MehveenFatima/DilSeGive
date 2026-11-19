import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import Campaign from './models/Campaign.js';
import seedData from './data/seedCampaigns.js';
import { checkEnv } from './config/env.js';

dotenv.config();
checkEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/test", (req, res) => {
  res.send("Backend working");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/payment', paymentRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('DilSeGive Backend API is running...');
});


const seedCampaigns = async () => {
  try {
    const count = await Campaign.countDocuments();
    if (count === 0) {
      await Campaign.insertMany(seedData);
      console.log(`Seeded ${seedData.length} campaigns successfully`);
    } else {
      console.log("Campaigns already exist");
    }
  } catch (error) {
    console.error("Seeding error:", error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error; // Rethrow to let the IIFE catch it
  }
};

// Global Error Handlers
process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception:", err);
});

process.on('unhandledRejection', (err) => {
  console.error("Unhandled Rejection:", err);
});

// Server Start IIFE
(async () => {
  // Start listening immediately for diagnostic access
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  try {
    await connectDB();
    await seedCampaigns();
  } catch (error) {
    console.error("Database connection was unsuccessful:", error.message);
    console.log(`Portal remains active for diagnostics on port ${PORT}.`);
  }
})();
