import { Router } from 'express';
import { createOfflineSale, getOfflineSale, listOfflineSales } from '../controllers/offlineSale.controller.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = Router();
router.use(adminMiddleware);
router.get('/', listOfflineSales);
router.get('/:id', getOfflineSale);
router.post('/', createOfflineSale);
export default router;
