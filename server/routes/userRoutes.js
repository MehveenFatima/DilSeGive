import express from 'express';
import { getProfile } from '../controllers/authController.js';
import { getMyDonations } from '../controllers/donationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.get('/donations', authMiddleware, getMyDonations);

export default router;
