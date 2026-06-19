// ========================================
// 慢慢来 — 类型定义
// ========================================

/** 任务分类 */
export type TaskCategory = 'health' | 'life' | 'social' | 'safety' | 'basics';

/** 手机模拟图元素 */
export type MockupElement =
  | { type: 'text'; text: string; size?: 'sm' | 'md' }
  | { type: 'button'; label: string; color?: 'green' | 'blue' | 'orange'; primary?: boolean }
  | { type: 'input'; placeholder: string }
  | { type: 'list'; items: string[] }
  | { type: 'card'; title: string; subtitle?: string }
  | { type: 'icon-grid'; icons: { icon: string; label: string }[] }
  | { type: 'highlight-box'; text: string; color: 'red' | 'orange' };

/** 步骤手机模拟图 */
export interface StepMockup {
  appName: string;
  highlightLabel?: string;
  elements: MockupElement[];
}

/** 任务步骤 */
export interface TaskStep {
  title: string;
  detail: string;
  tip?: string;
  warning?: string;
  mockup: StepMockup;
  videoUrl?: string; // Bilibili 或 MP4 视频链接
}

/** 数字生活任务 */
export interface Task {
  id: string;
  title: string;
  description: string;
  icon: import('../components/Icon').IconName;
  iconBg?: string;
  category: TaskCategory;
  steps: TaskStep[];
  systemPrompt: string;
  premium?: boolean;    // 高级任务（需会员）
  isCustom?: boolean;   // 用户自定义任务
}

/** 聊天消息 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  riskLevel?: RiskLevel;
}

/** 风险等级 */
export type RiskLevel = 'info' | 'warning' | 'danger';

/** 字号档位 */
export type FontSize = 'normal' | 'large' | 'xlarge';

/** 学习进度状态 */
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

/** 单任务学习进度 */
export interface TaskProgress {
  taskId: string;
  status: ProgressStatus;
  completedSteps: number;
  totalSteps: number;
  lastChatAt: number | null;
}

/** 全局应用状态 */
export interface AppState {
  /** 按任务ID索引的聊天记录 */
  chatHistories: Record<string, ChatMessage[]>;
  /** 学习进度 */
  progress: Record<string, TaskProgress>;
  /** DeepSeek API Key */
  apiKey: string | null;
  /** 当前活跃的聊天任务ID（自由模式为 'free'） */
  activeChatId: string | null;
  /** 字号档位 */
  fontSize: FontSize;
  /** 是否为高级会员 */
  isMember: boolean;
  /** 会员过期时间 */
  memberExpiry: number | null;
  /** 用户自定义任务 */
  customTasks: Task[];
  /** 线下帮助预约次数 */
  helpBookingsUsed: number;
}

/** App Actions */
export type AppAction =
  | { type: 'ADD_MESSAGE'; chatId: string; message: ChatMessage }
  | { type: 'CLEAR_CHAT'; chatId: string }
  | { type: 'UPDATE_PROGRESS'; taskId: string; progress: Partial<TaskProgress> }
  | { type: 'SET_API_KEY'; apiKey: string }
  | { type: 'SET_ACTIVE_CHAT'; chatId: string | null }
  | { type: 'SET_FONT_SIZE'; fontSize: FontSize }
  | { type: 'SET_MEMBER'; isMember: boolean; expiry: number | null }
  | { type: 'ADD_CUSTOM_TASK'; task: Task }
  | { type: 'REMOVE_CUSTOM_TASK'; taskId: string }
  | { type: 'USE_HELP_BOOKING' }
  | { type: 'INIT_STATE'; state: Partial<AppState> };
