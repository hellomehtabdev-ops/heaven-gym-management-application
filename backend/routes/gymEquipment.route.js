import { Router } from 'express';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import {
  listPublicEquipment, getPublicEquipmentBySlug, listAdminEquipment,
  createEquipment, updateEquipment, deleteEquipment,
} from '../controllers/gymEquipment.controller.js';

const router = Router();
router.get('/public', listPublicEquipment);
router.get('/public/:slug', getPublicEquipmentBySlug);
router.get('/admin', adminMiddleware, listAdminEquipment);
router.post('/admin', adminMiddleware, upload.array('images', 5), createEquipment);
router.put('/admin/:id', adminMiddleware, upload.array('images', 5), updateEquipment);
router.delete('/admin/:id', adminMiddleware, deleteEquipment);
export default router;
