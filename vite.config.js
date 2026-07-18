import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // 1. Tell the bundler where your HTML pages are
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'pages/about.html'),
        contact: resolve(__dirname, 'pages/contact.html') // Add more pages here as you grow
      }
    }
  },
  
  // 2. Add a tiny plugin to handle clean URLs in local dev (npm run dev)
  plugins: [
    {
      name: 'clean-urls-dev',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // If the URL doesn't have a file extension (like .css or .html) and isn't the home page
          if (!req.url.includes('.') && req.url !== '/') {
            req.url += '.html'; // Secretly append .html for the server
          }
          next();
        });
      }
    }
  ]
});