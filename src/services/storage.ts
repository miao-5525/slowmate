import { AppState, TaskProgress, ChatMessage } from '../types';

const STORAGE_KEY = 'manmanlai_state';

/** 从 localStorage 加载状态 */
export function loadState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AppState>;
  } catch {
    return null;
  }
}

/** 保存状态到 localStorage */
export function saveState(state: AppState): void {
  try {
    // 只持久化必要数据，不存 activeChatId
    const toSave = {
      chatHistories: state.chatHistories,
      progress: state.progress,
      apiKey: state.apiKey,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    console.warn('localStorage 存储失败，可能是空间不足');
  }
}

/** 获取某个任务的聊天记录 */
export function getChatHistory(chatId: string): ChatMessage[] {
  const state = loadState();
  return state?.chatHistories?.[chatId] ?? [];
}

/** 获取某个任务的学习进度 */
export function getTaskProgress(taskId: string): TaskProgress | null {
  const state = loadState();
  return state?.progress?.[taskId] ?? null;
}

/** 获取所有任务进度 */
export function getAllProgress(): Record<string, TaskProgress> {
  const state = loadState();
  return state?.progress ?? {};
}

/** 获取 API Key */
export function getApiKey(): string | null {
  const state = loadState();
  return state?.apiKey ?? null;
}
