import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: env.BASE_PATH || '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
        viteStaticCopy({
          targets: [
            { src: 'favicon.ico', dest: '' },
            { src: 'favicon.svg', dest: '' },
            { src: 'apple-touch-icon.png', dest: '' },
            { src: 'icon-192.png', dest: '' },
            { src: 'icon-512.png', dest: '' },
            { src: 'sw.js', dest: '' },
            { src: 'CNAME', dest: '' },
          ]
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
