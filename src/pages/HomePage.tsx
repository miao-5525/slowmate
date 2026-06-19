import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import TaskCard from '../components/TaskCard';
import Icon from '../components/Icon';
import TASKS from '../data/tasks';
import styles from './HomePage.module.css';

const ID_KEY = 'manmanlai_user_id';
const EMOJI_KEY = 'manmanlai_user_emoji';
const DAYS_KEY = 'manmanlai_user_days';
const EMOJIS = ['🐼','🐱','🌸','🐢','🐶','🦊','🐨','🐵'];
const GRADIENTS = [
  'linear-gradient(135deg,#FFE0D0,#FFC0A0)','linear-gradient(135deg,#D0E8FF,#A0C8FF)',
  'linear-gradient(135deg,#D0FFD8,#A0E8B0)','linear-gradient(135deg,#FFD0F0,#FFA0D0)',
  'linear-gradient(135deg,#FFF0D0,#FFE0A0)','linear-gradient(135deg,#D0F0FF,#A0D8FF)',
];

function getOrCreate(key: string, gen: () => string): string {
  let val = localStorage.getItem(key);
  if (!val) { val = gen(); localStorage.setItem(key, val); }
  return val;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return '夜深了';
  if (h < 9) return '早上好';
  if (h < 12) return '上午好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

export default function HomePage() {
  const nav = useNavigate();
  const { progressMap } = useProgress();
  const allTasks = [...TASKS];

  const userId = useMemo(() => getOrCreate(ID_KEY, () => `慢友 ${String(Math.floor(1000+Math.random()*9000))}`), []);
  const userEmoji = useMemo(() => getOrCreate(EMOJI_KEY, () => EMOJIS[Math.floor(Math.random()*EMOJIS.length)]), []);
  const gradientIdx = useMemo(() => userId.charCodeAt(userId.length-1) % GRADIENTS.length, [userId]);
  const learningDays = useMemo(() => {
    const saved = parseInt(localStorage.getItem(DAYS_KEY)||'0',10);
    const last = localStorage.getItem('manmanlai_last_date');
    const today = new Date().toDateString();
    if (last !== today) { localStorage.setItem(DAYS_KEY,String(saved+1)); localStorage.setItem('manmanlai_last_date',today); return saved+1; }
    return saved;
  }, []);

  const activeTasks = useMemo(() =>
    allTasks.filter(t => progressMap[t.id]?.status === 'in_progress').slice(0, 2),
    [progressMap]
  );

  const recommended = useMemo(() =>
    allTasks.filter(t => !t.premium && progressMap[t.id]?.status === 'not_started').slice(0, 2),
    [progressMap]
  );

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.greetingBlock}>
          <div className={styles.greeting}>{greeting()}，{userId}</div>
          <div className={styles.greetingSub}>已坚持学习 <strong>{learningDays}</strong> 天</div>
        </div>
        <button className={styles.avatarSm} style={{background:GRADIENTS[gradientIdx]}} onClick={() => nav('/profile')}>
          {userEmoji}
        </button>
      </div>

      {/* Main entries */}
      <div className={styles.mainEntry}>
        <button className={`${styles.entryCard} ${styles.entryLearn}`} onClick={() => nav('/tasks')}>
          <div className={styles.entryIcon}><Icon name="book-open" size={32} color="var(--color-accent)" /></div>
          <span className={styles.entryLabel}>看教程</span>
          <span className={styles.entryHint}>{allTasks.length} 个任务可选</span>
        </button>
        <button className={`${styles.entryCard} ${styles.entryChat}`} onClick={() => nav('/chat')}>
          <div className={styles.entryIcon}><Icon name="message-circle" size={32} color="var(--color-green)" /></div>
          <span className={styles.entryLabel}>问AI陪练</span>
          <span className={styles.entryHint}>自由对话练习</span>
        </button>
      </div>

      {/* Continue learning */}
      {activeTasks.length > 0 && (
        <>
          <div className={styles.section}>
            <span className={styles.sectionTitle}>📌 继续学习</span>
            <span className={styles.sectionMore} onClick={() => nav('/tasks')}>全部 →</span>
          </div>
          <div className={styles.taskList}>
            {activeTasks.map(t => (
              <TaskCard key={t.id} task={t} status="in_progress" onClick={() => nav(`/task/${t.id}`)} />
            ))}
          </div>
        </>
      )}

      {/* Recommended */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>🌟 推荐学习</span>
        <span className={styles.sectionMore} onClick={() => nav('/tasks')}>更多 →</span>
      </div>
      <div className={styles.taskList}>
        {recommended.map(t => (
          <TaskCard key={t.id} task={t} status="not_started" onClick={() => nav(`/task/${t.id}`)} />
        ))}
      </div>

      {/* Service entry */}
      <button className={styles.serviceCard} onClick={() => nav('/help-book')}>
        <span className={styles.serviceIcon}>🎓</span>
        <div className={styles.serviceText}>
          <div className={styles.serviceLabel}>预约人工帮助</div>
          <div className={styles.serviceHint}>志愿者远程/上门/社区课程</div>
        </div>
        <Icon name="chevron-right" size={22} color="var(--color-ink-tertiary)" />
      </button>

      {/* Emergency */}
      <div className={styles.safetyBar}>
        <button className={styles.safetyBtn} onClick={() => window.location.href = 'tel:110'}>
          🆘 紧急求助
        </button>
      </div>
    </div>
  );
}
