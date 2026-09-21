import {
  buildSessionCookie,
  createSessionToken,
  secretsMatch,
} from '../lib/auth.js';

// Small fixed delay on every attempt — enough to make online guessing tedious
// without being noticeable to someone typing the real password.
const ATTEMPT_DELAY_MS = 500;

const isLocal = (req) => /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(req.headers.host ?? '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const password = process.env.RESUME_PASSWORD;
  const secret = process.env.RESUME_AUTH_SECRET;

  if (!password || !secret) {
    return res.status(503).json({ error: 'Resume access is not configured.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  await new Promise((resolve) => setTimeout(resolve, ATTEMPT_DELAY_MS));

  if (!secretsMatch(body?.password ?? '', password)) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  res.setHeader(
    'Set-Cookie',
    buildSessionCookie(createSessionToken(secret), { secure: !isLocal(req) })
  );
  return res.status(200).json({ ok: true });
}
