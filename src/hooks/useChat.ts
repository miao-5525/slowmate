import { useCallback } from 'react';
import { useAppState } from '../contexts/AppContext';
import { ChatMessage } from '../types';

/** 生成唯一ID */
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * 聊天逻辑 Hook
 * 管理消息发送、接收和风险检测
 */
export function useChat(chatId: string) {
  const { state, dispatch } = useAppState();

  const messages = state.chatHistories[chatId] ?? [];

  /** 添加消息 */
  const addMessage = useCallback(
    (role: 'user' | 'assistant' | 'system', content: string) => {
      const message: ChatMessage = {
        id: uid(),
        role,
        content,
        timestamp: Date.now(),
        riskLevel: detectRisk(content),
      };
      dispatch({ type: 'ADD_MESSAGE', chatId, message });
      return message;
    },
    [dispatch, chatId],
  );

  /** 清空聊天 */
  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT', chatId });
  }, [dispatch, chatId]);

  /** 获取发送给 AI 的消息格式 */
  const buildAIMessages = useCallback(
    (systemPrompt: string) => {
      const msgs: { role: string; content: string }[] = [
        { role: 'system', content: systemPrompt },
      ];
      messages.forEach((m) => {
        msgs.push({ role: m.role, content: m.content });
      });
      return msgs;
    },
    [messages],
  );

  return {
    messages,
    addMessage,
    clearChat,
    buildAIMessages,
  };
}

/**
 * 风险关键词检测
 * 返回风险等级，无风险返回 undefined
 */
export function detectRisk(text: string): ChatMessage['riskLevel'] {
  const lower = text.toLowerCase();

  const dangerWords = ['验证码', '密码', '转账', '汇款', '银行卡号', '身份证号', '屏幕共享'];
  const warningWords = ['中奖', '陌生链接', '下载app', '下载软件', '客服', '退款', '公检法', '安全账户', '兼职', '刷单'];

  for (const word of dangerWords) {
    if (lower.includes(word)) return 'danger';
  }
  for (const word of warningWords) {
    if (lower.includes(word)) return 'warning';
  }

  // 检查是否包含网址（短链接、陌生域名等）
  if (/https?:\/\/[^\s]+/.test(lower) && !/weixin|alipay|qq\.com/.test(lower)) {
    return 'warning';
  }

  return undefined;
}
