/**
 * AI 陪练服务
 *
 * 请求通过服务端代理发送到 DeepSeek API：
 * - 开发环境：Vite proxy（/api/deepseek → api.deepseek.com）
 * - 生产环境：Netlify Function 代理
 *
 * API Key 配置在服务端（.env / Netlify 环境变量），浏览器不接触 Key。
 * 服务端无 Key 时自动降级为模拟回复。
 */

const API_URL = '/api/deepseek/v1/chat/completions';
const MODEL = 'deepseek-chat';

interface AIMessage {
  role: string;
  content: string;
}

export interface AIResponse {
  content: string;
  error?: string;
}

/**
 * 调用 AI（通过服务端代理，无需传 API Key）
 */
export async function chatWithAI(messages: AIMessage[]): Promise<AIResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      // 代理未配置 Key → 降级模拟
      if (response.status === 401 || response.status === 403) {
        return { content: '', error: 'AI 服务未配置，使用模拟陪练' };
      }
      const err = await response.json().catch(() => ({}));
      return { content: '', error: (err as any)?.error?.message ?? `请求失败 (${response.status})` };
    }

    const data = await response.json();
    return { content: data.choices?.[0]?.message?.content ?? '' };
  } catch {
    return { content: '', error: '网络连接失败，切换为模拟陪练' };
  }
}

// ==========================================
// 模拟回复（AI 不可用时的降级方案）
// ==========================================

const MOCK_REPLIES = [
  '您好呀！我是您的数字生活陪练员"小慢" 🐢\n\n别着急，我们一步一步来。您想先学什么呀？',
  '好的，没问题！我们先从第一步开始。您先把手机解锁，找到微信的图标——就是一个绿色的、上面有两个白色小人的图标。找到了吗？',
  '太棒了！👍 您真厉害！\n\n接下来第二步：点开微信后，在屏幕最下面找到"通讯录"三个字。',
  '非常好！✨ 您学得真快！\n\n这一步完成啦。还需要我再讲一遍，还是继续下一步？',
  '嗯，这一步确实容易让人迷糊，没关系的～\n\n我换个方式再说一遍：您看屏幕最上面有没有放大镜图标？点它，然后输入您想找的东西。',
  '⚠️ 等一下！这个我要特别提醒您——如果有人让您告诉对方验证码，千万要小心！\n\n验证码就像您家门的钥匙，绝对不能给别人。',
  '恭喜您！🎉 您已经完成了今天的学习！\n\n今天您学了如何用手机操作，真的非常棒！下次还可以继续找我练习哦～',
];

let mockIndex = 0;

export function getMockReply(): string {
  const reply = MOCK_REPLIES[mockIndex % MOCK_REPLIES.length];
  mockIndex++;
  return reply;
}

export function getMockReplyAsync(): Promise<AIResponse> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ content: getMockReply() }), 600 + Math.random() * 1200);
  });
}
