import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'node:path';

config({ path: path.resolve(process.cwd(), 'backend', '.env') });
config({ path: path.resolve(process.cwd(), '.env') });

import Transformation from '../models/transformation.model.js';
import {
  listPublicTransformations,
  getPublicTransformationById,
  getAdminTransformationById,
  togglePublishTransformation,
} from '../controllers/transformation.controller.js';

test('Transformation API Security and Consent Suite', async (t) => {
  if (mongoose.connection.readyState !== 1) {
    const { connectDB } = await import('../config/db.config.js');
    await connectDB();
  }

  // Create isolated test records
  const publishedRecord = await Transformation.create({
    title: 'Test Published Transformation SecTest',
    category: 'Strength & Conditioning',
    description: 'Test description of member progress',
    before_image: { url: 'https://example.com/before.jpg', public_id: 'test_before_sec' },
    after_image: { url: 'https://example.com/after.jpg', public_id: 'test_after_sec' },
    member_consent_obtained: true,
    consent_confirmed_at: new Date(),
    consent_notes: 'Signed waiver form on admission',
    is_published: true,
  });

  const draftRecord = await Transformation.create({
    title: 'Test Draft Transformation SecTest',
    category: 'Fat Loss',
    description: 'Draft description confidential',
    before_image: { url: 'https://example.com/before_draft.jpg', public_id: 'test_before_draft_sec' },
    after_image: { url: 'https://example.com/after_draft.jpg', public_id: 'test_after_draft_sec' },
    member_consent_obtained: false,
    consent_notes: 'Consent pending from member',
    is_published: false,
  });

  t.after(async () => {
    await Transformation.deleteMany({ _id: { $in: [publishedRecord._id, draftRecord._id] } });
    await mongoose.connection.close();
  });

  await t.test('1. Public list excludes unpublished drafts and strips private fields', async () => {
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

    const foundPublished = responseData.rows.find((r) => String(r._id) === String(publishedRecord._id));
    assert.ok(foundPublished, 'Published record must be present in public list');
    assert.equal(foundPublished.before_image.public_id, undefined, 'Cloudinary public_id must NOT be exposed publicly');
    assert.equal(foundPublished.member_consent_obtained, undefined, 'Internal consent flags must NOT be exposed in public projection');

    const foundDraft = responseData.rows.find((r) => String(r._id) === String(draftRecord._id));
    assert.equal(foundDraft, undefined, 'Draft record must NEVER appear in public list');
  });

  await t.test('2. Public getById returns published record with safe projection', async () => {
    let responseData = null;
    const mockReq = { params: { id: publishedRecord._id.toString() } };
    const mockRes = {
      json(data) {
        responseData = data;
      },
    };
    const mockNext = (err) => {
      if (err) throw err;
    };

    await getPublicTransformationById(mockReq, mockRes, mockNext);

    assert.ok(responseData, 'Published record must be returned');
    assert.equal(String(responseData._id), String(publishedRecord._id));
    assert.equal(responseData.is_published, true);
    assert.equal(responseData.before_image.public_id, undefined, 'Public projection must exclude Cloudinary public_id');
  });

  await t.test('3. Public getById returns 404 for unpublished draft', async () => {
    let errorCaught = null;
    const mockReq = { params: { id: draftRecord._id.toString() } };
    const mockRes = {
      json() {},
    };
    const mockNext = (err) => {
      errorCaught = err;
    };

    await getPublicTransformationById(mockReq, mockRes, mockNext);

    assert.ok(errorCaught, 'Unpublished record must result in an error on public endpoint');
    assert.equal(errorCaught.statusCode, 404, 'Must throw HTTP 404 Not Found for unpublished draft');
  });

  await t.test('4. Admin getById allows authorized admin to inspect draft', async () => {
    let responseData = null;
    const mockReq = { params: { id: draftRecord._id.toString() } };
    const mockRes = {
      json(data) {
        responseData = data;
      },
    };
    const mockNext = (err) => {
      if (err) throw err;
    };

    await getAdminTransformationById(mockReq, mockRes, mockNext);

    assert.ok(responseData, 'Admin must be able to inspect draft');
    assert.equal(String(responseData._id), String(draftRecord._id));
    assert.equal(responseData.is_published, false);
    assert.equal(responseData.member_consent_obtained, false);
  });

  await t.test('5. Cannot publish without member consent confirmation', async () => {
    let errorCaught = null;
    const mockReq = {
      params: { id: draftRecord._id.toString() },
      body: { is_published: true, member_consent_obtained: false },
    };
    const mockRes = { json() {} };
    const mockNext = (err) => {
      errorCaught = err;
    };

    await togglePublishTransformation(mockReq, mockRes, mockNext);

    assert.ok(errorCaught, 'Publishing without consent must fail');
    assert.equal(errorCaught.statusCode, 400, 'Must return HTTP 400 Bad Request');
    assert.match(errorCaught.message, /consent must be confirmed/i);
  });

  await t.test('6. Publishing succeeds when explicit member consent is confirmed', async () => {
    let responseData = null;
    const mockReq = {
      params: { id: draftRecord._id.toString() },
      body: { is_published: true, member_consent_obtained: true },
    };
    const mockRes = {
      json(data) {
        responseData = data;
      },
    };
    const mockNext = (err) => {
      if (err) throw err;
    };

    await togglePublishTransformation(mockReq, mockRes, mockNext);

    assert.ok(responseData, 'Publish toggle should succeed with consent');
    assert.equal(responseData.is_published, true);
    assert.equal(responseData.member_consent_obtained, true);
    assert.ok(responseData.consent_confirmed_at, 'consent_confirmed_at date must be recorded');
  });
});
