import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'node:path';

config({ path: path.resolve(process.cwd(), 'backend', '.env') });
config({ path: path.resolve(process.cwd(), '.env') });

import Transformation from '../models/transformation.model.js';
import { listPublicTransformations } from '../controllers/transformation.controller.js';

test('Transformation: Public listing returns published transformations only', async (t) => {
  if (mongoose.connection.readyState !== 1) {
    const { connectDB } = await import('../config/db.config.js');
    await connectDB();
  }

  // Create temporary mock records
  const published = await Transformation.create({
    title: 'Test Published Transformation',
    category: 'Strength & Conditioning',
    description: 'Test description of member progress',
    before_image: { url: 'https://example.com/before.jpg', public_id: 'test_before_123' },
    after_image: { url: 'https://example.com/after.jpg', public_id: 'test_after_123' },
    is_published: true,
  });

  const unpublished = await Transformation.create({
    title: 'Test Unpublished Draft Transformation',
    category: 'Fat Loss',
    description: 'Draft description',
    before_image: { url: 'https://example.com/before_draft.jpg', public_id: 'test_before_draft' },
    after_image: { url: 'https://example.com/after_draft.jpg', public_id: 'test_after_draft' },
    is_published: false,
  });

  t.after(async () => {
    await Transformation.deleteMany({ _id: { $in: [published._id, unpublished._id] } });
  });

  // Call controller
  let responseData = null;
  const mockReq = { query: {} };
  const mockRes = {
    json(data) {
      responseData = data;
    },
  };
  const mockNext = (err) => {
    if (err) throw err;
  };

  await listPublicTransformations(mockReq, mockRes, mockNext);

  assert.ok(responseData, 'Response data must be returned');
  assert.ok(Array.isArray(responseData.rows), 'rows must be an array');

  // Verify published item is present in rows
  const foundPublished = responseData.rows.find((r) => String(r._id) === String(published._id));
  assert.ok(foundPublished, 'Published transformation must be in public rows');

  // Verify unpublished item is NOT present in rows
  const foundUnpublished = responseData.rows.find((r) => String(r._id) === String(unpublished._id));
  assert.equal(foundUnpublished, undefined, 'Unpublished transformation must NEVER be exposed publicly');
});
