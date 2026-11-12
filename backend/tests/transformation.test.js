import test from 'node:test';
import assert from 'node:assert/strict';
import Transformation from '../models/transformation.model.js';
import {
  listPublicTransformations,
  getPublicTransformationById,
  updateTransformation,
  togglePublishTransformation,
} from '../controllers/transformation.controller.js';

function createMockRecord(overrides = {}) {
  return {
    _id: 'trans_mock_123',
    title: 'Initial Transformation',
    category: 'Body Transformation',
    description: 'Initial Description',
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
    ...overrides,
    async save() {
      if (!this.member_consent_obtained) {
        this.is_published = false;
        this.consent_confirmed_at = null;
      }
      return this;
    },
  };
}

test('Transformation Regression Suite (Pure Unit Tests - Zero DB Writes)', async (suite) => {
  await suite.test('1. Published transformation with consent revoked automatically unpublishes and clears confirmation date', async (t) => {
    const originalDate = new Date('2026-01-15T10:00:00Z');
    const mockRecord = createMockRecord({
      member_consent_obtained: true,
      is_published: true,
      consent_confirmed_at: originalDate,
    });

    t.mock.method(Transformation, 'findById', async () => mockRecord);

    const req = {
      params: { id: 'trans_mock_123' },
      body: { member_consent_obtained: false },
    };
    let responseData = null;
    const res = { json: (data) => { responseData = data; } };
    const next = (err) => { if (err) throw err; };

    await updateTransformation(req, res, next);

    assert.equal(responseData.member_consent_obtained, false, 'Consent must be set to false');
    assert.equal(responseData.is_published, false, 'Record must be automatically unpublished when consent is revoked');
    assert.equal(responseData.consent_confirmed_at, null, 'consent_confirmed_at must be cleared to null');
  });

  await suite.test('2. Attempt to publish without consent fails with HTTP 400', async (t) => {
    // Case A: via updateTransformation
    const mockRecordA = createMockRecord({
      member_consent_obtained: false,
      is_published: false,
      consent_confirmed_at: null,
    });
    t.mock.method(Transformation, 'findById', async () => mockRecordA);

    const reqA = {
      params: { id: 'trans_mock_123' },
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
    const mockRecordB = createMockRecord({
      member_consent_obtained: false,
      is_published: false,
      consent_confirmed_at: null,
    });
    t.mock.method(Transformation, 'findById', async () => mockRecordB);

    const reqB = {
      params: { id: 'trans_mock_123' },
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

  await suite.test('3. Updating a transformation without changing consent preserves published and consent status', async (t) => {
    const originalDate = new Date('2026-02-01T12:00:00Z');
    const mockRecord = createMockRecord({
      title: 'Original Title',
      description: 'Original Description',
      member_consent_obtained: true,
      is_published: true,
      consent_confirmed_at: originalDate,
    });
    t.mock.method(Transformation, 'findById', async () => mockRecord);

    const req = {
      params: { id: 'trans_mock_123' },
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
    assert.equal(responseData.consent_confirmed_at, originalDate, 'consent_confirmed_at must not be modified');
  });

  await suite.test('4. Valid consent followed by successful publishing updates status and sets timestamp', async (t) => {
    // Case A: via updateTransformation
    const mockRecordA = createMockRecord({
      member_consent_obtained: false,
      is_published: false,
      consent_confirmed_at: null,
    });
    t.mock.method(Transformation, 'findById', async () => mockRecordA);

    const reqA = {
      params: { id: 'trans_mock_123' },
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
    const mockRecordB = createMockRecord({
      member_consent_obtained: false,
      is_published: false,
      consent_confirmed_at: null,
    });
    t.mock.method(Transformation, 'findById', async () => mockRecordB);

    const reqB = {
      params: { id: 'trans_mock_123' },
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

  await suite.test('5. Public API never returns unpublished transformations', async (t) => {
    // Verify listPublicTransformations strictly filters by is_published: true
    let findFilterPassed = null;
    const publishedRecord = {
      _id: 'pub_1',
      title: 'Published Story',
      category: 'Strength',
      description: 'Desc',
      is_published: true,
    };

    t.mock.method(Transformation, 'find', (filter) => {
      findFilterPassed = filter;
      return {
        select() {
          return {
            sort() {
              return {
                limit() {
                  return {
                    lean() {
                      return Promise.resolve([publishedRecord]);
                    },
                  };
                },
              };
            },
          };
        },
      };
    });
    t.mock.method(Transformation, 'countDocuments', () => Promise.resolve(1));
    t.mock.method(Transformation, 'distinct', () => Promise.resolve(['Strength']));

    let listData = null;
    const reqList = { query: {} };
    const resList = { json: (data) => { listData = data; } };
    const nextList = (err) => { if (err) throw err; };

    await listPublicTransformations(reqList, resList, nextList);

    assert.equal(findFilterPassed.is_published, true, 'Public listing must strictly filter by is_published: true');
    assert.equal(listData.rows.length, 1);
    assert.equal(listData.rows[0].is_published, true);

    // Verify getPublicTransformationById queries is_published: true and returns 404 for drafts
    let findOneFilterPassed = null;
    t.mock.method(Transformation, 'findOne', (filter) => {
      findOneFilterPassed = filter;
      return {
        select() {
          return {
            lean() {
              // Return null since record is an unpublished draft
              return Promise.resolve(null);
            },
          };
        },
      };
    });

    let errorCaught = null;
    const reqGet = { params: { id: 'draft_trans_404' } };
    const resGet = { json: () => {} };
    const nextGet = (err) => { errorCaught = err; };

    await getPublicTransformationById(reqGet, resGet, nextGet);

    assert.equal(findOneFilterPassed._id, 'draft_trans_404');
    assert.equal(findOneFilterPassed.is_published, true, 'Public getById must strictly require is_published: true');
    assert.ok(errorCaught, 'Unpublished draft must yield an error');
    assert.equal(errorCaught.statusCode, 404, 'Public getById must return 404 Not Found for unpublished draft');
  });
});
