import crypto from 'node:crypto';

export const COOKIE_NAME = 'resume_access';

// How long a successful unlock lasts before the password is asked for again.
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

const sha256 = (value) => crypto.createHash('sha256').update(String(value)).digest();

const sign = (value, secret) =>
  crypto.createHmac('sha256', secret).update(value).digest('base64url');

/**
 * Compare two secrets without leaking their contents through timing.
 * Both sides are hashed first so timingSafeEqual always sees equal-length buffers
 * (it throws otherwise, which would itself leak the length).
 */
export function secretsMatch(candidate, expected) {
  if (typeof candidate !== 'string' || typeof expected !== 'string' || !expected) {
    return false;
  }
  return crypto.timingSafeEqual(sha256(candidate), sha256(expected));
}

/** Token is `<expiry>.<hmac(expiry)>` — self-contained, so there is no session store. */
export function createSessionToken(secret, ttlSeconds = SESSION_TTL_SECONDS) {
  const expiresAt = String(Date.now() + ttlSeconds * 1000);
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function verifySessionToken(token, secret) {
  if (typeof token !== 'string' || !secret) return false;

  const separator = token.lastIndexOf('.');
  if (separator < 1) return false;

  const expiresAt = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < Date.now()) return false;

  const expected = sign(expiresAt, secret);
  if (signature.length !== expected.length) return false;

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    if (part.slice(0, index).trim() === name) {
      return decodeURIComponent(part.slice(index + 1).trim());
    }
  }
  return null;
}

export function buildSessionCookie(token, { secure = true, maxAge = SESSION_TTL_SECONDS } = {}) {
  const attributes = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (secure) attributes.push('Secure');
  return attributes.join('; ');
}
