import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { getLoginPasswordError } from '../services/auth.service.js';

test('keeps wrong-password feedback generic for registered accounts', async () => {
  const user = { password: await bcrypt.hash('CorrectPassword123', 4) };

  assert.equal(
    await getLoginPasswordError(user, 'WrongPassword123'),
    'Invalid email or password',
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
