import { Router } from 'express';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import {
  listPublicTransformations,
  getPublicTransformationById,
  listAdminTransformations,
  getAdminTransformationById,
  createTransformation,
  updateTransformation,
  togglePublishTransformation,
  deleteTransformation,
} from '../controllers/transformation.controller.js';

const router = Router();

const transformationImagesUpload = upload.fields([
  { name: 'before_image', maxCount: 1 },
  { name: 'after_image', maxCount: 1 },
]);

router.get('/public', listPublicTransformations);
router.get('/public/:id', getPublicTransformationById);
router.get('/admin', adminMiddleware, listAdminTransformations);
router.get('/admin/:id', adminMiddleware, getAdminTransformationById);
router.post('/admin', adminMiddleware, transformationImagesUpload, createTransformation);
router.put('/admin/:id', adminMiddleware, transformationImagesUpload, updateTransformation);
router.patch('/admin/:id/publish', adminMiddleware, togglePublishTransformation);
router.delete('/admin/:id', adminMiddleware, deleteTransformation);

export default router;
