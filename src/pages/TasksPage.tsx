import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import TaskCard from '../components/TaskCard';
import TASKS, { CATEGORY_LABELS } from '../data/tasks';
import styles from './TasksPage.module.css';

export default function TasksPage() {
  const nav = useNavigate();
  const { progressMap } = useProgress();
  const [s, setS] = useState('');

  const grouped = useMemo(() => {
    const f = s.trim() ? TASKS.filter(t => t.title.includes(s.trim()) || t.description.includes(s.trim())) : TASKS;
    const m: Record<string, typeof TASKS> = {};
    f.forEach(t => { if (!m[t.category]) m[t.category] = []; m[t.category].push(t) });
    return m;
  }, [s]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>任务库</div>
        <div className={styles.subtitle}>点一张卡片，先看教程，再找陪练练习</div>
      </div>
      <input className={styles.search} type="text" placeholder="搜一搜想学的内容…" value={s} onChange={e => setS(e.target.value)} />
      {Object.entries(grouped).map(([cat, tasks]) => (
        <div key={cat}>
          <div className={styles.cat}>{CATEGORY_LABELS[cat] || cat}</div>
          <div className={styles.list}>
            {tasks.map(t => (
              <TaskCard key={t.id} task={t} status={progressMap[t.id]?.status ?? 'not_started'} onClick={() => nav(`/task/${t.id}`)} />
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
