/**
 * Vercel Serverless Function: DeepSeek API 代理
 *
 * 路径: /api/deepseek/* → 转发到 api.deepseek.com
 * API Key 通过 Vercel 环境变量 DEEPSEEK_API_KEY 配置，浏览器不接触
 */
export default async function handler(req, res) {
  // CORS 预检
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY || '';

  // 从 URL 中提取 DeepSeek API 路径
  // /api/deepseek/v1/chat/completions → /v1/chat/completions
  const apiPath = req.url.replace(/^\/api\/deepseek/, '');

  try {
    const response = await fetch(`https://api.deepseek.com${apiPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey ? `Bearer ${apiKey}` : '',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: { message: `代理错误: ${err.message}` } });
  }
}
