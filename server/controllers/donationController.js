import Donation from '../models/Donation.js';

// Returns the logged-in donor's successful donations, newest first
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.id, paymentStatus: 'success' })
      .sort({ createdAt: -1 })
      .populate('campaignId', 'title ngo image category');
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
