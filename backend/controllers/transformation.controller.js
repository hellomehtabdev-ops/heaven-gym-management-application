import Transformation from '../models/transformation.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.utils.js';
import { ApiError } from '../utils/errors.utils.js';

const bool = (value) => value === true || value === 'true';

export async function listPublicTransformations(req, res, next) {
  try {
    const { category, limit = 20 } = req.query;
    const filter = { is_published: true };
    if (category && category !== 'all') {
      filter.category = category;
    }
    const safeLimit = Math.min(50, Math.max(1, Number(limit) || 20));
    const [rows, total, categories] = await Promise.all([
      Transformation.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .limit(safeLimit)
        .lean(),
      Transformation.countDocuments(filter),
      Transformation.distinct('category', { is_published: true }),
    ]);

    res.json({ rows, total, categories });
  } catch (error) {
    next(error);
  }
}

export async function listAdminTransformations(req, res, next) {
  try {
    const rows = await Transformation.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ rows, total: rows.length });
  } catch (error) {
    next(error);
  }
}

export async function getTransformationById(req, res, next) {
  try {
    const transformation = await Transformation.findById(req.params.id).lean();
    if (!transformation) {
      throw new ApiError(404, 'Transformation not found');
    }
    res.json(transformation);
  } catch (error) {
    next(error);
  }
}

export async function createTransformation(req, res, next) {
  const uploaded = [];
  try {
    const files = req.files || {};
    const beforeFile = files.before_image?.[0];
    const afterFile = files.after_image?.[0];

    if (!beforeFile) {
      throw new ApiError(400, 'Before image is required');
    }
    if (!afterFile) {
      throw new ApiError(400, 'After image is required');
    }

    const title = String(req.body.title || '').trim();
    if (!title) {
      throw new ApiError(400, 'Title is required');
    }

    const description = String(req.body.description || '').trim();
    if (!description) {
      throw new ApiError(400, 'Description is required');
    }

    const beforeUpload = await uploadToCloudinary(beforeFile.buffer, 'heaven-gym/transformations');
    uploaded.push(beforeUpload);

    const afterUpload = await uploadToCloudinary(afterFile.buffer, 'heaven-gym/transformations');
    uploaded.push(afterUpload);

    const record = await Transformation.create({
      title,
      category: String(req.body.category || 'Body Transformation').trim(),
      description,
      duration: String(req.body.duration || '').trim(),
      achievement: String(req.body.achievement || '').trim(),
      story: String(req.body.story || '').trim(),
      before_image: {
        url: beforeUpload.secure_url,
        public_id: beforeUpload.public_id,
      },
      after_image: {
        url: afterUpload.secure_url,
        public_id: afterUpload.public_id,
      },
      is_published: bool(req.body.is_published),
      order: Number(req.body.order) || 0,
    });

    res.status(201).json(record);
  } catch (error) {
    await Promise.all(uploaded.map((img) => deleteFromCloudinary(img.public_id).catch(() => {})));
    next(error);
  }
}

export async function updateTransformation(req, res, next) {
  const newlyUploaded = [];
  try {
    const record = await Transformation.findById(req.params.id);
    if (!record) {
      throw new ApiError(404, 'Transformation not found');
    }

    const files = req.files || {};
    const newBeforeFile = files.before_image?.[0];
    const newAfterFile = files.after_image?.[0];

    let oldBeforePublicIdToDelete = null;
    let oldAfterPublicIdToDelete = null;

    if (newBeforeFile) {
      const beforeUpload = await uploadToCloudinary(newBeforeFile.buffer, 'heaven-gym/transformations');
      newlyUploaded.push(beforeUpload);
      oldBeforePublicIdToDelete = record.before_image?.public_id;
      record.before_image = {
        url: beforeUpload.secure_url,
        public_id: beforeUpload.public_id,
      };
    }

    if (newAfterFile) {
      const afterUpload = await uploadToCloudinary(newAfterFile.buffer, 'heaven-gym/transformations');
      newlyUploaded.push(afterUpload);
      oldAfterPublicIdToDelete = record.after_image?.public_id;
      record.after_image = {
        url: afterUpload.secure_url,
        public_id: afterUpload.public_id,
      };
    }

    if (req.body.title !== undefined) {
      const title = String(req.body.title || '').trim();
      if (!title) throw new ApiError(400, 'Title cannot be empty');
      record.title = title;
    }

    if (req.body.category !== undefined) {
      record.category = String(req.body.category || 'Body Transformation').trim();
    }

    if (req.body.description !== undefined) {
      const description = String(req.body.description || '').trim();
      if (!description) throw new ApiError(400, 'Description cannot be empty');
      record.description = description;
    }

    if (req.body.duration !== undefined) {
      record.duration = String(req.body.duration || '').trim();
    }

    if (req.body.achievement !== undefined) {
      record.achievement = String(req.body.achievement || '').trim();
    }

    if (req.body.story !== undefined) {
      record.story = String(req.body.story || '').trim();
    }

    if (req.body.is_published !== undefined) {
      record.is_published = bool(req.body.is_published);
    }

    if (req.body.order !== undefined) {
      record.order = Number(req.body.order) || 0;
    }

    await record.save();

    if (oldBeforePublicIdToDelete) {
      await deleteFromCloudinary(oldBeforePublicIdToDelete).catch(() => {});
    }
    if (oldAfterPublicIdToDelete) {
      await deleteFromCloudinary(oldAfterPublicIdToDelete).catch(() => {});
    }

    res.json(record);
  } catch (error) {
    await Promise.all(newlyUploaded.map((img) => deleteFromCloudinary(img.public_id).catch(() => {})));
    next(error);
  }
}

export async function togglePublishTransformation(req, res, next) {
  try {
    const record = await Transformation.findById(req.params.id);
    if (!record) {
      throw new ApiError(404, 'Transformation not found');
    }
    record.is_published = req.body.is_published !== undefined ? bool(req.body.is_published) : !record.is_published;
    await record.save();
    res.json(record);
  } catch (error) {
    next(error);
  }
}

export async function deleteTransformation(req, res, next) {
  try {
    const record = await Transformation.findByIdAndDelete(req.params.id);
    if (!record) {
      throw new ApiError(404, 'Transformation not found');
    }

    if (record.before_image?.public_id) {
      await deleteFromCloudinary(record.before_image.public_id).catch(() => {});
    }
    if (record.after_image?.public_id) {
      await deleteFromCloudinary(record.after_image.public_id).catch(() => {});
    }

    res.json({ message: 'Transformation removed successfully' });
  } catch (error) {
    next(error);
  }
}
