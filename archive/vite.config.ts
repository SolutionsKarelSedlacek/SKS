import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { promises as fs } from 'fs'
import path from 'path'

// https://vite.dev/config/
// IMPORTANT: replace "anon-event" below with your actual GitHub repo name.
// If you're deploying to a user/org page (username.github.io), set base to "/".
export default defineConfig({
  plugins: [
    react(),
    // dev-only plugin to persist edited leaves.json from the Admin UI
    {
      name: 'dev-save-leaves',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          try {
            const url = req.url || '';
            // accept requests both with and without the base prefix
            const paths = ['/__admin/save-leaves', '/anon-event/__admin/save-leaves'];
            if (req.method === 'POST' && paths.includes(url)) {
              let body = '';
              req.on('data', (chunk) => (body += chunk));
              req.on('end', async () => {
                try {
                  const json = JSON.parse(body || '{}');
                  const out = path.resolve(process.cwd(), 'public', 'data', 'leaves.json');
                  await fs.writeFile(out, JSON.stringify(json, null, 2), 'utf-8');
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: true, path: out }));
                } catch (err) {
                  res.statusCode = 500;
                  res.end(String(err));
                }
              });
              return;
            }
          } catch (e) {
            // ignore and pass through
          }
          next();
        });
      },
    },
  ],
  base: '/anon-event/',
})
