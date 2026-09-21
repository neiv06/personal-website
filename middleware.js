import { next } from '@vercel/functions';
import { COOKIE_NAME, readCookie, verifySessionToken } from './lib/auth.js';

export const config = {
  // Node runtime so we can use node:crypto for the HMAC check.
  runtime: 'nodejs',
  // Only the resume is protected — the rest of the portfolio stays public.
  matcher: '/Neiv_Gupta_Resume.pdf',
};

export default function middleware(request) {
  const secret = process.env.RESUME_AUTH_SECRET;
  const token = readCookie(request.headers.get('cookie'), COOKIE_NAME);

  if (secret && verifySessionToken(token, secret)) {
    return next();
  }

  // Without a valid unlock cookie the file simply looks absent: /404 has no
  // matching file, so Vercel serves 404.html with a real 404 status.
  return Response.redirect(new URL('/404', request.url), 307);
}
