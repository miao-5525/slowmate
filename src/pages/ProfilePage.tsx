import { useState, useMemo } from 'react';
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
const EMOJIS = ['🐼','🐱','🌸','🐢','🐶','🦊','🐨','🐵'];
const GRADIENTS = [
  'linear-gradient(135deg,#FFE0D0,#FFC0A0)','linear-gradient(135deg,#D0E8FF,#A0C8FF)',
  'linear-gradient(135deg,#D0FFD8,#A0E8B0)','linear-gradient(135deg,#FFD0F0,#FFA0D0)',
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

  const items = TASKS.map(t => ({ task: t, prog: progressMap[t.id] }));

  const achievements = useMemo(() => [
    { icon: 'star', title: '初次尝试', desc: '完成第1个任务', ok: stats.completed >= 1 },
    { icon: 'zap', title: '学习达人', desc: '完成3个任务', ok: stats.completed >= 3 },
    { icon: 'award', title: '数字生活通', desc: '完成8个任务', ok: stats.completed >= 8 },
    { icon: 'shield', title: '安全意识', desc: '完成防诈骗', ok: progressMap['fangzhapian']?.status === 'completed' },
  ], [stats.completed, progressMap]);

  return (
    <div className={styles.page}>
      {/* Profile */}
      <div className={styles.profileCard}>
        <div className={styles.avatar} style={{background:GRADIENTS[gradientIdx]}}>{userEmoji}</div>
        <div className={styles.userId}>{userId}</div>
        <div className={styles.userMeta}>已学习 <strong>{learningDays}</strong> 天</div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}><div className={styles.statNum}>{stats.total}</div><div className={styles.statLabel}>全部任务</div></div>
        <div className={styles.stat}><div className={`${styles.statNum} ${styles.statNumDone}`}>{stats.completed}</div><div className={styles.statLabel}>已完成</div></div>
        <div className={styles.stat}><div className={styles.statNum}>{stats.inProgress}</div><div className={styles.statLabel}>学习中</div></div>
      </div>

      {/* Service cards */}
      <div className={styles.sectionTitle}>服务</div>
      <div className={styles.serviceList}>
        <button className={styles.serviceBtn} onClick={() => nav('/task-builder')}>
          <span className={styles.serviceIconBox} style={{background:'var(--color-accent-soft)'}}>
            <Icon name="plus" size={22} color="var(--color-accent)" />
          </span>
          <div className={styles.serviceText}>
            <div className={styles.serviceLabel}>定制任务</div>
            <div className={styles.serviceHint}>帮爸妈DIY教程 · 已创建 {state.customTasks.length} 个</div>
          </div>
          <Icon name="chevron-right" size={20} color="var(--color-ink-tertiary)" />
        </button>

        <button className={styles.serviceBtn} onClick={() => nav('/member')}>
          <span className={styles.serviceIconBox} style={{background: state.isMember ? 'var(--color-green-light)' : 'var(--color-amber-light)'}}>
            <Icon name={state.isMember ? 'award' : 'star'} size={22} color={state.isMember ? 'var(--color-green)' : 'var(--color-amber)'} />
          </span>
          <div className={styles.serviceText}>
            <div className={styles.serviceLabel}>{state.isMember ? '会员中心' : '升级会员'}</div>
            <div className={styles.serviceHint}>{state.isMember ? `已开通 · ${new Date(state.memberExpiry!).toLocaleDateString('zh-CN')} 到期` : '¥19.9/月 · 解锁高级任务'}</div>
          </div>
          <Icon name="chevron-right" size={20} color="var(--color-ink-tertiary)" />
        </button>

        <button className={styles.serviceBtn} onClick={() => {
          const c: ('normal'|'large'|'xlarge')[] = ['normal','large','xlarge'];
          dispatch({ type: 'SET_FONT_SIZE', fontSize: c[(c.indexOf(state.fontSize)+1)%c.length] });
        }}>
          <span className={styles.serviceIconBox} style={{background:'var(--color-blue-light)'}}>
            <Icon name="settings" size={22} color="var(--color-blue)" />
          </span>
          <div className={styles.serviceText}>
            <div className={styles.serviceLabel}>字号设置</div>
            <div className={styles.serviceHint}>当前：{state.fontSize === 'normal' ? '标准' : state.fontSize === 'large' ? '大号' : '超大'} · 点击切换</div>
          </div>
          <span className={styles.serviceToggle}>切换</span>
        </button>

        <button className={styles.serviceBtn} onClick={() => setShowKey(true)}>
          <span className={styles.serviceIconBox} style={{background:'var(--color-amber-light)'}}>
            <Icon name="zap" size={22} color="var(--color-amber)" />
          </span>
          <div className={styles.serviceText}>
            <div className={styles.serviceLabel}>AI 设置</div>
            <div className={styles.serviceHint}>DeepSeek API Key · {state.apiKey ? '已配置 ✓' : '未配置'}</div>
          </div>
          <Icon name="chevron-right" size={20} color="var(--color-ink-tertiary)" />
        </button>
      </div>

      {/* Achievements */}
      <div className={styles.sectionTitle}><Icon name="award" size={18} color="var(--color-amber)" /> 成就</div>
      <div className={styles.achievements}>
        {achievements.map(a => (
          <div key={a.title} className={`${styles.achCard} ${a.ok ? styles.achCardUnlocked : ''}`}>
            <div className={styles.achIcon}><Icon name={a.icon as any} size={28} color={a.ok ? 'var(--color-accent)' : 'var(--color-ink-tertiary)'} /></div>
            <div className={styles.achTitle}>{a.ok ? a.title : '???'}</div>
            <div className={styles.achDesc}>{a.ok ? a.desc : '继续学习解锁'}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className={styles.sectionTitle}><Icon name="book-open" size={18} color="var(--color-ink-secondary)" /> 学习进度</div>
      <div className={styles.progressList}>
        {items.map(({ task, prog }) => {
          if (!prog) return null;
          const s = SD[prog.status];
          return (
            <div key={task.id} className={styles.progressItem}>
              <div className={styles.progressHead}>
                <div className={styles.progressIconBox}><Icon name={task.icon} size={20} color="var(--color-accent)" /></div>
                <span className={styles.progressTitle}>{task.title}</span>
                <span className={`${styles.progressStatus} ${s.cls}`}>{s.label}</span>
              </div>
              <ProgressBar label="" current={prog.completedSteps} total={prog.totalSteps} />
              {prog.status !== 'completed' && (
                <button className={styles.continueBtn} onClick={() => nav(`/task/${task.id}`)}>
                  {prog.status === 'in_progress' ? '继续 →' : '开始 →'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* API Key Modal */}
      {showKey && (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setShowKey(false) }}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>设置 DeepSeek API Key</div>
            <div className={styles.modalHint}>配置后可使用真实 AI 陪练。<br/>访问 <strong>platform.deepseek.com</strong> 获取。</div>
            <input className={styles.modalInput} type="password" placeholder="粘贴 API Key" value={keyInput} onChange={e => setKeyInput(e.target.value)} />
            <div className={styles.modalActions}>
              <button className={styles.modalBtnCancel} onClick={() => setShowKey(false)}>取消</button>
              <button className={styles.modalBtnSave} onClick={() => { dispatch({ type: 'SET_API_KEY', apiKey: keyInput.trim() }); setShowKey(false) }}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
