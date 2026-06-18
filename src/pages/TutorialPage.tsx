import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { useTTS } from '../hooks/useTTS';
import Icon from '../components/Icon';
import StepMockup from '../components/StepMockup';
import PracticeBar from '../components/PracticeBar';
import TASKS from '../data/tasks';
import styles from './TutorialPage.module.css';

const ONBOARD_KEY = 'manmanlai_practice_onboarded';

export default function TutorialPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const nav = useNavigate();
  const { progressMap, startTask, completeStep, completeTask } = useProgress();
  const tts = useTTS();

  const task = TASKS.find(t => t.id === taskId);
  const progress = taskId ? progressMap[taskId] : null;

  const [openStep, setOpenStep] = useState<number | null>(0);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [celebrate, setCelebrate] = useState(false);

  // Practice mode
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceStep, setPracticeStep] = useState(0);

  // Onboarding
  const [showOnboard, setShowOnboard] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARD_KEY);
    if (!done) setShowOnboard(true);
  }, []);

  const dismissOnboard = () => {
    localStorage.setItem(ONBOARD_KEY, '1');
    setShowOnboard(false);
  };

  if (!task || !progress) return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => nav(-1)}><Icon name="arrow-left" size={18} /> 返回</button>
      <div style={{textAlign:'center',padding:40,color:'var(--color-ink-tertiary)'}}>任务不存在</div>
    </div>
  );

  const allDone = checked.size >= task.steps.length;

  const toggleCheck = (i: number) => setChecked(prev => {
    const n = new Set(prev);
    if (n.has(i)) n.delete(i); else { n.add(i); completeStep(task.id) }
    return n;
  });

  const handleAI = () => { startTask(task.id); nav(`/chat/${task.id}`) };
  const handleDone = () => {
    for (let i = checked.size; i < task.steps.length; i++) completeStep(task.id);
    setChecked(new Set(task.steps.map((_,i) => i)));
    completeTask(task.id);
    setCelebrate(true);
  };

  // Start practice mode
  const enterPractice = () => {
    const firstUnchecked = [...Array(task.steps.length)].findIndex((_, i) => !checked.has(i));
    setPracticeStep(firstUnchecked >= 0 ? firstUnchecked : 0);
    setPracticeMode(true);
  };

  const exitPractice = () => {
    tts.stop();
    setPracticeMode(false);
  };

  const practicePrev = () => {
    if (practiceStep > 0) setPracticeStep(s => s - 1);
  };

  const practiceNext = () => {
    if (practiceStep < task.steps.length - 1) {
      setPracticeStep(s => s + 1);
      // auto-check the step user just passed
      if (!checked.has(practiceStep)) {
        toggleCheck(practiceStep);
      }
    }
  };

  const currentStep = task.steps[practiceStep];

  // ── Practice Mode View ──
  if (practiceMode) {
    return (
      <div className={styles.practicePage}>
        {/* Top bar */}
        <div className={styles.practiceTop}>
          <button className={styles.backBtn} onClick={exitPractice}>
            <Icon name="arrow-left" size={18} /> 退出练习
          </button>
          <div className={styles.practiceStepBadge}>
            第 {practiceStep + 1} / {task.steps.length} 步
          </div>
        </div>

        {/* Mockup */}
        <div className={styles.practiceMockup}>
          <StepMockup data={currentStep.mockup} />
        </div>

        {/* Step content */}
        <div className={styles.practiceContent}>
          <div className={styles.practiceStepTitle}>{currentStep.title}</div>
          <div className={styles.practiceStepDetail}>{currentStep.detail}</div>
          {currentStep.tip && <div className={styles.practiceTip}>💡 {currentStep.tip}</div>}
          {currentStep.warning && <div className={styles.practiceWarning}>⚠️ {currentStep.warning}</div>}
        </div>

        {/* Status indicator */}
        <div className={styles.practiceTtsBadge}>
          {tts.isSpeaking && !tts.isPaused ? '📢 正在朗读中...' : tts.isPaused ? '⏸ 已暂停' : '🔇 已播完'}
        </div>

        {/* Practice Bar */}
        <PracticeBar
          stepIndex={practiceStep}
          totalSteps={task.steps.length}
          stepTitle={currentStep.title}
          stepDetail={currentStep.detail}
          onPrev={practicePrev}
          onNext={practiceNext}
          tts={tts}
        />

        {/* Onboarding overlay */}
        {showOnboard && (
          <div className={styles.onboardOverlay} onClick={dismissOnboard}>
            <div className={styles.onboardCard} onClick={e => e.stopPropagation()}>
              <div className={styles.onboardIcon}>💡</div>
              <div className={styles.onboardTitle}>使用小贴士</div>
              <div className={styles.onboardSteps}>
                <div className={styles.onboardStep}><span>1</span> 听语音指引，不用来回看手机</div>
                <div className={styles.onboardStep}><span>2</span> 切到微信等App，跟着操作</div>
                <div className={styles.onboardStep}><span>3</span> 做完一步，点「下一步」</div>
                <div className={styles.onboardStep}><span>4</span> 不会就点重播，再听一遍</div>
              </div>
              <button className={styles.onboardBtn} onClick={dismissOnboard}>知道了</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Normal Tutorial View ──
  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => nav(-1)}><Icon name="arrow-left" size={18} /> 返回</button>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}><Icon name={task.icon} size={42} color="var(--color-accent)" /></div>
        <div className={styles.headerTitle}>{task.title}</div>
        <div className={styles.headerDesc}>{task.description}</div>
        <div className={styles.headerBadge}>
          <Icon name="clock" size={16} /> 共 {task.steps.length} 步 · 已完成 {checked.size} 步
        </div>
      </div>

      {/* Practice mode entry */}
      <div className={styles.practiceEntry}>
        <button className={styles.practiceEntryBtn} onClick={enterPractice}>
          <span className={styles.practiceEntryIcon}>🎧</span>
          <span>边听边练</span>
          <span className={styles.practiceEntryHint}>语音播报 + 精简模式</span>
        </button>
      </div>

      {/* Steps */}
      <div className={styles.stepsTitle}>操作步骤（点开查看详情）</div>
      <div className={styles.timeline}>
        {task.steps.map((step, i) => {
          const open = openStep === i;
          const done = checked.has(i);
          return (
            <div key={i} className={styles.stepItem}>
              <div className={`${styles.dot} ${done ? styles.dotDone : open ? styles.dotActive : ''}`}>
                {done ? <Icon name="check-circle" size={24} color="#fff" strokeWidth={3} /> : i + 1}
              </div>
              <div className={`${styles.card} ${done ? styles.cardDone : ''}`}>
                <div className={styles.cardHead} onClick={() => setOpenStep(open ? null : i)}>
                  <div className={styles.cardTitle}>{step.title}</div>
                  <button className={`${styles.checkDot} ${done ? styles.checkDotChecked : ''}`} onClick={e => { e.stopPropagation(); toggleCheck(i) }}>
                    {done ? <Icon name="check-circle" size={14} color="#fff" strokeWidth={3} /> : ''}
                  </button>
                  <span className={`${styles.cardArrow} ${open ? styles.cardArrowOpen : ''}`}><Icon name="chevron-down" size={18} /></span>
                </div>
                {open && (
                  <div className={styles.cardBody}>
                    <div className={styles.cardContent}>
                      <div className={styles.cardText}>
                        <div className={styles.stepDetail}>{step.detail}</div>
                        {step.tip && <div className={styles.stepTip}>💡 {step.tip}</div>}
                        {step.warning && <div className={styles.stepWarning}>⚠️ {step.warning}</div>}
                      </div>
                      <div className={styles.cardMockup}><StepMockup data={step.mockup} /></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <button className={`${styles.actionBtn} ${styles.aiBtn}`} onClick={handleAI}>
          <Icon name="message-circle" size={22} color="#fff" />
          开始AI陪练
        </button>
        <button className={`${styles.actionBtn} ${styles.doneBtn}`} onClick={handleDone} disabled={allDone}>
          <Icon name={allDone ? 'award' : 'check-circle'} size={22} color="#fff" />
          {allDone ? '已学会！' : '我已学会'}
        </button>
      </div>

      {/* Celebrate */}
      {celebrate && (
        <div className={styles.celebrate} onClick={() => setCelebrate(false)}>
          <div className={styles.celebrateCard} onClick={e => e.stopPropagation()}>
            <div className={styles.celIcon}>🎉</div>
            <div className={styles.celTitle}>太棒了！</div>
            <div className={styles.celText}>你已经学会了<strong>「{task.title}」</strong><br/>离数字生活达人又近了一步！</div>
            <button className={styles.celBtn} onClick={() => { setCelebrate(false); nav('/progress') }}>看看我的学习进度 →</button>
          </div>
        </div>
      )}

      {/* Onboarding overlay */}
      {showOnboard && (
        <div className={styles.onboardOverlay} onClick={dismissOnboard}>
          <div className={styles.onboardCard} onClick={e => e.stopPropagation()}>
            <div className={styles.onboardIcon}>💡</div>
            <div className={styles.onboardTitle}>使用小贴士</div>
            <div className={styles.onboardSteps}>
              <div className={styles.onboardStep}><span>1</span> 点「边听边练」，进入练习模式</div>
              <div className={styles.onboardStep}><span>2</span> 切到微信等App，跟着语音操作</div>
              <div className={styles.onboardStep}><span>3</span> 做完一步，点「下一步」继续</div>
              <div className={styles.onboardStep}><span>4</span> 不会就点重播，再听一遍</div>
            </div>
            <button className={styles.onboardBtn} onClick={dismissOnboard}>知道了</button>
          </div>
        </div>
      )}
    </div>
  );
}
