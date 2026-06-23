/**
 * 「慢慢来」生产服务器
 *
 * 功能：
 * 1. 托管前端静态页面（docs/）
 * 2. 代理 DeepSeek API 请求（/api/deepseek → api.deepseek.com）
 * 3. API Key 在服务端注入，浏览器不接触
 *
 * 部署方式：
 *   node server.js
 *   或使用 PM2 / Docker / 阿里云等
 *
 * 环境变量：
 *   DEEPSEEK_API_KEY  - DeepSeek API Key（必填）
 *   PORT              - 服务端口（默认 3000）
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '3000', 10);
const API_KEY = process.env.DEEPSEEK_API_KEY || '';
const STATIC_DIR = path.join(__dirname, 'docs');

// MIME 类型
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

/** 读取静态文件 */
function serveStatic(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    return { data, contentType: MIME[ext] || 'application/octet-stream' };
  } catch {
    return null;
  }
}

/** 代理 DeepSeek API 请求 */
function proxyDeepSeek(req, res, body) {
  const apiPath = req.url.replace(/^\/api\/deepseek/, '');

  const options = {
    hostname: 'api.deepseek.com',
    port: 443,
    path: apiPath,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { message: `代理错误: ${err.message}` } }));
  });

  proxyReq.write(body);
  proxyReq.end();
}

// 需要 https 模块
import https from 'node:https';

// 读取请求 body
function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });
}

// ====== 启动服务器 ======
const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // ---- API 代理 ----
  if (req.url.startsWith('/api/deepseek')) {
    if (!API_KEY) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: { message: 'AI 服务未配置' } }));
    }
    const body = await readBody(req);
    return proxyDeepSeek(req, res, body);
  }

  // ---- 静态文件 ----
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(STATIC_DIR, urlPath);

  // 安全：防止目录穿越
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  const file = serveStatic(filePath);
  if (file) {
    res.writeHead(200, { 'Content-Type': file.contentType });
    return res.end(file.data);
  }

  // SPA fallback：非 API 请求都返回 index.html
  const indexFile = serveStatic(path.join(STATIC_DIR, 'index.html'));
  if (indexFile) {
    res.writeHead(200, { 'Content-Type': indexFile.contentType });
    return res.end(indexFile.data);
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🐢 慢慢来 — 服务器已启动`);
  console.log(`   地址: http://0.0.0.0:${PORT}`);
  console.log(`   AI 状态: ${API_KEY ? '✅ 已配置' : '⚠️  未配置 DEEPSEEK_API_KEY'}\n`);
});
