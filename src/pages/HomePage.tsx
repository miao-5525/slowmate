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
  'linear-gradient(135deg,#F2E0D0,#E8C8B0)','linear-gradient(135deg,#D0E2F0,#A8C8E0)',
  'linear-gradient(135deg,#D0ECD8,#A0D8B0)','linear-gradient(135deg,#F0D8E8,#E0B0D0)',
];

function getOrCreate(key: string, gen: () => string): string {
  let val = localStorage.getItem(key);
  if (!val) { val = gen(); localStorage.setItem(key, val); }
  return val;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return '夜深了，早点休息';
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

  const completedCount = useMemo(() =>
    Object.values(progressMap).filter(p => p.status === 'completed').length,
    [progressMap]
  );
  const inProgressCount = useMemo(() =>
    Object.values(progressMap).filter(p => p.status === 'in_progress').length,
    [progressMap]
  );

  const activeTasks = useMemo(() =>
    allTasks.filter(t => progressMap[t.id]?.status === 'in_progress').slice(0, 3),
    [progressMap]
  );

  const recommended = useMemo(() =>
    allTasks.filter(t => !t.premium && progressMap[t.id]?.status === 'not_started').slice(0, 3),
    [progressMap]
  );

  return (
    <div className={styles.page}>
      {/* Hero Card */}
      <div className={styles.hero} style={{background:GRADIENTS[gradientIdx]}}>
        <div className={styles.heroTop}>
          <div className={styles.heroText}>
            <div className={styles.heroGreeting}>{greeting()}，{userId}</div>
            <div className={styles.heroSub}>慢慢来，每一步都算数</div>
          </div>
          <button className={styles.heroAvatar} onClick={() => nav('/profile')}>
            {userEmoji}
          </button>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>{learningDays}</span>
            <span className={styles.heroStatLabel}>学习天数</span>
          </div>
          <div className={styles.heroDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>{completedCount}</span>
            <span className={styles.heroStatLabel}>已完成</span>
          </div>
          <div className={styles.heroDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>{inProgressCount}</span>
            <span className={styles.heroStatLabel}>进行中</span>
          </div>
        </div>
      </div>

      {/* Main entries */}
      <div className={styles.entries}>
        <button className={`${styles.entryBtn} ${styles.entryLearn}`} onClick={() => nav('/tasks')}>
          <span className={styles.entryIconBox} style={{background:'rgba(200,149,108,.12)'}}>
            <Icon name="book-open" size={28} color="var(--color-accent)" />
          </span>
          <span className={styles.entryContent}>
            <span className={styles.entryTitle}>看教程</span>
            <span className={styles.entryDesc}>{allTasks.length} 个任务包可选</span>
          </span>
          <Icon name="chevron-right" size={20} color="var(--color-ink-tertiary)" />
        </button>
        <button className={`${styles.entryBtn} ${styles.entryChat}`} onClick={() => nav('/chat')}>
          <span className={styles.entryIconBox} style={{background:'rgba(141,175,148,.12)'}}>
            <Icon name="message-circle" size={28} color="var(--color-green)" />
          </span>
          <span className={styles.entryContent}>
            <span className={styles.entryTitle}>问 AI 陪练</span>
            <span className={styles.entryDesc}>自由对话，想问就问</span>
          </span>
          <Icon name="chevron-right" size={20} color="var(--color-ink-tertiary)" />
        </button>
      </div>

      {/* Continue learning */}
      {activeTasks.length > 0 && (
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>📌 继续学习</span>
            <span className={styles.sectionAll} onClick={() => nav('/tasks')}>全部 →</span>
          </div>
          {activeTasks.map(t => (
            <TaskCard key={t.id} task={t} status="in_progress" onClick={() => nav(`/task/${t.id}`)} />
          ))}
        </div>
      )}

      {/* Recommended */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>🌟 推荐学习</span>
          <span className={styles.sectionAll} onClick={() => nav('/tasks')}>更多 →</span>
        </div>
        {recommended.map(t => (
          <TaskCard key={t.id} task={t} status="not_started" onClick={() => nav(`/task/${t.id}`)} />
        ))}
      </div>

      {/* Service */}
      <div className={styles.sectionBlock}>
        <button className={styles.serviceBtn} onClick={() => nav('/help-book')}>
          <span className={styles.serviceIconBox}>
            <Icon name="user" size={26} color="var(--color-accent)" />
          </span>
          <span className={styles.entryContent}>
            <span className={styles.entryTitle}>预约人工帮助</span>
            <span className={styles.entryDesc}>志愿者远程指导 · 上门教学 · 社区课程</span>
          </span>
          <Icon name="chevron-right" size={20} color="var(--color-ink-tertiary)" />
        </button>
      </div>
    </div>
  );
}
