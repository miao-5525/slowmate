import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { AppState, AppAction, ChatMessage, TaskProgress, FontSize } from '../types';
import { loadState, saveState } from '../services/storage';
import TASKS from '../data/tasks';

// ========================================
// 初始状态
// ========================================

function createInitialState(): AppState {
  const saved = loadState();

  // 初始化所有任务进度
  const progress: Record<string, TaskProgress> = {};
  TASKS.forEach((task) => {
    progress[task.id] = saved?.progress?.[task.id] ?? {
      taskId: task.id,
      status: 'not_started',
      completedSteps: 0,
      totalSteps: task.steps.length,
      lastChatAt: null,
    };
  });

  return {
    chatHistories: saved?.chatHistories ?? {},
    progress,
    apiKey: saved?.apiKey ?? null,
    activeChatId: null,
    fontSize: saved?.fontSize ?? 'normal',
  };
}

// ========================================
// Reducer
// ========================================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const { chatId, message } = action;
      const prev = state.chatHistories[chatId] ?? [];
      return {
        ...state,
        chatHistories: {
          ...state.chatHistories,
          [chatId]: [...prev, message],
        },
      };
    }

    case 'CLEAR_CHAT': {
      const { chatId } = action;
      const newHistories = { ...state.chatHistories };
      delete newHistories[chatId];
      return { ...state, chatHistories: newHistories };
    }

    case 'UPDATE_PROGRESS': {
      const { taskId, progress: update } = action;
      const current = state.progress[taskId];
      if (!current) return state;
      const newProgress = {
        ...state.progress,
        [taskId]: { ...current, ...update },
      };
      return { ...state, progress: newProgress };
    }

    case 'SET_API_KEY':
      return { ...state, apiKey: action.apiKey };

    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChatId: action.chatId };

    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.fontSize };

    case 'INIT_STATE':
      return { ...state, ...action.state };

    default:
      return state;
  }
}

// ========================================
// Context
// ========================================

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState);

  // 状态变化时自动保存（debounced）
  useEffect(() => {
    const timer = setTimeout(() => saveState(state), 500);
    return () => clearTimeout(timer);
  }, [state]);

  // 应用字号到 document
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', state.fontSize);
  }, [state.fontSize]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
