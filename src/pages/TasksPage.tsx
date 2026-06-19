import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { useAppState } from '../contexts/AppContext';
import TaskCard from '../components/TaskCard';
import TASKS, { CATEGORY_LABELS } from '../data/tasks';
import styles from './TasksPage.module.css';

export default function TasksPage() {
  const nav = useNavigate();
  const { progressMap } = useProgress();
  const { state } = useAppState();
  const [s, setS] = useState('');

  const grouped = useMemo(() => {
    // Merge built-in + custom tasks
    const all = [...TASKS, ...state.customTasks];
    const f = s.trim()
      ? all.filter(t => t.title.includes(s.trim()) || t.description.includes(s.trim()))
      : all;
    const m: Record<string, typeof all> = {};
    f.forEach(t => {
      const cat = t.isCustom ? 'custom' : t.category;
      if (!m[cat]) m[cat] = [];
      m[cat].push(t);
    });
    return m;
  }, [s, state.customTasks]);

  const handleClick = (taskId: string) => {
    const task = [...TASKS, ...state.customTasks].find(t => t.id === taskId);
    if (task?.premium && !state.isMember) {
      nav('/member');
      return;
    }
    nav(`/task/${taskId}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>任务库</div>
        <div className={styles.subtitle}>点一张卡片，先看教程，再找陪练练习</div>
      </div>
      <input className={styles.search} type="text" placeholder="搜一搜想学的内容…" value={s} onChange={e => setS(e.target.value)} />
      {Object.entries(grouped).map(([cat, tasks]) => (
        <div key={cat}>
          <div className={styles.cat}>
            {cat === 'custom' ? '自定义任务' : CATEGORY_LABELS[cat] || cat}
          </div>
          <div className={styles.list}>
            {tasks.map(t => (
              <TaskCard key={t.id} task={t} status={progressMap[t.id]?.status ?? 'not_started'} onClick={() => handleClick(t.id)} />
            ))}
          </div>
        </div>
      ))}
      {s.trim() && Object.keys(grouped).length === 0 && (
        <div style={{textAlign:'center',padding:40,color:'var(--color-ink-tertiary)'}}>没找到相关任务</div>
      )}
    </div>
  );
}
