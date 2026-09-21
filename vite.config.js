import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import {
  COOKIE_NAME,
  buildSessionCookie,
  createSessionToken,
  readCookie,
  secretsMatch,
  verifySessionToken,
} from './lib/auth.js'

const RESUME_PATH = '/Neiv_Gupta_Resume.pdf'
const UNLOCK_PATH = '/api/resume-access'

/**
 * Mirrors middleware.js + api/resume-access.js during `vite dev`, which runs
 * neither. Shares lib/auth.js with production so the two cannot drift apart.
 */
function resumeGateDev(env) {
  const password = process.env.RESUME_PASSWORD ?? env.RESUME_PASSWORD
  const secret = process.env.RESUME_AUTH_SECRET ?? env.RESUME_AUTH_SECRET

  return {
    name: 'resume-gate-dev',
    apply: 'serve',
    configureServer(server) {
      if (!password || !secret) {
        server.config.logger.warn(
          '[resume-gate] RESUME_PASSWORD / RESUME_AUTH_SECRET not set — resume is UNLOCKED locally.'
        )
        return
      }

      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? '/').split('?')[0]

        if (path === UNLOCK_PATH) {
          if (req.method !== 'POST') {
            res.statusCode = 405
            return res.end(JSON.stringify({ error: 'Method not allowed' }))
          }

          const chunks = []
          for await (const chunk of req) chunks.push(chunk)

          let submitted = ''
          try {
            submitted = JSON.parse(Buffer.concat(chunks).toString()).password ?? ''
          } catch {
            submitted = ''
          }

          await new Promise((resolve) => setTimeout(resolve, 500))
          res.setHeader('Content-Type', 'application/json')

          if (!secretsMatch(submitted, password)) {
            res.statusCode = 401
            return res.end(JSON.stringify({ error: 'Incorrect password.' }))
          }

          res.setHeader(
            'Set-Cookie',
            buildSessionCookie(createSessionToken(secret), { secure: false })
          )
          return res.end(JSON.stringify({ ok: true }))
        }

        if (path !== RESUME_PATH) return next()

        const token = readCookie(req.headers.cookie, COOKIE_NAME)
        if (verifySessionToken(token, secret)) return next()

        // Same as the production middleware: pretend the file isn't there.
        res.statusCode = 307
        res.setHeader('Location', '/404')
        return res.end()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), resumeGateDev(env)],
    build: {
      rollupOptions: {
        // 404.html is served by Vercel for any unmatched path (with a 404 status).
        input: {
          main: new URL('./index.html', import.meta.url).pathname,
          notFound: new URL('./404.html', import.meta.url).pathname,
        },
      },
    },
  }
})
