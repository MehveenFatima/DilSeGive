import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  stripeSessionId: { type: String, required: true, unique: true },
}, { timestamps: true });

donationSchema.index({ donorId: 1, createdAt: -1 });

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
