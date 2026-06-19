import { Task, ProgressStatus } from '../types';
import { useAppState } from '../contexts/AppContext';
import Icon from './Icon';
import styles from './TaskCard.module.css';

interface Props { task: Task; status?: ProgressStatus; onClick?: () => void }

const S: Record<ProgressStatus, { label: string; cls: string }> = {
  not_started: { label: '未开始', cls: styles.statusPending },
  in_progress: { label: '学习中', cls: styles.statusActive },
  completed: { label: '已完成', cls: styles.statusDone },
};

export default function TaskCard({ task, status = 'not_started', onClick }: Props) {
  const { state } = useAppState();
  const s = S[status];
  const locked = task.premium && !state.isMember;

  return (
    <div className={`${styles.card} ${locked ? styles.cardLocked : ''}`} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.iconBox} style={{ background: task.iconBg || 'var(--color-accent-light)' }}>
        <Icon name={task.icon} size={26} color={locked ? 'var(--color-ink-tertiary)' : 'var(--color-accent)'} strokeWidth={1.8} />
      </div>
      <div className={styles.body}>
        <div className={styles.title}>
          {task.title}
          {task.premium && <span className={styles.premiumTag}>🔒</span>}
          {task.isCustom && <span className={styles.customTag}>自定义</span>}
        </div>
        <div className={styles.desc}>{task.description}</div>
      </div>
      <span className={`${styles.status} ${s.cls}`}>{locked ? '高级' : s.label}</span>
    </div>
  );
}
