const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const DEFAULT_ALLOWED_ORIGINS = [
  'https://heaven-gym-management-frontend.vercel.app',
  'http://localhost:5173',
];

function allowedOrigins() {
  return String(process.env.CLIENT_URL || DEFAULT_ALLOWED_ORIGINS.join(','))
    .split(',')
    .map((value) => value.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

export function originProtection(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get('origin')?.replace(/\/$/, '');
  if (origin && !allowedOrigins().includes(origin)) {
    return res.status(403).json({ error: 'Request origin is not allowed' });
  }

  // Cookie-authenticated state changes must carry a browser Origin header.
  // Non-browser integrations should use a separate, explicitly authenticated API.
  const hasAuthCookie = Boolean(req.cookies?.accessToken || req.cookies?.refreshToken);
  if (!origin && hasAuthCookie) {
    return res.status(403).json({ error: 'Origin header required for cookie-authenticated requests' });
  }

  return next();
}

export function cronProtection(req, res, next) {
  const secret = process.env.CRON_SECRET;
  const authorization = req.get('authorization');
  if (!secret || authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}
