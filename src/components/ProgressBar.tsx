import styles from './ProgressBar.module.css';

interface Props {
  label: string;
  current: number;
  total: number;
}

export default function ProgressBar({ label, current, total }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const done = pct >= 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.pct}>{pct}%</span>
      </div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${done ? styles.completed : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
