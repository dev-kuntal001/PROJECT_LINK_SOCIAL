import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest, ApiRequest, ApiResponse } from './src/server/apiHandler';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if ((req as ApiRequest).url && (req as ApiRequest).url!.startsWith('/api')) {
            const handled = await handleApiRequest(req as ApiRequest, res as unknown as ApiResponse);
            if (handled) return;
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
  },
});
