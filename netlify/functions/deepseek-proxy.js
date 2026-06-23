/**
 * Netlify Function: DeepSeek API 代理
 *
 * 接收前端请求，注入服务端 API Key 后转发到 DeepSeek。
 * 浏览器端无需配置任何 Key，打开即用。
 *
 * 部署时在 Netlify 后台设置环境变量: DEEPSEEK_API_KEY
 */

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.DEEPSEEK_API_KEY || '';

  const apiPath = event.path.replace(/^\/api\/deepseek/, '');
  const deepseekUrl = `https://api.deepseek.com${apiPath}`;

  try {
    const response = await fetch(deepseekUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey ? `Bearer ${apiKey}` : '',
      },
      body: event.body,
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: { message: `代理请求失败: ${err.message}` },
      }),
    };
  }
};
