import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { getLoginPasswordError } from '../services/auth.service.js';

test('returns a clear message when a registered account has the wrong password', async () => {
  const user = { password: await bcrypt.hash('CorrectPassword123', 4) };

  assert.equal(
    await getLoginPasswordError(user, 'WrongPassword123'),
    'Incorrect password. Please try again.',
  );
});

test('keeps unknown email feedback generic', async () => {
  assert.equal(
    await getLoginPasswordError(null, 'AnyPassword123'),
    'Invalid email or password',
  );
});

test('allows a correct password to continue to the login flow', async () => {
  const user = { password: await bcrypt.hash('CorrectPassword123', 4) };

  assert.equal(await getLoginPasswordError(user, 'CorrectPassword123'), null);
});
