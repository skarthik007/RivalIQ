import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'http'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-claude-dev',
        configureServer(server) {
          server.middlewares.use('/api/claude', (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
            const chunks: Buffer[] = []
            req.on('data', (c: Buffer) => chunks.push(c))
            req.on('end', async () => {
              try {
                const apiKey = env.ANTHROPIC_API_KEY
                if (!apiKey || apiKey === 'your_api_key_here') {
                  res.statusCode = 500
                  res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set in .env' }))
                  return
                }
                const upstream = await fetch('https://api.anthropic.com/v1/messages', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                  },
                  body: Buffer.concat(chunks).toString(),
                })
                const data = await upstream.json()
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = upstream.status
                res.end(JSON.stringify(data))
              } catch (e) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: String(e) }))
              }
            })
          })
        },
      },
    ],
  }
})
