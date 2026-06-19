import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../contexts/AppContext';
import Icon from '../components/Icon';
import styles from './HelpBookPage.module.css';

const HELP_TYPES = [
  {
    icon: '📹',
    title: '远程视频指导',
    desc: '志愿者通过微信视频或电话，远程教您操作',
    tag: '无需出门',
  },
  {
    icon: '🏠',
    title: '上门教学',
    desc: '志愿者到您家里，面对面手把手教',
    tag: '最贴心',
  },
  {
    icon: '🏫',
    title: '社区数字课程',
    desc: '参加社区开设的手机培训课，和邻居一起学',
    tag: '免费课程',
  },
];

// Mock community courses
const COURSES = [
  { title: '智能手机入门', date: '每周二 上午 9:30', place: 'XX社区活动中心', seats: 12 },
  { title: '微信支付 & 防诈骗', date: '每周四 下午 2:00', place: 'XX街道文化站', seats: 8 },
  { title: '短视频拍摄 & 分享', date: '周六 上午 10:00', place: 'XX老年大学', seats: 15 },
];

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
  const selected = HELP_TYPES[helpType];

  const handleSubmit = () => {
    if (!name || !phone) return;
    const bookings = JSON.parse(localStorage.getItem('manmanlai_bookings') || '[]');
    bookings.push({ type: selected.title, topic, name, phone, address, time: Date.now() });
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
          您预约了 <strong>{selected.title}</strong><br/><br/>
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
        <div className={styles.headerTitle}>🤝 预约帮助</div>
        <div className={styles.headerDesc}>选择适合您的方式，志愿者会来帮您</div>
      </div>

      {/* Type cards */}
      <div className={styles.form}>
        <div className={styles.formLabel}>选择帮助方式</div>
        <div className={styles.typeCards}>
          {HELP_TYPES.map((t, i) => (
            <button
              key={t.title}
              className={`${styles.typeCard} ${helpType === i ? styles.typeCardActive : ''}`}
              onClick={() => setHelpType(i)}
            >
              <div className={styles.typeCardTop}>
                <span className={styles.typeCardIcon}>{t.icon}</span>
                <div className={styles.typeCardInfo}>
                  <div className={styles.typeCardTitle}>{t.title}</div>
                  <div className={styles.typeCardDesc}>{t.desc}</div>
                </div>
              </div>
              <span className={styles.typeCardTag}>{t.tag}</span>
            </button>
          ))}
        </div>

        {helpType === 2 && (
          <div className={styles.courseList}>
            <div className={styles.formLabel}>📅 近期社区课程</div>
            {COURSES.map(c => (
              <div key={c.title} className={styles.courseCard}>
                <div className={styles.courseName}>{c.title}</div>
                <div className={styles.courseMeta}>⏰ {c.date} · 📍 {c.place}</div>
                <div className={styles.courseSeats}>剩余名额 {c.seats} 人</div>
              </div>
            ))}
            <div className={styles.courseHint}>
              选择社区课程后，我们将帮您报名最近的班级
            </div>
          </div>
        )}

        <div>
          <div className={styles.formLabel}>
            {helpType === 2 ? '想参加哪门课（选填）' : '我想学什么'}
          </div>
          <textarea
            className={styles.formTextarea}
            placeholder={helpType === 2 ? '选择上面的课程，或写您想学的内容' : '比如：线上挂号、用微信打视频、清理手机内存…'}
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </div>

        <div>
          <div className={styles.formLabel}>姓名</div>
          <input className={styles.formInput} placeholder="您的姓名" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div>
          <div className={styles.formLabel}>电话</div>
          <input className={styles.formInput} type="tel" placeholder="方便联系您的电话" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>

        {helpType === 1 && (
          <div>
            <div className={styles.formLabel}>家庭地址</div>
            <input className={styles.formInput} placeholder="上门教学需要填写详细地址" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
        )}

        <button className={styles.submitBtn} onClick={handleSubmit} disabled={!name || !phone || (helpType === 1 && !address)}>
          提交预约
        </button>
      </div>
    </div>
  );
}
