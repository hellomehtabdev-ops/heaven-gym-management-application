export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

export function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function getMembershipExpiryInfo(endDateInput, referenceDate = new Date()) {
  if (!endDateInput) return { days: 0, status: 'none', label: '—', text: '—' };
  const endDate = new Date(endDateInput);
  if (Number.isNaN(endDate.getTime())) return { days: 0, status: 'invalid', label: '—', text: '—' };

  const timeZone = 'Asia/Kolkata';
  const getParts = (d) => {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d);
    const map = {};
    for (const p of parts) if (p.type !== 'literal') map[p.type] = Number(p.value);
    return map;
  };

  const todayParts = getParts(referenceDate);
  const endParts = getParts(endDate);

  const utcToday = Date.UTC(todayParts.year, todayParts.month - 1, todayParts.day);
  const utcEnd = Date.UTC(endParts.year, endParts.month - 1, endParts.day);
  const diffDays = Math.round((utcEnd - utcToday) / 86400000);

  if (referenceDate.getTime() > endDate.getTime() || diffDays < 0) {
    return { days: 0, status: 'expired', label: 'Expired', text: 'Expired' };
  }

  if (diffDays === 0) {
    return { days: 0, status: 'today', label: 'Expires today', text: 'Expires today' };
  }

  if (diffDays === 1) {
    return { days: 1, status: 'active', label: '1 day left', text: '1 day remaining' };
  }

  return { days: diffDays, status: 'active', label: `${diffDays} days left`, text: `${diffDays} days remaining` };
}

export function getDaysRemaining(endDate) {
  return getMembershipExpiryInfo(endDate).days;
}
