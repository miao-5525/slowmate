import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../contexts/AppContext';
import Icon from '../components/Icon';
import styles from './MemberPage.module.css';

const FREE_FEATURES = [
  { text: '12 个标准任务包', ok: true },
  { text: 'AI 陪练（模拟模式）', ok: true },
  { text: '语音播报 + 练习模式', ok: true },
  { text: '学习进度 & 成就', ok: true },
  { text: '定制任务 ×3', ok: true },
  { text: '线下帮助预约 ×1', ok: true },
];

const PREMIUM_FEATURES = [
  { text: '全部免费功能', ok: true },
  { text: '2 个高级任务包', ok: true },
  { text: '无限定制任务', ok: true },
  { text: '无限线下帮助预约', ok: true },
  { text: '内置 AI 陪练', ok: true },
  { text: '更多高级任务更新中…', ok: true },
];

export default function MemberPage() {
  const nav = useNavigate();
  const { state, dispatch } = useAppState();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpgrade = () => setShowConfirm(true);
  const confirmUpgrade = () => {
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    dispatch({ type: 'SET_MEMBER', isMember: true, expiry });
    setShowConfirm(false);
  };

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => nav(-1)}><Icon name="arrow-left" size={18} /> 返回</button>
      <div className={styles.header}>
        <div className={styles.headerIcon}>💎</div>
        <div className={styles.headerTitle}>升级高级会员</div>
        <div className={styles.headerDesc}>解锁更多学习内容和专属服务</div>
      </div>

      <div className={styles.plans}>
        {/* Free */}
        <div className={`${styles.planCard} ${!state.isMember ? styles.planCardCurrent : ''}`}>
          <div className={styles.planName}>基础版</div>
          <div className={`${styles.planPrice} ${styles.planPriceFree}`}>免费</div>
          <div className={styles.featureList}>
            {FREE_FEATURES.map(f => (
              <div key={f.text} className={styles.feature}>
                <span className={styles.featureCheck}>{f.ok ? '✓' : ''}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          <button className={`${styles.planBtn} ${styles.planBtnCurrent}`} disabled>
            {state.isMember ? '' : '当前方案'}
          </button>
        </div>

        {/* Premium */}
        <div className={`${styles.planCard} ${state.isMember ? styles.planCardCurrent : styles.planCardPremium}`}>
          <div className={styles.planName}>✨ 高级版</div>
          <div className={styles.planPrice}>¥9.9<span style={{fontSize:14,fontWeight:400}}>/月</span></div>
          <div className={styles.featureList}>
            {PREMIUM_FEATURES.map(f => (
              <div key={f.text} className={styles.feature}>
                <span className={styles.featureCheck}>{f.ok ? '✓' : ''}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          {state.isMember ? (
            <button className={`${styles.planBtn} ${styles.planBtnCurrent}`} disabled>
              已开通 · 有效期至 {new Date(state.memberExpiry!).toLocaleDateString('zh-CN')}
            </button>
          ) : (
            <button className={`${styles.planBtn} ${styles.planBtnUpgrade}`} onClick={handleUpgrade}>
              立即开通
            </button>
          )}
        </div>
      </div>

      <div className={styles.note}>
        ⚠️ 当前为模拟支付模式。真实上线后可接入微信支付/支付宝。
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className={styles.overlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalEmoji}>🎉</div>
            <div className={styles.modalTitle}>确认开通</div>
            <div className={styles.modalText}>
              高级版 · ¥9.9/月<br/>
              有效期至 {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('zh-CN')}
            </div>
            <button className={styles.modalBtn} onClick={confirmUpgrade}>确认开通（模拟）</button>
            <button className={styles.modalBtn} style={{background:'var(--color-border)',color:'var(--color-ink-secondary)',marginTop:8}} onClick={() => setShowConfirm(false)}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}
