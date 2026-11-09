export function calculateMembershipBalance(membership, payments = []) {
  const advanceFromLedger = payments
    .filter((payment) => payment.payment_type === 'membership_advance'
      && String(payment.membership_id || '') === String(membership._id || membership.id || '')
      && payment.status === 'success')
    .reduce((sum, payment) => sum + Number(payment.allocated_amount || 0), 0);

  const advancePaid = membership.membership_type === 'renewal'
    ? 0
    : Math.max(Number(membership.advance_paid || 0), advanceFromLedger);

  const amountReceived = payments
    .filter((payment) => ['membership_full', 'membership_installment'].includes(payment.payment_type)
      && payment.status === 'success')
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const amountDue = Math.max(0, Number((
    Number(membership.plan_price_snapshot || 0) - advancePaid - amountReceived
  ).toFixed(2)));

  const hasRefund = membership.payment_status === 'refunded'
    || payments.some((payment) => payment.status === 'refunded');

  return {
    advancePaid,
    amountReceived,
    amountDue,
    paymentStatus: hasRefund ? 'refunded' : amountDue === 0 ? 'paid' : 'pending',
  };
}
