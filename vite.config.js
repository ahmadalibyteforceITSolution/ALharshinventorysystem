import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// Vite middleware plugin to execute /api/* serverless routes locally during development
function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const urlObj = new URL(req.url, 'http://localhost');
        const pathname = urlObj.pathname;
        const routeName = pathname.replace('/api/', '').split('?')[0];

        try {
          // Parse request body for POST/PUT
          let body = {};
          if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const dataStr = Buffer.concat(buffers).toString();
            if (dataStr) {
              try {
                body = JSON.parse(dataStr);
              } catch (e) {
                body = dataStr;
              }
            }
          }

          // Enhance req and res to match Vercel Serverless Function signature
          req.query = Object.fromEntries(urlObj.searchParams);
          req.body = body;

          res.status = function(code) {
            this.statusCode = code;
            return this;
          };

          res.json = function(data) {
            this.setHeader('Content-Type', 'application/json');
            this.end(JSON.stringify(data));
            return this;
          };

          // Dynamically import handler
          const modulePath = `./api/${routeName}.js`;
          const mod = await import(modulePath);
          if (mod && mod.default) {
            await mod.default(req, res);
          } else {
            res.status(404).json({ error: `API route ${pathname} not found` });
          }
        } catch (error) {
          console.error(`API Error [${req.method} ${pathname}]:`, error);
          res.status(500).json({ error: error.message });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    vue(),
    apiDevServerPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
