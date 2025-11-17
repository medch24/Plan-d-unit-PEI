import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import handler from './api/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 5000;

const server = createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Handle API routes
  if (req.url.startsWith('/api/')) {
    return handler(req, res);
  }
  
  // Handle static files
  let filePath = req.url === '/' ? '/public/index.html' : `/public${req.url}`;
  filePath = join(__dirname, filePath);
  
  if (existsSync(filePath)) {
    const ext = filePath.split('.').pop();
    const contentTypes = {
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      'png': 'image/png'
    };
    
    res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
    res.end(readFileSync(filePath));
  } else {
    // Fallback to index.html for SPA routing
    res.setHeader('Content-Type', 'text/html');
    res.end(readFileSync(join(__dirname, 'public', 'index.html')));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
