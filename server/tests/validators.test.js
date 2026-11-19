import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail, isValidPassword } from '../utils/validators.js';

test('isValidEmail accepts well-formed addresses', () => {
  assert.equal(isValidEmail('donor@test.com'), true);
  assert.equal(isValidEmail('  ngo.admin@example.org '), true);
});

test('isValidEmail rejects malformed values', () => {
  for (const value of ['', 'plainaddress', 'a@b', 'a b@c.com', '@test.com', null, undefined, 42]) {
    assert.equal(isValidEmail(value), false, `expected ${value} to be invalid`);
  }
});

test('isValidPassword enforces a minimum length', () => {
  assert.equal(isValidPassword('123456'), true);
  assert.equal(isValidPassword('12345'), false);
  assert.equal(isValidPassword('abc', 3), true);
  assert.equal(isValidPassword(123456), false);
});
