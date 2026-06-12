import { ChatMessage } from '../types';
import styles from './ChatBubble.module.css';

interface Props {
  message: ChatMessage;
}

const RISK_TAGS: Record<string, { label: string; className: string }> = {
  danger: { label: '⚠️ 高风险提醒', className: styles.riskDanger },
  warning: { label: '⚡ 注意', className: styles.riskWarning },
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function ChatBubble({ message }: Props) {
  const { role, content, riskLevel, timestamp } = message;

  const riskTag = riskLevel ? RISK_TAGS[riskLevel] : null;

  const bubbleClass = [
    styles.bubble,
    styles[role],
    riskLevel ? styles[riskLevel] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper} style={{ alignItems: role === 'user' ? 'flex-end' : role === 'system' ? 'center' : 'flex-start' }}>
      {riskTag && (
        <span className={`${styles.riskTag} ${riskTag.className}`}>
          {riskTag.label}
        </span>
      )}
      <div className={bubbleClass}>
        {content}
      </div>
      <span className={styles.time}>{formatTime(timestamp)}</span>
    </div>
  );
}
