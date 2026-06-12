import { useState } from 'react';
import Icon from './Icon';
import styles from './SafetyButton.module.css';

const NUMBERS = [
  { label: '报警电话', number: '110', icon: 'alert' as const },
  { label: '急救电话', number: '120', icon: 'heart' as const },
  { label: '银行客服', number: '95599', icon: 'lock' as const },
  { label: '子女电话', number: '', icon: 'user' as const, hint: '请在设置中添加' },
];

export default function SafetyButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={styles.floatBtn} onClick={() => setOpen(true)} title="紧急求助">
        <Icon name="phone" size={22} color="var(--color-red)" strokeWidth={2} />
      </button>
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetTitle}>紧急求助</div>
            <div className={styles.sheetHint}>遇到可疑情况或紧急事件，别慌张，打下面的电话</div>
            <div className={styles.numberList}>
              {NUMBERS.map((n) => (
                <button
                  key={n.label}
                  className={styles.numberBtn}
                  onClick={() => n.number && (window.location.href = `tel:${n.number}`)}
                  disabled={!n.number}
                >
                  <div className={styles.numIcon}><Icon name={n.icon} size={22} color="var(--color-ink-secondary)" /></div>
                  <div className={styles.numInfo}>
                    <div className={styles.numLabel}>{n.label}</div>
                    <div className={styles.numValue}>{n.number || n.hint}</div>
                  </div>
                  {n.number && <Icon name="phone" size={20} color="var(--color-accent)" />}
                </button>
              ))}
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>关闭</button>
          </div>
        </div>
      )}
    </>
  );
}
