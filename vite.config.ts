import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Runs the Vercel functions in /api during `npm run dev`, so the whole stack
 * (frontend + backend) works locally without the Vercel CLI.
 * Handlers use the Web-standard signature: export function POST(request: Request): Response
 */
function vercelApiDev(): Plugin {
  return {
    name: 'vercel-api-dev',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
        if (!url.pathname.startsWith('/api/')) return next()

        const file = resolve('api', `${url.pathname.slice(5).replace(/\/$/, '')}.ts`)
        if (!file.startsWith(resolve('api')) || /[\\/]_/.test(file.slice(resolve('api').length)) || !existsSync(file)) {
          res.statusCode = 404
          return res.end(JSON.stringify({ error: 'Not found' }))
        }

        try {
          const mod = await server.ssrLoadModule(file)
          const method = (req.method ?? 'GET').toUpperCase()
          const handler = mod[method]
          if (typeof handler !== 'function') {
            res.statusCode = 405
            return res.end(JSON.stringify({ error: 'Method not allowed' }))
          }

          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
          headers.set('x-forwarded-for', req.socket.remoteAddress ?? '127.0.0.1')

          const response: Response = await handler(
            new Request(url, { method, headers, body: ['GET', 'HEAD'].includes(method) ? undefined : Buffer.concat(chunks) }),
          )
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (err) {
          server.ssrFixStacktrace(err as Error)
          console.error(err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal error' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), vercelApiDev()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // three.js is NOT listed here on purpose: grouping it would drag shared deps
        // (e.g. scheduler) into its chunk and force it to load eagerly. It stays lazy.
        manualChunks: { motion: ['framer-motion'] },
      },
    },
  },
})
