import { useEffect, useState } from 'react';
import Icon from './Icon';
import styles from './PracticeBar.module.css';

interface Props {
  stepIndex: number;
  totalSteps: number;
  stepTitle: string;
  stepDetail: string;
  onPrev: () => void;
  onNext: () => void;
  tts: {
    speak: (text: string) => void;
    pause: () => void;
    resume: () => void;
    replay: () => void;
    isSpeaking: boolean;
    isPaused: boolean;
    supported: boolean;
  };
}

export default function PracticeBar({ stepIndex, totalSteps, stepTitle, stepDetail, onPrev, onNext, tts }: Props) {
  const [minimized, setMinimized] = useState(false);

  // auto-speak on step change
  useEffect(() => {
    if (tts.supported) {
      const text = `第${stepIndex + 1}步：${stepTitle}。${stepDetail}`;
      tts.speak(text);
    }
  }, [stepIndex]);

  const handlePlayPause = () => {
    if (tts.isSpeaking && !tts.isPaused) {
      tts.pause();
    } else if (tts.isPaused) {
      tts.resume();
    } else {
      tts.replay();
    }
  };

  const playIcon = tts.isSpeaking && !tts.isPaused
    ? <span className={styles.speakingDot} />
    : tts.isPaused
      ? <Icon name="send" size={24} color="#fff" />  // placeholder "play" feel
      : <span style={{ fontSize: 22 }}>▶</span>;

  if (minimized) {
    return (
      <button className={styles.fab} onClick={() => setMinimized(false)} title="展开练习栏">
        <span>🎧</span>
        {tts.isSpeaking && !tts.isPaused && <span className={styles.fabBadge}>●</span>}
      </button>
    );
  }

  return (
    <div className={styles.bar}>
      {/* minimize */}
      <button className={styles.minimizeBtn} onClick={() => setMinimized(true)} title="最小化">
        <Icon name="chevron-down" size={18} />
      </button>

      {/* step info */}
      <div className={styles.stepInfo}>
        <div className={styles.stepLabel}>第 {stepIndex + 1} / {totalSteps} 步</div>
        <div className={styles.stepTitle}>{stepTitle}</div>
      </div>

      {/* controls */}
      <div className={styles.controls}>
        <button
          className={`${styles.ctrlBtn} ${styles.navBtn}`}
          onClick={onPrev}
          disabled={stepIndex === 0}
          title="上一步"
        >
          <Icon name="chevron-left" size={22} />
        </button>

        {tts.supported && (
          <button className={styles.playBtn} onClick={handlePlayPause} title={tts.isPaused ? '继续' : '暂停'}>
            {playIcon}
          </button>
        )}

        <button
          className={`${styles.ctrlBtn} ${styles.navBtn}`}
          onClick={onNext}
          disabled={stepIndex >= totalSteps - 1}
          title="下一步"
        >
          <Icon name="chevron-right" size={22} />
        </button>
      </div>
    </div>
  );
}
