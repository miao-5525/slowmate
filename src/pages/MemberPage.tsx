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

const COACH_FEATURES = [
  '真人视频一对一指导',
  '手把手教学，不限时长',
  '帮您解决具体操作问题',
  '可指定教学内容',
];

export default function MemberPage() {
  const nav = useNavigate();
  const { state, dispatch } = useAppState();
  const [showMember, setShowMember] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [coachTopic, setCoachTopic] = useState('');
  const [coachDone, setCoachDone] = useState(false);

  const confirmMember = () => {
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
    dispatch({ type: 'SET_MEMBER', isMember: true, expiry });
    setShowMember(false);
  };

  const confirmCoach = () => {
    setShowCoach(false);
    setCoachDone(true);
  };

  if (coachDone) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => nav(-1)}><Icon name="arrow-left" size={18} /> 返回</button>
        <div className={styles.success}>
          <div className={styles.successIcon}>✅</div>
          <div className={styles.successTitle}>人工陪练下单成功</div>
          <div className={styles.successText}>
            专业陪练员将在 <strong>2小时内</strong> 联系您<br/>
            确认教学内容和时间<br/><br/>
            {coachTopic && <>教学内容：{coachTopic}<br/><br/></>}
            请保持手机畅通 📱
          </div>
          <button className={styles.successBtn} onClick={() => nav('/profile')}>返回我的</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => nav(-1)}><Icon name="arrow-left" size={18} /> 返回</button>
      <div className={styles.header}>
        <div className={styles.headerIcon}>💎</div>
        <div className={styles.headerTitle}>升级服务</div>
        <div className={styles.headerDesc}>解锁更多学习内容和真人帮助</div>
      </div>

      <div className={styles.plans}>
        {/* Free */}
        <div className={`${styles.planCard} ${!state.isMember ? styles.planCardCurrent : ''}`}>
          <div className={styles.planName}>基础功能</div>
          <div className={`${styles.planPrice} ${styles.planPriceFree}`}>免费</div>
          <div className={styles.featureList}>
            {FREE_FEATURES.map(f => (
              <div key={f.text} className={styles.feature}>
                <span className={styles.featureCheck}>✓</span>
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
          <div className={styles.planName}>✨ 会员</div>
          <div className={styles.planPrice}>¥19.9<span style={{fontSize:14,fontWeight:400}}>/月</span></div>
          <div className={styles.featureList}>
            {PREMIUM_FEATURES.map(f => (
              <div key={f.text} className={styles.feature}>
                <span className={styles.featureCheck}>✓</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          {state.isMember ? (
            <button className={`${styles.planBtn} ${styles.planBtnCurrent}`} disabled>
              已开通 · {new Date(state.memberExpiry!).toLocaleDateString('zh-CN')} 到期
            </button>
          ) : (
            <button className={`${styles.planBtn} ${styles.planBtnUpgrade}`} onClick={() => setShowMember(true)}>
              立即开通
            </button>
          )}
        </div>

        {/* Coach Add-on */}
        <div className={`${styles.planCard} ${styles.planCardCoach}`}>
          <div className={styles.planName}>🎓 人工陪练（加购）</div>
          <div className={styles.planPrice}>¥29.9<span style={{fontSize:14,fontWeight:400}}>/次</span></div>
          <div className={styles.featureList}>
            {COACH_FEATURES.map(f => (
              <div key={f} className={styles.feature}>
                <span className={styles.featureCheck}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <button className={`${styles.planBtn} ${styles.planBtnCoach}`} onClick={() => setShowCoach(true)}>
            立即购买
          </button>
        </div>
      </div>

      <div className={styles.note}>
        ⚠️ 当前为模拟支付模式。真实上线后可接入微信支付/支付宝。
      </div>

      {/* Member Confirm */}
      {showMember && (
        <div className={styles.overlay} onClick={() => setShowMember(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalEmoji}>🎉</div>
            <div className={styles.modalTitle}>确认开通会员</div>
            <div className={styles.modalText}>
              ¥19.9/月<br/>
              有效期至 {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('zh-CN')}
            </div>
            <button className={styles.modalBtn} onClick={confirmMember}>确认开通（模拟）</button>
            <button className={styles.modalCancel} onClick={() => setShowMember(false)}>取消</button>
          </div>
        </div>
      )}

      {/* Coach Confirm */}
      {showCoach && (
        <div className={styles.overlay} onClick={() => setShowCoach(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalEmoji}>🎓</div>
            <div className={styles.modalTitle}>人工陪练</div>
            <div className={styles.modalText}>¥29.9/次 · 真人一对一视频指导</div>
            <input
              className={styles.modalInput}
              placeholder="想学什么？（选填）"
              value={coachTopic}
              onChange={e => setCoachTopic(e.target.value)}
            />
            <button className={styles.modalBtn} onClick={confirmCoach}>确认购买（模拟）</button>
            <button className={styles.modalCancel} onClick={() => setShowCoach(false)}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}
