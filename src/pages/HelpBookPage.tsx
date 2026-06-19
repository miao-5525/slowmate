import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../contexts/AppContext';
import Icon from '../components/Icon';
import styles from './HelpBookPage.module.css';

const HELP_TYPES = ['社区志愿者', '上门教学', '电话指导'];

export default function HelpBookPage() {
  const nav = useNavigate();
  const { state, dispatch } = useAppState();
  const [helpType, setHelpType] = useState(0);
  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canBook = state.isMember || state.helpBookingsUsed < 1;

  const handleSubmit = () => {
    if (!name || !phone) return;
    // Save booking
    const bookings = JSON.parse(localStorage.getItem('manmanlai_bookings') || '[]');
    bookings.push({ type: HELP_TYPES[helpType], topic, name, phone, address, time: Date.now() });
    localStorage.setItem('manmanlai_bookings', JSON.stringify(bookings));
    dispatch({ type: 'USE_HELP_BOOKING' });
    setSubmitted(true);
  };

  if (!canBook) return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => nav(-1)}><Icon name="arrow-left" size={18} /> 返回</button>
      <div className={styles.limitHint}>
        <div className={styles.limitHintIcon}>🔒</div>
        <div style={{fontSize:'var(--text-md)',fontWeight:600,marginBottom:8,color:'var(--color-ink)'}}>免费次数已用完</div>
        <div style={{fontSize:'var(--text-sm)',color:'var(--color-ink-secondary)'}}>升级高级会员可无限预约</div>
        <button className={styles.backHome} style={{marginTop:16}} onClick={() => nav('/member')}>升级会员 →</button>
      </div>
    </div>
  );

  if (submitted) return (
    <div className={styles.page}>
      <div className={styles.success}>
        <div className={styles.successIcon}>✅</div>
        <div className={styles.successTitle}>预约成功！</div>
        <div className={styles.successText}>
          我们将在 <strong>24小时内</strong> 通过电话联系您<br/>
          确认具体的帮助时间和方式<br/><br/>
          请保持手机畅通 📱
        </div>
        <button className={styles.backHome} onClick={() => nav('/profile')}>返回我的</button>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => nav(-1)}><Icon name="arrow-left" size={18} /> 返回</button>
      <div className={styles.header}>
        <div className={styles.headerTitle}>🤝 预约线下帮助</div>
        <div className={styles.headerDesc}>志愿者或社区工作人员可以上门/电话帮助您</div>
      </div>

      <div className={styles.form}>
        <div>
          <div className={styles.formLabel}>帮助类型</div>
          <div className={styles.typeOptions}>
            {HELP_TYPES.map((t, i) => (
              <button key={t} className={`${styles.typeBtn} ${helpType === i ? styles.typeBtnActive : ''}`} onClick={() => setHelpType(i)}>{t}</button>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.formLabel}>我想学什么</div>
          <textarea className={styles.formTextarea} placeholder="比如：线上挂号、用微信打视频、清理手机内存…" value={topic} onChange={e => setTopic(e.target.value)} />
        </div>

        <div>
          <div className={styles.formLabel}>姓名</div>
          <input className={styles.formInput} placeholder="您的姓名" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div>
          <div className={styles.formLabel}>电话</div>
          <input className={styles.formInput} type="tel" placeholder="方便联系您的电话" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>

        <div>
          <div className={styles.formLabel}>地址（选填）</div>
          <input className={styles.formInput} placeholder="上门教学需要填写地址" value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit} disabled={!name || !phone}>
          提交预约
        </button>
      </div>
    </div>
  );
}
