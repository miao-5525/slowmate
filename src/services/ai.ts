/**
 * DeepSeek API 调用服务
 * API 兼容 OpenAI 格式
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
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
 * 调用 DeepSeek Chat API
 */
export async function chatWithDeepSeek(
  messages: AIMessage[],
  apiKey: string,
): Promise<AIResponse> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = (err as any)?.error?.message ?? `请求失败 (${response.status})`;
      return { content: '', error: msg };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    return { content };
  } catch (err: any) {
    return { content: '', error: err.message ?? '网络连接失败，请检查网络后重试' };
  }
}

/**
 * 无 API Key 时的模拟回复
 * 让 MVP 在没有 Key 的情况下也能跑通完整交互流程
 */
const MOCK_REPLIES = [
  '您好呀！我是您的数字生活陪练员"小慢" 🐢\n\n别着急，我们一步一步来。您想先学什么呀？',
  '好的，没问题！我们先从第一步开始。您先把手机解锁，找到微信的图标——就是一个绿色的、上面有两个白色小人的图标。找到了吗？',
  '太棒了！👍 您真厉害！\n\n接下来第二步：点开微信后，在屏幕最下面找到"通讯录"三个字，点一下。看到了吗？',
  '好的！现在您已经进了通讯录。\n\n别着急，我们慢慢来～您看到了什么？如果有什么弹出的消息或者广告，不用管它，我们只找我们需要的。',
  '非常好！✨ 您学得真快！\n\n这一步完成啦。您还需要我再讲一遍刚才的操作吗？还是我们继续下一步？',
  '嗯，这一步确实容易让人迷糊，没关系的～\n\n我换个方式再说一遍：您看屏幕最上面是不是有一个像放大镜一样的图标？点它，然后直接打字输入您想找的东西。试试看？',
  '⚠️ 等一下！这个我要特别提醒您——如果有人发链接让您点，或者让您告诉对方验证码，千万要小心！\n\n验证码就像您家门的钥匙，不能给别人哦。',
  '恭喜您！🎉 您已经完成了今天的学习！\n\n今天您学了如何用手机操作，真的非常棒！下次还可以继续找我练习哦。慢慢来，每天学一点，您会越来越熟练的～',
];

let mockIndex = 0;

export function getMockReply(): string {
  const reply = MOCK_REPLIES[mockIndex % MOCK_REPLIES.length];
  mockIndex++;
  return reply;
}

/**
 * 模拟网络延迟后返回回复
 */
export function getMockReplyAsync(): Promise<AIResponse> {
  return new Promise((resolve) => {
    const delay = 600 + Math.random() * 1200; // 0.6~1.8秒
    setTimeout(() => {
      resolve({ content: getMockReply() });
    }, delay);
  });
}
