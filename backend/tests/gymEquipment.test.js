import test from 'node:test';
import assert from 'node:assert/strict';
import GymEquipment from '../models/gymEquipment.model.js';
import {
  listPublicEquipment,
  getPublicEquipmentBySlug,
} from '../controllers/gymEquipment.controller.js';

test('public equipment listing applies server-side search, category and pagination', async (t) => {
  let capturedFilter;
  let capturedProjection;
  let capturedSkip;
  let capturedLimit;

  t.mock.method(GymEquipment, 'find', (filter) => {
    capturedFilter = filter;
    return {
      select(projection) {
        capturedProjection = projection;
        return {
          sort() {
            return {
              skip(value) {
                capturedSkip = value;
                return {
                  limit(value) {
                    capturedLimit = value;
                    return {
                      lean() {
                        return Promise.resolve([{ _id: 'equipment-1', name: 'Olympic Bench' }]);
                      },
                    };
                  },
                };
              },
            };
          },
        };
      },
    };
  });
  t.mock.method(GymEquipment, 'countDocuments', () => Promise.resolve(45));
  t.mock.method(GymEquipment, 'distinct', () => Promise.resolve(['Strength']));

  let response;
  await listPublicEquipment(
    { query: { search: '  bench  ', category: 'Strength', page: '2', limit: '20' } },
    { json: (data) => { response = data; } },
    (error) => { if (error) throw error; }
  );

  assert.equal(capturedFilter.is_published, true);
  assert.equal(capturedFilter.category, 'Strength');
  assert.deepEqual(capturedFilter.$text, { $search: 'bench' });
  assert.equal(capturedSkip, 20);
  assert.equal(capturedLimit, 20);
  assert.ok(!capturedProjection.includes('public_id'));
  assert.ok(capturedProjection.includes('images.url'));
  assert.equal(response.total, 45);
  assert.equal(response.page, 2);
  assert.equal(response.pages, 3);
  assert.equal(response.rows.length, 1);
});

test('public equipment detail uses a safe projection and returns 404 for unpublished products', async (t) => {
  let capturedFilter;
  let capturedProjection;

  t.mock.method(GymEquipment, 'findOne', (filter) => {
    capturedFilter = filter;
    return {
      select(projection) {
        capturedProjection = projection;
        return {
          lean() {
            return Promise.resolve(null);
          },
        };
      },
    };
  });

  let statusCode;
  let response;
  await getPublicEquipmentBySlug(
    { params: { slug: 'hidden-bench' } },
    {
      status(code) { statusCode = code; return this; },
      json(data) { response = data; return this; },
    },
    (caught) => { throw caught; }
  );

  assert.deepEqual(capturedFilter, { slug: 'hidden-bench', is_published: true });
  assert.ok(!capturedProjection.includes('public_id'));
  assert.equal(statusCode, 404);
  assert.match(response.error, /not found/i);
});
