import { useCallback } from 'react';
import { useAppState } from '../contexts/AppContext';
import TASKS from '../data/tasks';

/**
 * 学习进度管理 Hook
 */
export function useProgress() {
  const { state, dispatch } = useAppState();

  const progressMap = state.progress;

  /** 开始学习某个任务 */
  const startTask = useCallback(
    (taskId: string) => {
      const task = TASKS.find((t) => t.id === taskId) || state.customTasks.find(t => t.id === taskId);
      if (!task) return;

      dispatch({
        type: 'UPDATE_PROGRESS',
        taskId,
        progress: {
          status: 'in_progress',
          lastChatAt: Date.now(),
          totalSteps: task.steps.length,
        },
      });
    },
    [dispatch, state.customTasks],
  );

  /** 完成某个步骤 */
  const completeStep = useCallback(
    (taskId: string) => {
      const current = progressMap[taskId];
      if (!current || current.status === 'not_started') return;

      const newCompleted = Math.min(current.completedSteps + 1, current.totalSteps);
      const newStatus = newCompleted >= current.totalSteps ? 'completed' as const : 'in_progress' as const;

      dispatch({
        type: 'UPDATE_PROGRESS',
        taskId,
        progress: {
          completedSteps: newCompleted,
          status: newStatus,
          lastChatAt: Date.now(),
        },
      });
    },
    [dispatch, progressMap],
  );

  /** 标记任务完成 */
  const completeTask = useCallback(
    (taskId: string) => {
      const current = progressMap[taskId];
      if (!current) return;

      dispatch({
        type: 'UPDATE_PROGRESS',
        taskId,
        progress: {
          status: 'completed',
          completedSteps: current.totalSteps,
          lastChatAt: Date.now(),
        },
      });
    },
    [dispatch, progressMap],
  );

  /** 获取总体统计 */
  const getStats = useCallback(() => {
    const all = Object.values(progressMap);
    const completed = all.filter((p) => p.status === 'completed').length;
    const inProgress = all.filter((p) => p.status === 'in_progress').length;
    const notStarted = all.filter((p) => p.status === 'not_started').length;
    return { total: all.length, completed, inProgress, notStarted };
  }, [progressMap]);

  return {
    progressMap,
    startTask,
    completeStep,
    completeTask,
    getStats,
  };
}
