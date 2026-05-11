import { Router } from 'express';
import authRoutes    from './auth.js';
import creatorRoutes from './creators.js';
import hiringRoutes  from './hiring.js';
import messageRoutes from './messages.js';
import uploadRoutes  from './upload.js';
import projectRoutes from './projects.js';
import opportunityRoutes from './opportunities.js';
import paymentRoutes from './payments.js';

const router = Router();

router.use('/auth',     authRoutes);
router.use('/creators', creatorRoutes);
router.use('/hiring',   hiringRoutes);
router.use('/messages', messageRoutes);
router.use('/upload',   uploadRoutes);
router.use('/projects',      projectRoutes);
router.use('/opportunities',  opportunityRoutes);
router.use('/payments',       paymentRoutes);

export default router;
