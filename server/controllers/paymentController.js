import Stripe from 'stripe';
import mongoose from 'mongoose';
import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';

// Create the Stripe client on first use so the server can start
// (and serve non-payment routes) before STRIPE_SECRET_KEY is configured
let stripeClient;
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error('Payments are not configured: STRIPE_SECRET_KEY is missing');
    error.status = 503;
    throw error;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { campaignId } = req.body;
    const amount = Number(req.body.amount);
    const donorId = req.user.id;

    if (!Number.isFinite(amount) || amount < 1) {
      return res.status(400).json({ message: 'Donation amount must be at least ₹1' });
    }

    if (!mongoose.isValidObjectId(campaignId)) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: campaign.title,
              description: `Donation for ${campaign.ngo}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses paise for INR
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/campaigns/${campaignId}`,
      metadata: {
        donorId,
        campaignId,
        amount: amount.toString(),
      },
    });

    // Create pending donation record
    await Donation.create({
      donorId,
      campaignId,
      amount,
      stripeSessionId: session.id,
      paymentStatus: 'pending',
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required' });
    }
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Atomically flip pending -> success so repeated or concurrent
      // verify calls can never count the same donation twice
      const donation = await Donation.findOneAndUpdate(
        { stripeSessionId: sessionId, paymentStatus: { $ne: 'success' } },
        { paymentStatus: 'success' },
        { new: true }
      );
      if (!donation) {
        return res.status(200).json({ message: 'Donation already processed or not found' });
      }

      // Update campaign raised amount atomically to avoid lost updates
      await Campaign.updateOne(
        { _id: donation.campaignId },
        { $inc: { raised: donation.amount } }
      );

      res.status(200).json({ 
        message: 'Payment verified and donation processed successfully',
        donation 
      });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
