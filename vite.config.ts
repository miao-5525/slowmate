import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 加载 .env 中的 DEEPSEEK_API_KEY（服务端，不暴露到前端）
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.DEEPSEEK_API_KEY || ''

  if (!apiKey) {
    console.warn('⚠️  未配置 DEEPSEEK_API_KEY，AI 陪练将使用模拟模式。')
    console.warn('   请在项目根目录创建 .env 文件，写入: DEEPSEEK_API_KEY=sk-xxx')
  } else {
    console.log('✅ DeepSeek API Key 已配置，AI 陪练可用')
  }

  return {
    plugins: [react()],
    base: './',
    build: { outDir: 'docs' },
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api/deepseek': {
          target: 'https://api.deepseek.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // 服务端注入 API Key，浏览器端无需传
              if (apiKey) {
                proxyReq.setHeader('Authorization', `Bearer ${apiKey}`)
              }
            })
          },
        },
      },
    },
  }
})
