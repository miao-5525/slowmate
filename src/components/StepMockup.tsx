import { StepMockup as StepMockupData } from '../types';
import Icon from './Icon';
import styles from './StepMockup.module.css';

interface Props {
  data: StepMockupData;
}

export default function StepMockup({ data }: Props) {
  const { appName, highlightLabel, elements } = data;

  return (
    <div className={styles.phone}>
      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>9:41</span>
        <span>📶 🔋</span>
      </div>

      {/* Title bar */}
      <div className={styles.titleBar}>
        <span>←</span>
        <span>{appName}</span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {highlightLabel && (
          <div className={styles.highlight}>
            <Icon name="chevron-right" size={14} />
            <span>{highlightLabel}</span>
          </div>
        )}

        {elements.map((el, i) => {
          switch (el.type) {
            case 'text':
              return (
                <div key={i} className={`${styles.elText} ${el.size === 'sm' ? styles.elTextSm : styles.elTextMd}`}>
                  {el.text}
                </div>
              );

            case 'button': {
              const colorCls =
                el.color === 'green' ? styles.elBtnGreen :
                el.color === 'blue' ? styles.elBtnBlue :
                el.color === 'orange' ? styles.elBtnOrange : '';
              return (
                <div key={i} className={`${styles.elBtn} ${colorCls} ${el.primary ? styles.elBtnPrimary : ''}`}>
                  {el.label}
                </div>
              );
            }

            case 'input':
              return (
                <div key={i} className={styles.elInput}>{el.placeholder}</div>
              );

            case 'list':
              return (
                <div key={i}>
                  {el.items.map((item, j) => (
                    <div key={j} className={styles.elListItem}>
                      <span>{j + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              );

            case 'card':
              return (
                <div key={i} className={styles.elCard}>
                  <div className={styles.elCardTitle}>{el.title}</div>
                  {el.subtitle && <div className={styles.elCardSub}>{el.subtitle}</div>}
                </div>
              );

            case 'icon-grid':
              return (
                <div key={i} className={styles.elGrid}>
                  {el.icons.map((ic, j) => (
                    <div key={j} className={styles.elGridItem}>
                      <span className={styles.elGridIcon}>{ic.icon}</span>
                      <span>{ic.label}</span>
                    </div>
                  ))}
                </div>
              );

            case 'highlight-box':
              return (
                <div key={i} className={`${styles.elHighlightBox} ${el.color === 'red' ? styles.elHighlightRed : styles.elHighlightOrange}`}>
                  {el.text}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
