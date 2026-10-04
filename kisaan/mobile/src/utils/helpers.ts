// Small shared helpers

export function genId(prefix = ''): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}${Date.now().toString(36)}${rand}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function daysBetween(fromISOStr: string, toISOStr: string): number {
  const a = parseISODate(fromISOStr).getTime();
  const b = parseISODate(toISOStr).getTime();
  return Math.round((b - a) / 86400000);
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Display date like 02/10/2026 (DD/MM/YYYY — familiar in India) */
export function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = parseISODate(iso);
  return `${`${d.getDate()}`.padStart(2, '0')}/${`${d.getMonth() + 1}`.padStart(2, '0')}/${d.getFullYear()}`;
}

export function formatMonth(monthISO: string): string {
  // monthISO like 2026-10
  const [y, m] = monthISO.split('-').map(Number);
  const names = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${names[(m || 1) - 1]} ${y}`;
}

export function monthOf(iso: string): string {
  return iso.slice(0, 7);
}

export function shiftMonth(monthISO: string, delta: number): string {
  const [y, m] = monthISO.split('-').map(Number);
  const d = new Date(y, (m || 1) - 1 + delta, 1);
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}`;
}

export function formatINR(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? '-' : '';
  const abs = Math.abs(rounded).toString();
  // Indian digit grouping: last 3, then pairs (1,00,000)
  if (abs.length <= 3) return `${sign}₹${abs}`;
  const last3 = abs.slice(-3);
  const rest = abs.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${sign}₹${grouped},${last3}`;
}

export function formatNumber(n: number): string {
  return Number.isInteger(n) ? `${n}` : n.toFixed(1).replace(/\.0$/, '');
}

export function isPhoneValid(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s|-/g, ''));
}

/** Demo-only hash (djb2). NOT cryptographically secure — offline mode only. */
export function localHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return (h >>> 0).toString(16).padStart(8, '0') + s.length.toString(16);
}
