import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../contexts/AppContext';
import { useProgress } from '../hooks/useProgress';
import TaskCard from '../components/TaskCard';
import SafetyButton from '../components/SafetyButton';
import Icon from '../components/Icon';
import TASKS from '../data/tasks';
import styles from './HomePage.module.css';

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
  const { state, dispatch } = useAppState();
  const { progressMap } = useProgress();
  const [showKey, setShowKey] = useState(false);
  const [keyInput, setKeyInput] = useState(state.apiKey ?? '');

  const active = Object.entries(progressMap).filter(([,p]) => p.status === 'in_progress').map(([id]) => TASKS.find(t => t.id === id)).filter(Boolean);
  const display = active.length > 0 ? active : TASKS.slice(0, 3);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroIcon}>
            <Icon name="smile" size={38} color="var(--color-accent)" strokeWidth={1.5} />
          </div>
          <div className={styles.greeting}>{greeting()}</div>
          <div className={styles.subtitle}>我是您的数字生活陪练员<br/>别着急，我们慢慢来</div>
        </div>
      </div>

      {/* Quick entry */}
      <div className={styles.quick}>
        <button className={`${styles.quickBtn} ${styles.quickBtnPrimary}`} onClick={() => nav('/tasks')}>
          <div className={styles.quickBtnIcon}><Icon name="book-open" size={28} color="#fff" /></div>
          <span className={styles.quickBtnText}>开始学习</span>
          <span className={styles.quickBtnHint}>看课程</span>
        </button>
        <button className={`${styles.quickBtn} ${styles.quickBtnGreen}`} onClick={() => nav('/chat')}>
          <div className={styles.quickBtnIcon}><Icon name="message-circle" size={28} color="#fff" /></div>
          <span className={styles.quickBtnText}>问陪练</span>
          <span className={styles.quickBtnHint}>直接问</span>
        </button>
      </div>

      {/* Tasks */}
      <div className={styles.sectionHead}>
        <span className={styles.sectionTitle}>{active.length > 0 ? '继续学习' : '推荐学习'}</span>
        <span className={styles.sectionMore} onClick={() => nav('/tasks')}>查看全部 →</span>
      </div>
      <div className={styles.taskList}>
        {display.map(t => t && (
          <TaskCard key={t.id} task={t} status={progressMap[t.id]?.status ?? 'not_started'} onClick={() => nav(`/task/${t.id}`)} />
        ))}
      </div>

      {/* Settings */}
      <div className={styles.settings}>
        <button className={styles.settingsBtn} onClick={() => setShowKey(true)}>
          <Icon name="settings" size={16} />
          AI 设置（{state.apiKey ? '已配置' : '未配置'}）
        </button>
      </div>

      {/* API Key Modal */}
      {showKey && (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setShowKey(false) }}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>设置 DeepSeek API Key</div>
            <div className={styles.modalHint}>配置后可体验真实 AI 陪练。不配置也能用模拟模式。<br/><br/>访问 <strong>platform.deepseek.com</strong> 获取。</div>
            <input className={styles.modalInput} type="password" placeholder="粘贴 API Key" value={keyInput} onChange={e => setKeyInput(e.target.value)} />
            <div className={styles.modalActions}>
              <button className={`${styles.modalBtn} ${styles.modalBtnCancel}`} onClick={() => setShowKey(false)}>取消</button>
              <button className={`${styles.modalBtn} ${styles.modalBtnSave}`} onClick={() => { dispatch({ type: 'SET_API_KEY', apiKey: keyInput.trim() }); setShowKey(false) }}>保存</button>
            </div>
            <button className={styles.modalBtnSkip} onClick={() => { dispatch({ type: 'SET_API_KEY', apiKey: '' }); setShowKey(false) }}>暂不配置，用模拟模式</button>
          </div>
        </div>
      )}

      <SafetyButton />
    </div>
  );
}
