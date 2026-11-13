import test from 'node:test';
import assert from 'node:assert/strict';
import Transformation from '../models/transformation.model.js';
import { togglePublishTransformation } from '../controllers/transformation.controller.js';

function createDoc(isPublished = false) {
  const doc = new Transformation({
    title: 'Test Transformation',
    category: 'Body Transformation',
    description: 'Test description',
    before_image: { url: 'https://example.com/before.jpg', public_id: 'before' },
    after_image: { url: 'https://example.com/after.jpg', public_id: 'after' },
    is_published: isPublished,
    member_consent_obtained: false,
  });
  doc.save = async function () { return this; };
  return doc;
}

test('Admin can publish a transformation directly without a consent field', async (t) => {
  const doc = createDoc(false);
  t.mock.method(Transformation, 'findById', async () => doc);
  let result;
  const req = { params: { id: doc._id.toString() }, body: { is_published: true } };
  await togglePublishTransformation(req, { json: (value) => { result = value; } }, (error) => { if (error) throw error; });
  assert.equal(result.is_published, true);
  assert.equal(result.member_consent_obtained, false);
});

test('Admin can unpublish a transformation directly', async (t) => {
  const doc = createDoc(true);
  t.mock.method(Transformation, 'findById', async () => doc);
  let result;
  const req = { params: { id: doc._id.toString() }, body: { is_published: false } };
  await togglePublishTransformation(req, { json: (value) => { result = value; } }, (error) => { if (error) throw error; });
  assert.equal(result.is_published, false);
});

test('Admin publish endpoint toggles status when is_published is omitted', async (t) => {
  const doc = createDoc(false);
  t.mock.method(Transformation, 'findById', async () => doc);
  let result;
  const req = { params: { id: doc._id.toString() }, body: {} };
  await togglePublishTransformation(req, { json: (value) => { result = value; } }, (error) => { if (error) throw error; });
  assert.equal(result.is_published, true);
});

test('Public listing query remains restricted to published records', async (t) => {
  let capturedFilter;
  t.mock.method(Transformation, 'find', (filter) => {
    capturedFilter = filter;
    return {
      select() { return this; },
      sort() { return this; },
      skip() { return this; },
      limit() { return this; },
      lean: async () => [],
    };
  });
  t.mock.method(Transformation, 'countDocuments', async () => 0);
  t.mock.method(Transformation, 'distinct', async () => []);
  const req = { query: {} };
  await (await import('../controllers/transformation.controller.js')).listPublicTransformations(
    req, { json: () => {} }, (error) => { if (error) throw error; }
  );
  assert.deepEqual(capturedFilter, { is_published: true });
});
