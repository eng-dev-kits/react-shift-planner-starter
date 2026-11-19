import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4309);
const host = process.env.HOST || '0.0.0.0';
const assets = new Map([
  ['/', 'public/index.html'],
  ['/index.html', 'public/index.html'],
  ['/styles.css', 'public/styles.css'],
  ['/app.js', 'public/app.js'],
  ['/schedule.mjs', 'src/schedule.mjs'],
]);
const mime = { '.html': 'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.js':'text/javascript; charset=utf-8' };

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', 'http://localhost');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
  if (url.pathname === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control':'no-store' });
    response.end(JSON.stringify({status:'ok', application:'shift-planner-starter'}));
    return;
  }
  if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405, {Allow: 'GET, HEAD'}); response.end('Method Not Allowed'); return; }
  const relative = assets.get(url.pathname);
  if (!relative) { response.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); response.end('Not Found'); return; }
  try {
    const buffer = await fs.readFile(path.join(root, relative));
    response.writeHead(200, {'Content-Type': mime[path.extname(relative)] || 'application/octet-stream', 'Cache-Control': 'no-cache'});
    response.end(request.method==='HEAD' ? undefined : buffer);
  } catch {
    response.writeHead(500); response.end('Internal Server Error');
  }
});
server.listen(port, host, () => console.log(`Shift Planner Starter running at http://127.0.0.1:${port}`));
