import mongoose from 'mongoose';
import Campaign from '../models/Campaign.js';
import campaignsData from '../data/seedCampaigns.js';

export const seedCampaigns = async (req, res) => {
  try {
    const existing = await Campaign.countDocuments();
    if (existing > 5) {
        await Campaign.deleteMany();
    }
    const created = await Campaign.insertMany(campaignsData);
    res.status(201).json({ message: `Successfully seeded ${created.length} campaigns`, count: created.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
