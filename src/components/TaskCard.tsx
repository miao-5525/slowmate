import { Task, ProgressStatus } from '../types';
import Icon from './Icon';
import styles from './TaskCard.module.css';

interface Props { task: Task; status?: ProgressStatus; onClick?: () => void }

const S: Record<ProgressStatus, { label: string; cls: string }> = {
  not_started: { label: '未开始', cls: styles.statusPending },
  in_progress: { label: '学习中', cls: styles.statusActive },
  completed: { label: '已完成', cls: styles.statusDone },
};

export default function TaskCard({ task, status = 'not_started', onClick }: Props) {
  const s = S[status];
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.iconBox} style={{ background: task.iconBg || 'var(--color-accent-light)' }}>
        <Icon name={task.icon} size={26} color="var(--color-accent)" strokeWidth={1.8} />
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{task.title}</div>
        <div className={styles.desc}>{task.description}</div>
      </div>
      <span className={`${styles.status} ${s.cls}`}>{s.label}</span>
    </div>
  );
}
