import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { useAppState } from '../contexts/AppContext';
import ProgressBar from '../components/ProgressBar';
import Icon from '../components/Icon';
import TASKS from '../data/tasks';
import { ProgressStatus } from '../types';
import styles from './ProfilePage.module.css';

const ID_KEY = 'manmanlai_user_id';
const EMOJI_KEY = 'manmanlai_user_emoji';
const DAYS_KEY = 'manmanlai_user_days';

const EMOJIS = ['🐼','🐱','🌸','🐢','🐶','🦊','🐨','🐵','🦁','🐰','🐸','🐙','🐤','🦉','🐳'];
const GRADIENTS = [
  'linear-gradient(135deg,#FFE0D0,#FFC0A0)',
  'linear-gradient(135deg,#D0E8FF,#A0C8FF)',
  'linear-gradient(135deg,#D0FFD8,#A0E8B0)',
  'linear-gradient(135deg,#FFD0F0,#FFA0D0)',
  'linear-gradient(135deg,#FFF0D0,#FFE0A0)',
  'linear-gradient(135deg,#D0F0FF,#A0D8FF)',
];

function getOrCreate(key: string, gen: () => string): string {
  let val = localStorage.getItem(key);
  if (!val) { val = gen(); localStorage.setItem(key, val); }
  return val;
}

const SD: Record<ProgressStatus, { label: string; cls: string }> = {
  not_started: { label: '未开始', cls: styles.stPending },
  in_progress: { label: '学习中', cls: styles.stActive },
  completed: { label: '已完成', cls: styles.stDone },
};

export default function ProfilePage() {
  const nav = useNavigate();
  const { progressMap, getStats } = useProgress();
  const { state, dispatch } = useAppState();
  const stats = getStats();

  const [showKey, setShowKey] = useState(false);
  const [keyInput, setKeyInput] = useState(state.apiKey ?? '');

  // Auto-generated identity
  const userId = useMemo(() => getOrCreate(ID_KEY, () => `慢友 ${String(Math.floor(1000 + Math.random() * 9000))}`), []);
  const userEmoji = useMemo(() => getOrCreate(EMOJI_KEY, () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]), []);
  const gradientIdx = useMemo(() => userId.charCodeAt(userId.length - 1) % GRADIENTS.length, [userId]);

  // Track learning days
  const learningDays = useMemo(() => {
    const saved = parseInt(localStorage.getItem(DAYS_KEY) || '0', 10);
    const lastDate = localStorage.getItem('manmanlai_last_date');
    const today = new Date().toDateString();
    if (lastDate !== today) {
      localStorage.setItem(DAYS_KEY, String(saved + 1));
      localStorage.setItem('manmanlai_last_date', today);
      return saved + 1;
    }
    return saved;
  }, []);

  const items = TASKS.map(t => ({ task: t, prog: progressMap[t.id] }));

  const achievements = useMemo(() => [
    { icon: '🌟', title: '初次尝试', desc: '完成第1个任务', ok: stats.completed >= 1 },
    { icon: '🔥', title: '学习达人', desc: '完成3个任务', ok: stats.completed >= 3 },
    { icon: '🏆', title: '数字生活通', desc: '完成8个任务', ok: stats.completed >= 8 },
    { icon: '🛡️', title: '安全意识', desc: '完成防诈骗指南', ok: progressMap['fangzhapian']?.status === 'completed' },
  ], [stats.completed, progressMap]);

  return (
    <div className={styles.page}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          <div className={styles.avatarInner} style={{ background: GRADIENTS[gradientIdx] }}>
            {userEmoji}
          </div>
        </div>
        <div className={styles.userId}>{userId}</div>
        <div className={styles.userMeta}>
          已学习 <span>{learningDays}</span> 天
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}><div className={styles.statNum}>{stats.total}</div><div className={styles.statLabel}>全部任务</div></div>
        <div className={styles.statCard}><div className={`${styles.statNum} ${styles.statNumDone}`}>{stats.completed}</div><div className={styles.statLabel}>已完成</div></div>
        <div className={styles.statCard}><div className={styles.statNum}>{stats.inProgress}</div><div className={styles.statLabel}>学习中</div></div>
      </div>

      {/* Achievements */}
      <div className={styles.sectionTitle}>🏅 学习成就</div>
      <div className={styles.achievements}>
        {achievements.map(a => (
          <div key={a.title} className={`${styles.achCard} ${a.ok ? styles.achCardUnlocked : ''}`}>
            <div className={styles.achIcon}>{a.icon}</div>
            <div className={styles.achTitle}>{a.ok ? a.title : '???'}</div>
            <div className={styles.achDesc}>{a.ok ? a.desc : '继续学习解锁'}</div>
          </div>
        ))}
      </div>

      {/* Progress list */}
      <div className={styles.sectionTitle}>📖 任务进度</div>
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
                <button className={styles.continueBtn} onClick={() => nav(`/task/${task.id}`)}>
                  {prog.status === 'in_progress' ? '继续学习 →' : '开始学习 →'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Settings */}
      <div className={styles.sectionTitle}>⚙️ 设置</div>
      <div className={styles.settingsList}>
        <button className={styles.settingItem} onClick={() => setShowKey(true)}>
          <span className={styles.settingLabel}>DeepSeek API Key</span>
          <span className={styles.settingValue}>{state.apiKey ? '已配置 ✓' : '未配置'}</span>
        </button>
        <button className={styles.settingItem} onClick={() => {
          const c: ('normal'|'large'|'xlarge')[] = ['normal','large','xlarge'];
          dispatch({ type: 'SET_FONT_SIZE', fontSize: c[(c.indexOf(state.fontSize)+1)%c.length] });
        }}>
          <span className={styles.settingLabel}>字号大小</span>
          <span className={styles.settingValue}>{state.fontSize === 'normal' ? '标准' : state.fontSize === 'large' ? '大号' : '超大'}</span>
        </button>
      </div>

      {/* API Key Modal */}
      {showKey && (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setShowKey(false) }}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>设置 DeepSeek API Key</div>
            <div className={styles.modalHint}>配置后可使用真实 AI 陪练。不配置也能用模拟模式。<br/><br/>访问 <strong>platform.deepseek.com</strong> 获取。</div>
            <input className={styles.modalInput} type="password" placeholder="粘贴 API Key" value={keyInput} onChange={e => setKeyInput(e.target.value)} />
            <div className={styles.modalActions}>
              <button className={`${styles.modalBtn} ${styles.modalBtnCancel}`} onClick={() => setShowKey(false)}>取消</button>
              <button className={`${styles.modalBtn} ${styles.modalBtnSave}`} onClick={() => { dispatch({ type: 'SET_API_KEY', apiKey: keyInput.trim() }); setShowKey(false) }}>保存</button>
            </div>
            <button className={styles.modalBtnSkip} onClick={() => { dispatch({ type: 'SET_API_KEY', apiKey: '' }); setShowKey(false) }}>暂不配置</button>
          </div>
        </div>
      )}
    </div>
  );
}
