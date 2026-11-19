import express from 'express';
import { getAllCampaigns, getCampaignById, seedCampaigns } from '../controllers/campaignController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCampaigns);
// Re-seeding replaces existing campaigns, so only admins may trigger it
router.post('/seed', authMiddleware, roleMiddleware('admin'), seedCampaigns);
router.get('/:id', getCampaignById);

export default router;
