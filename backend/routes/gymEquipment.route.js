import { Router } from 'express';
import {
  listPublicEquipment, getPublicEquipmentBySlug,
  listAdminEquipment, createAdminEquipment, updateAdminEquipment, deleteAdminEquipment,
} from '../controllers/gymEquipment.controller.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();
router.get('/public', listPublicEquipment);
router.get('/public/:slug', getPublicEquipmentBySlug);
router.get('/', adminMiddleware, listAdminEquipment);
router.post('/', adminMiddleware, upload.array('images', 5), createAdminEquipment);
router.put('/:id', adminMiddleware, upload.array('images', 5), updateAdminEquipment);
router.delete('/:id', adminMiddleware, deleteAdminEquipment);
export default router;
