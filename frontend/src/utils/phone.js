export function getWhatsAppNumber(value) {
  const digits = String(value ?? '').replace(/\D/g, '');

  if (!digits) return '';
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;

  return digits;
}
