import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Session from '../models/session.model.js';
import { updateProfile } from '../controllers/user.controller.js';
import { changePassword } from '../services/auth.service.js';

test('profile update only writes the authenticated user and whitelisted profile fields', async (t) => {
  const authenticatedUserId = 'authenticated-user-id';
  let capturedId;
  let capturedUpdate;
  let response;

  t.mock.method(User, 'findById', async (id) => {
    assert.equal(String(id), authenticatedUserId);
    return { avatar_public_id: '' };
  });
  t.mock.method(User, 'findByIdAndUpdate', async (id, update, options) => {
    capturedId = String(id);
    capturedUpdate = update;
    assert.deepEqual(options, { new: true, runValidators: true });
    return { _id: authenticatedUserId, full_name: 'Mehtab', phone: '1234567890', address: 'Purnea' };
  });

  await updateProfile(
    {
      user: { _id: authenticatedUserId },
      body: {
        full_name: ' Mehtab ',
        phone: '1234567890',
        address: 'Purnea',
        _id: 'another-user-id',
        user_id: 'another-user-id',
        email: 'attacker@example.com',
        role: 'admin',
        password: 'attacker-controlled-password',
        email_verified: true,
      },
    },
    { json: (value) => { response = value; } },
    (error) => { if (error) throw error; },
  );

  assert.equal(capturedId, authenticatedUserId);
  assert.deepEqual(capturedUpdate, {
    $set: { full_name: 'Mehtab', phone: '1234567890', address: 'Purnea' },
  });
  assert.equal(response.full_name, 'Mehtab');
});

test('profile update rejects an empty name before writing to the database', async (t) => {
  t.mock.method(User, 'findById', async () => {
    assert.fail('Database must not be queried for invalid profile input');
  });

  await assert.rejects(
    updateProfile(
      { user: { _id: 'authenticated-user-id' }, body: { full_name: '   ' } },
      { json: () => assert.fail('Invalid profile must not be saved') },
      (error) => { throw error; },
    ),
    (error) => error.statusCode === 400,
  );
});

test('password change rejects an incorrect current password and preserves the stored hash', async (t) => {
  const originalHash = await bcrypt.hash('CurrentPassword123', 4);
  const user = { password: originalHash, save: async () => assert.fail('Password must not be saved') };

  t.mock.method(User, 'findById', () => ({ select: async () => user }));
  t.mock.method(Session, 'updateMany', async () => assert.fail('Sessions must not be changed for an invalid current password'));

  await assert.rejects(
    changePassword('authenticated-user-id', {
      currentPassword: 'IncorrectPassword123',
      newPassword: 'NewSecurePassword123',
    }),
    (error) => error.statusCode === 401,
  );
  assert.equal(user.password, originalHash);
});

test('password change hashes the new password and revokes all sessions for that user', async (t) => {
  const originalHash = await bcrypt.hash('CurrentPassword123', 4);
  let saved = false;
  let revokeFilter;
  let revokeUpdate;
  const user = {
    password: originalHash,
    async save() { saved = true; },
  };

  t.mock.method(User, 'findById', () => ({ select: async () => user }));
  t.mock.method(Session, 'updateMany', async (filter, update) => {
    revokeFilter = filter;
    revokeUpdate = update;
    return { modifiedCount: 2 };
  });

  const result = await changePassword('authenticated-user-id', {
    currentPassword: 'CurrentPassword123',
    newPassword: 'NewSecurePassword123',
  });

  assert.equal(saved, true);
  assert.notEqual(user.password, 'NewSecurePassword123');
  assert.equal(await bcrypt.compare('NewSecurePassword123', user.password), true);
  assert.deepEqual(revokeFilter, { user_id: 'authenticated-user-id', revoked_at: null });
  assert.equal(revokeUpdate.$set.revoke_reason, 'password-changed');
  assert.ok(revokeUpdate.$set.revoked_at instanceof Date);
  assert.match(result.message, /log in again/i);
});

test('password change enforces the minimum password length', async (t) => {
  t.mock.method(User, 'findById', () => assert.fail('Invalid new password must be rejected before database access'));

  await assert.rejects(
    changePassword('authenticated-user-id', {
      currentPassword: 'CurrentPassword123',
      newPassword: 'short',
    }),
    (error) => error.statusCode === 400,
  );
});
