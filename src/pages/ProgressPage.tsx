import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import ProgressBar from '../components/ProgressBar';
import Icon from '../components/Icon';
import TASKS from '../data/tasks';
import { ProgressStatus } from '../types';
import styles from './ProgressPage.module.css';

const SD: Record<ProgressStatus, { label: string; cls: string }> = {
  not_started: { label: '未开始', cls: styles.stPending },
  in_progress: { label: '学习中', cls: styles.stActive },
  completed: { label: '已完成', cls: styles.stDone },
};

export default function ProgressPage() {
  const nav = useNavigate();
  const { progressMap, getStats } = useProgress();
  const stats = getStats();

  const items = TASKS.map(t => ({ task: t, prog: progressMap[t.id] }));

  const achievements = useMemo(() => [
    { icon: '🌟', title: '初次尝试', desc: '完成第1个任务', ok: stats.completed >= 1 },
    { icon: '🔥', title: '学习达人', desc: '完成3个任务', ok: stats.completed >= 3 },
    { icon: '🏆', title: '数字生活通', desc: '完成全部8个任务', ok: stats.completed >= 8 },
    { icon: '🛡️', title: '安全意识', desc: '完成防诈骗指南', ok: progressMap['fangzhapian']?.status === 'completed' },
  ], [stats.completed, progressMap]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>学习进度</div>
        <div className={styles.subtitle}>慢慢来，每一步都算数</div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}><div className={styles.statNum}>{stats.total}</div><div className={styles.statLabel}>全部任务</div></div>
        <div className={styles.statCard}><div className={`${styles.statNum} ${styles.statNumDone}`}>{stats.completed}</div><div className={styles.statLabel}>已完成</div></div>
        <div className={styles.statCard}><div className={styles.statNum}>{stats.inProgress}</div><div className={styles.statLabel}>学习中</div></div>
      </div>

      {/* Achievements */}
      <div className={styles.sectionTitle}>学习成就</div>
      <div className={styles.achievements}>
        {achievements.map(a => (
          <div key={a.title} className={`${styles.achCard} ${a.ok ? styles.unlocked : ''}`}>
            <div className={styles.achIcon}>{a.icon}</div>
            <div className={styles.achTitle}>{a.ok ? a.title : '???'}</div>
            <div className={styles.achDesc}>{a.ok ? a.desc : '继续学习解锁'}</div>
          </div>
        ))}
      </div>

      {/* Progress list */}
      <div className={styles.sectionTitle}>任务进度</div>
      <div className={styles.list}>
        {items.map(({ task, prog }) => {
          if (!prog) return null;
          const s = SD[prog.status];
          return (
            <div key={task.id} className={styles.item}>
              <div className={styles.itemHead}>
                <div className={styles.itemIcon}><Icon name={task.icon} size={22} color="var(--color-accent)" /></div>
                <span className={styles.itemTitle}>{task.title}</span>
                <span className={`${styles.itemStatus} ${s.cls}`}>{s.label}</span>
              </div>
              <div className={styles.itemDesc}>{task.description}</div>
              <ProgressBar label="学习进度" current={prog.completedSteps} total={prog.totalSteps} />
              {prog.status !== 'completed' && (
                <button className={styles.continue} onClick={() => nav(`/task/${task.id}`)}>
                  {prog.status === 'in_progress' ? '继续学习 →' : '开始学习 →'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
