import { Router } from 'express';
import {
  listPublicEquipment,
  getPublicEquipmentBySlug,
} from '../controllers/gymEquipment.controller.js';

const router = Router();

router.get('/public', listPublicEquipment);
router.get('/public/:slug', getPublicEquipmentBySlug);

export default router;
