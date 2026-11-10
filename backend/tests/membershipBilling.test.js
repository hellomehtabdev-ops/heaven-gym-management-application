import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMembershipBalance } from '../utils/membershipBilling.utils.js';

test('calculates remaining balance after successful cash/online membership payments', () => {
  const result = calculateMembershipBalance(
    { _id: 'membership-1', plan_price_snapshot: 2500, advance_paid: 0, membership_type: 'initial' },
    [{ payment_type: 'membership_installment', status: 'success', payment_method: 'cash', amount: 2200 }],
  );
  assert.deepEqual(result, {
    advancePaid: 0,
    amountReceived: 2200,
    amountDue: 300,
    paymentStatus: 'pending',
  });
});

test('deducts admission advance only from the first membership purchase', () => {
  const result = calculateMembershipBalance(
    { _id: 'first-membership', plan_price_snapshot: 2500, advance_paid: 500, membership_type: 'initial' },
    [{
      membership_id: 'first-membership',
      payment_type: 'membership_advance',
      status: 'success',
      allocated_amount: 500,
    }],
  );

  assert.deepEqual(result, {
    advancePaid: 500,
    amountReceived: 0,
    amountDue: 2000,
    paymentStatus: 'pending',
  });
});

test('counts only successful membership payments, not pending or failed attempts', () => {
  const result = calculateMembershipBalance(
    { _id: 'membership-1', plan_price_snapshot: 2500, membership_type: 'initial' },
    [
      { payment_type: 'membership_full', status: 'pending', amount: 2500 },
      { payment_type: 'membership_installment', status: 'failed', amount: 1000 },
    ],
  );
  assert.equal(result.amountReceived, 0);
  assert.equal(result.amountDue, 2500);
  assert.equal(result.paymentStatus, 'pending');
});

test('uses only advance credits allocated to this membership', () => {
  const result = calculateMembershipBalance(
    { _id: 'membership-1', plan_price_snapshot: 2500, advance_paid: 300, membership_type: 'initial' },
    [
      { _id: 'a1', membership_id: 'membership-1', payment_type: 'membership_advance', status: 'success', allocated_amount: 500 },
      { _id: 'a2', membership_id: 'another-membership', payment_type: 'membership_advance', status: 'success', allocated_amount: 700 },
      { payment_type: 'membership_installment', status: 'success', amount: 1000 },
    ],
  );
  assert.equal(result.advancePaid, 500);
  assert.equal(result.amountDue, 1000);
});

test('does not apply admission advances to renewals', () => {
  const result = calculateMembershipBalance(
    { _id: 'renewal-1', plan_price_snapshot: 2500, advance_paid: 500, membership_type: 'renewal' },
    [{ membership_id: 'renewal-1', payment_type: 'membership_advance', status: 'success', allocated_amount: 500 }],
  );
  assert.equal(result.advancePaid, 0);
  assert.equal(result.amountDue, 2500);
});

test('caps overpayment at zero due and reports refunded records', () => {
  const result = calculateMembershipBalance(
    { _id: 'membership-1', plan_price_snapshot: 2500, membership_type: 'initial' },
    [{ payment_type: 'membership_full', status: 'success', amount: 2600 }],
  );
  assert.equal(result.amountDue, 0);
  assert.equal(result.paymentStatus, 'paid');

  const refunded = calculateMembershipBalance(
    { _id: 'membership-1', plan_price_snapshot: 2500, membership_type: 'initial' },
    [{ payment_type: 'membership_full', status: 'refunded', amount: 2500 }],
  );
  assert.equal(refunded.paymentStatus, 'refunded');
});

test('rounds fractional currency balances to two decimal places', () => {
  const result = calculateMembershipBalance(
    { _id: 'membership-1', plan_price_snapshot: 999.99, membership_type: 'initial' },
    [{ payment_type: 'membership_installment', status: 'success', amount: 333.33 }],
  );
  assert.equal(result.amountDue, 666.66);
});

test('sanitizes special regex characters safely for user searches', () => {
  const unescaped = 'john.doe+gym[test](plan)';
  const sanitized = unescaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.equal(sanitized, 'john\\.doe\\+gym\\[test\\]\\(plan\\)');
  assert.doesNotThrow(() => new RegExp(sanitized, 'i'));
});
