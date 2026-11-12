import test from 'node:test';
import assert from 'node:assert/strict';
import Transformation from '../models/transformation.model.js';
import {
  listPublicTransformations,
  getPublicTransformationById,
  listAdminTransformations,
  getAdminTransformationById,
  updateTransformation,
  togglePublishTransformation,
} from '../controllers/transformation.controller.js';

/**
 * Creates an actual Mongoose Transformation document in memory whose save()
 * method executes the actual Mongoose schema pre('save') hook chain without
 * attempting any network/database operations.
 */
function createModelDoc(data = {}) {
  const doc = new Transformation({
    title: 'Test Transformation',
    category: 'Body Transformation',
    description: 'Test Description',
    duration: '12 weeks',
    achievement: 'Gained muscle',
    story: 'Dedicated effort',
    before_image: { url: 'https://example.com/before.jpg', public_id: 'before_pub_123' },
    after_image: { url: 'https://example.com/after.jpg', public_id: 'after_pub_123' },
    member_consent_obtained: true,
    consent_confirmed_at: new Date('2026-01-01T00:00:00Z'),
    consent_notes: 'Waiver signed on admission',
    is_published: true,
    order: 0,
    ...data,
  });

  doc.save = async function () {
    await new Promise((resolve, reject) => {
      Transformation.schema.s.hooks.execPre('save', this, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    return this;
  };

  return doc;
}

test('1. Actual Mongoose Schema Consent Middleware (pre-save hook)', async (suite) => {
  await suite.test('Consent false forces is_published false and clears consent_confirmed_at', async () => {
    const doc = new Transformation({
      title: 'Hook Test Document',
      description: 'Hook Test Description',
      before_image: { url: 'https://example.com/b.jpg', public_id: 'b_id_1' },
      after_image: { url: 'https://example.com/a.jpg', public_id: 'a_id_1' },
      member_consent_obtained: false,
      is_published: true,
      consent_confirmed_at: new Date(),
    });

    // Execute the actual Mongoose pre('save') schema hook
    await new Promise((resolve, reject) => {
      Transformation.schema.s.hooks.execPre('save', doc, (err) => (err ? reject(err) : resolve()));
    });

    assert.equal(doc.is_published, false, 'pre-save hook must unconditionally set is_published to false when consent is false');
    assert.equal(doc.consent_confirmed_at, null, 'pre-save hook must unconditionally clear consent_confirmed_at to null when consent is false');
  });

  await suite.test('Consent true does not unnecessarily unpublish a valid record', async () => {
    const fixedDate = new Date('2026-03-01T12:00:00Z');
    const doc = new Transformation({
      title: 'Valid Published Record',
      description: 'Valid Description',
      before_image: { url: 'https://example.com/b.jpg', public_id: 'b_id_2' },
      after_image: { url: 'https://example.com/a.jpg', public_id: 'a_id_2' },
      member_consent_obtained: true,
      is_published: true,
      consent_confirmed_at: fixedDate,
    });

    // Execute the actual Mongoose pre('save') schema hook
    await new Promise((resolve, reject) => {
      Transformation.schema.s.hooks.execPre('save', doc, (err) => (err ? reject(err) : resolve()));
    });

    assert.equal(doc.is_published, true, 'pre-save hook must preserve is_published true when consent is true');
    assert.equal(doc.consent_confirmed_at, fixedDate, 'pre-save hook must preserve consent_confirmed_at date when consent is true');
  });
});

test('2. Transformation Controller Consent & Lifecycle Suite', async (suite) => {
  await suite.test('Published transformation with consent revoked automatically unpublishes and clears confirmation date', async (t) => {
    const originalDate = new Date('2026-01-15T10:00:00Z');
    const doc = createModelDoc({
      member_consent_obtained: true,
      is_published: true,
      consent_confirmed_at: originalDate,
    });

    t.mock.method(Transformation, 'findById', async () => doc);

    const req = {
      params: { id: doc._id.toString() },
      body: { member_consent_obtained: false },
    };
    let responseData = null;
    const res = { json: (data) => { responseData = data; } };
    const next = (err) => { if (err) throw err; };

    await updateTransformation(req, res, next);

    assert.equal(responseData.member_consent_obtained, false, 'member_consent_obtained must be false');
    assert.equal(responseData.is_published, false, 'Record must be automatically unpublished upon consent revocation');
    assert.equal(responseData.consent_confirmed_at, null, 'consent_confirmed_at must be cleared to null');
  });

  await suite.test('Attempt to publish without consent fails with HTTP 400', async (t) => {
    // Case A: via updateTransformation
    const docA = createModelDoc({
      member_consent_obtained: false,
      is_published: false,
      consent_confirmed_at: null,
    });
    t.mock.method(Transformation, 'findById', async () => docA);

    const reqA = {
      params: { id: docA._id.toString() },
      body: { is_published: true },
    };
    let errorA = null;
    const resA = { json: () => {} };
    const nextA = (err) => { errorA = err; };

    await updateTransformation(reqA, resA, nextA);
    assert.ok(errorA, 'Must throw error when attempting to publish without consent');
    assert.equal(errorA.statusCode, 400, 'Must return HTTP 400 Bad Request');
    assert.match(errorA.message, /consent must be confirmed/i);

    // Case B: via togglePublishTransformation
    const docB = createModelDoc({
      member_consent_obtained: false,
      is_published: false,
      consent_confirmed_at: null,
    });
    t.mock.method(Transformation, 'findById', async () => docB);

    const reqB = {
      params: { id: docB._id.toString() },
      body: { is_published: true, member_consent_obtained: false },
    };
    let errorB = null;
    const resB = { json: () => {} };
    const nextB = (err) => { errorB = err; };

    await togglePublishTransformation(reqB, resB, nextB);
    assert.ok(errorB, 'Must throw error in toggle endpoint when consent is false');
    assert.equal(errorB.statusCode, 400, 'Must return HTTP 400 Bad Request');
    assert.match(errorB.message, /consent must be confirmed/i);
  });

  await suite.test('Updating a transformation without changing consent preserves published and consent status', async (t) => {
    const originalDate = new Date('2026-02-01T12:00:00Z');
    const doc = createModelDoc({
      title: 'Original Title',
      description: 'Original Description',
      member_consent_obtained: true,
      is_published: true,
      consent_confirmed_at: originalDate,
    });
    t.mock.method(Transformation, 'findById', async () => doc);

    const req = {
      params: { id: doc._id.toString() },
      body: { title: 'Updated Title', description: 'Updated Description' },
    };
    let responseData = null;
    const res = { json: (data) => { responseData = data; } };
    const next = (err) => { if (err) throw err; };

    await updateTransformation(req, res, next);

    assert.equal(responseData.title, 'Updated Title');
    assert.equal(responseData.description, 'Updated Description');
    assert.equal(responseData.member_consent_obtained, true, 'member_consent_obtained must remain true');
    assert.equal(responseData.is_published, true, 'is_published must remain true');
    assert.equal(responseData.consent_confirmed_at, originalDate, 'consent_confirmed_at must remain unchanged');
  });

  await suite.test('Valid consent followed by successful publishing updates status and sets timestamp', async (t) => {
    // Case A: via updateTransformation
    const docA = createModelDoc({
      member_consent_obtained: false,
      is_published: false,
      consent_confirmed_at: null,
    });
    t.mock.method(Transformation, 'findById', async () => docA);

    const reqA = {
      params: { id: docA._id.toString() },
      body: { member_consent_obtained: true, is_published: true },
    };
    let responseDataA = null;
    const resA = { json: (data) => { responseDataA = data; } };
    const nextA = (err) => { if (err) throw err; };

    await updateTransformation(reqA, resA, nextA);

    assert.equal(responseDataA.member_consent_obtained, true, 'member_consent_obtained must be true');
    assert.equal(responseDataA.is_published, true, 'is_published must be true');
    assert.ok(responseDataA.consent_confirmed_at instanceof Date, 'consent_confirmed_at must be populated with a Date');

    // Case B: via togglePublishTransformation
    const docB = createModelDoc({
      member_consent_obtained: false,
      is_published: false,
      consent_confirmed_at: null,
    });
    t.mock.method(Transformation, 'findById', async () => docB);

    const reqB = {
      params: { id: docB._id.toString() },
      body: { is_published: true, member_consent_obtained: true },
    };
    let responseDataB = null;
    const resB = { json: (data) => { responseDataB = data; } };
    const nextB = (err) => { if (err) throw err; };

    await togglePublishTransformation(reqB, resB, nextB);

    assert.equal(responseDataB.member_consent_obtained, true);
    assert.equal(responseDataB.is_published, true);
    assert.ok(responseDataB.consent_confirmed_at instanceof Date);
  });
});

test('3. Public API Privacy and Access Control Suite', async (suite) => {
  await suite.test('Public transformation listing returns only published records with safe projection', async (t) => {
    let capturedFilter = null;
    let capturedProjection = null;

    const publicLeanRecord = {
      _id: 'pub_story_1',
      title: 'Strength Journey',
      category: 'Strength & Conditioning',
      description: 'Public description of member progress',
      duration: '16 weeks',
      achievement: 'Bench pressed 120kg',
      story: 'Great coaching and nutrition',
      before_image: { url: 'https://example.com/before.jpg' },
      after_image: { url: 'https://example.com/after.jpg' },
      is_published: true,
      order: 1,
      createdAt: new Date(),
    };

    t.mock.method(Transformation, 'find', (filter) => {
      capturedFilter = filter;
      return {
        select(proj) {
          capturedProjection = proj;
          return {
            sort() {
              return {
                limit() {
                  return {
                    lean() {
                      return Promise.resolve([publicLeanRecord]);
                    },
                  };
                },
              };
            },
          };
        },
      };
    });

    t.mock.method(Transformation, 'countDocuments', (filter) => Promise.resolve(1));
    t.mock.method(Transformation, 'distinct', (field, filter) => Promise.resolve(['Strength & Conditioning']));

    let responseData = null;
    const req = { query: {} };
    const res = { json: (data) => { responseData = data; } };
    const next = (err) => { if (err) throw err; };

    await listPublicTransformations(req, res, next);

    // Verify filter strictly enforces published status
    assert.equal(capturedFilter.is_published, true, 'Query filter MUST strictly specify is_published: true');

    // Verify projection excludes private fields and Cloudinary public_ids
    assert.ok(capturedProjection.includes('before_image.url'), 'Projection must include before image URL');
    assert.ok(capturedProjection.includes('after_image.url'), 'Projection must include after image URL');
    assert.ok(!capturedProjection.includes('public_id'), 'Projection must NEVER include Cloudinary public_id');
    assert.ok(!capturedProjection.includes('member_consent_obtained'), 'Projection must NEVER include member_consent_obtained');
    assert.ok(!capturedProjection.includes('consent_notes'), 'Projection must NEVER include consent_notes');
    assert.ok(!capturedProjection.includes('consent_confirmed_at'), 'Projection must NEVER include consent_confirmed_at');

    // Verify payload response rows
    assert.equal(responseData.rows.length, 1);
    const item = responseData.rows[0];
    assert.equal(item.is_published, true);
    assert.equal(item.member_consent_obtained, undefined, 'member_consent_obtained must be undefined in public response');
    assert.equal(item.consent_notes, undefined, 'consent_notes must be undefined in public response');
    assert.equal(item.consent_confirmed_at, undefined, 'consent_confirmed_at must be undefined in public response');
    assert.equal(item.before_image.public_id, undefined, 'Cloudinary public_id must be undefined in public before_image');
    assert.equal(item.after_image.public_id, undefined, 'Cloudinary public_id must be undefined in public after_image');
  });

  await suite.test('Public detail endpoint returns 404 for unpublished records', async (t) => {
    let capturedFilter = null;
    t.mock.method(Transformation, 'findOne', (filter) => {
      capturedFilter = filter;
      return {
        select() {
          return {
            lean() {
              // Simulating an unpublished draft: querying { _id: 'draft_id', is_published: true } returns null
              return Promise.resolve(null);
            },
          };
        },
      };
    });

    let errorCaught = null;
    const req = { params: { id: 'draft_trans_999' } };
    const res = { json: () => {} };
    const next = (err) => { errorCaught = err; };

    await getPublicTransformationById(req, res, next);

    assert.equal(capturedFilter._id, 'draft_trans_999');
    assert.equal(capturedFilter.is_published, true, 'Public getById must strictly require is_published: true');
    assert.ok(errorCaught, 'Unpublished draft query must trigger an error');
    assert.equal(errorCaught.statusCode, 404, 'Public getById must return HTTP 404 Not Found for unpublished transformation');
    assert.match(errorCaught.message, /not found/i);
  });

  await suite.test('Public detail endpoint never exposes member_consent_obtained, consent_notes, or public_id', async (t) => {
    let capturedProjection = null;
    const publicSingleRecord = {
      _id: 'pub_story_single',
      title: 'Individual Journey',
      category: 'Fat Loss',
      description: 'Detailed description',
      duration: '8 weeks',
      achievement: 'Lost 8kg fat',
      story: 'Personal journey story',
      before_image: { url: 'https://example.com/b_single.jpg' },
      after_image: { url: 'https://example.com/a_single.jpg' },
      is_published: true,
      order: 0,
      createdAt: new Date(),
    };

    t.mock.method(Transformation, 'findOne', (filter) => {
      return {
        select(proj) {
          capturedProjection = proj;
          return {
            lean() {
              return Promise.resolve(publicSingleRecord);
            },
          };
        },
      };
    });

    let responseData = null;
    const req = { params: { id: 'pub_story_single' } };
    const res = { json: (data) => { responseData = data; } };
    const next = (err) => { if (err) throw err; };

    await getPublicTransformationById(req, res, next);

    assert.ok(responseData, 'Must return transformation data for published record');
    assert.ok(!capturedProjection.includes('public_id'), 'Projection must not contain public_id');
    assert.ok(!capturedProjection.includes('member_consent_obtained'), 'Projection must not contain member_consent_obtained');
    assert.ok(!capturedProjection.includes('consent_notes'), 'Projection must not contain consent_notes');

    assert.equal(responseData.member_consent_obtained, undefined, 'member_consent_obtained must be undefined');
    assert.equal(responseData.consent_notes, undefined, 'consent_notes must be undefined');
    assert.equal(responseData.before_image.public_id, undefined, 'before_image.public_id must be undefined');
    assert.equal(responseData.after_image.public_id, undefined, 'after_image.public_id must be undefined');
  });

  await suite.test('Admin endpoints can retrieve authorized draft records and full internal metadata', async (t) => {
    const draftRecord = {
      _id: 'draft_admin_item',
      title: 'Draft Transformation',
      category: 'Body Transformation',
      description: 'Confidential draft notes',
      before_image: { url: 'https://example.com/before_raw.jpg', public_id: 'cloudinary_before_raw' },
      after_image: { url: 'https://example.com/after_raw.jpg', public_id: 'cloudinary_after_raw' },
      member_consent_obtained: false,
      consent_confirmed_at: null,
      consent_notes: 'Consent form sent via email, awaiting signature',
      is_published: false,
    };

    // 1. Admin getAdminTransformationById
    t.mock.method(Transformation, 'findById', (id) => {
      return {
        lean() {
          return Promise.resolve(draftRecord);
        },
      };
    });

    let adminDetailData = null;
    const reqDetail = { params: { id: 'draft_admin_item' } };
    const resDetail = { json: (data) => { adminDetailData = data; } };
    const nextDetail = (err) => { if (err) throw err; };

    await getAdminTransformationById(reqDetail, resDetail, nextDetail);

    assert.ok(adminDetailData, 'Admin must receive draft data');
    assert.equal(adminDetailData.is_published, false, 'Admin can inspect unpublished status');
    assert.equal(adminDetailData.member_consent_obtained, false, 'Admin can inspect consent status');
    assert.equal(adminDetailData.consent_notes, 'Consent form sent via email, awaiting signature');
    assert.equal(adminDetailData.before_image.public_id, 'cloudinary_before_raw', 'Admin can inspect Cloudinary public_id');

    // 2. Admin listAdminTransformations
    t.mock.method(Transformation, 'find', () => {
      return {
        sort() {
          return {
            lean() {
              return Promise.resolve([draftRecord]);
            },
          };
        },
      };
    });

    let adminListData = null;
    const reqList = {};
    const resList = { json: (data) => { adminListData = data; } };
    const nextList = (err) => { if (err) throw err; };

    await listAdminTransformations(reqList, resList, nextList);

    assert.ok(adminListData, 'Admin list must return results');
    assert.equal(adminListData.rows.length, 1);
    assert.equal(adminListData.rows[0].is_published, false, 'Admin list includes drafts');
    assert.equal(adminListData.rows[0].member_consent_obtained, false);
  });
});
