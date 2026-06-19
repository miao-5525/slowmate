import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../contexts/AppContext';
import Icon from '../components/Icon';
import { Task, TaskStep } from '../types';
import styles from './TaskBuilderPage.module.css';

const EMOJIS = ['🐼','🐱','🌸','🐢','🐶','🦊','🐨','🐵','🎵','📱','💡','🎯','🍳','🎨','📖','✈️'];

function emptyStep(): TaskStep {
  return { title: '', detail: '', mockup: { appName: 'App', elements: [] } };
}

export default function TaskBuilderPage() {
  const nav = useNavigate();
  const { state, dispatch } = useAppState();

  const maxTasks = state.isMember ? 999 : 3;
  const canAdd = state.customTasks.length < maxTasks;

  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskIcon, setTaskIcon] = useState(EMOJIS[0]);
  const [steps, setSteps] = useState<TaskStep[]>([emptyStep()]);

  const addStep = () => setSteps(s => [...s, emptyStep()]);
  const updateStep = (i: number, field: keyof TaskStep, val: string) => {
    setSteps(s => s.map((st, idx) => idx === i ? { ...st, [field]: val } : st));
  };

  const handleSave = () => {
    if (!taskName.trim() || steps.some(s => !s.title.trim())) return;
    const task: Task = {
      id: 'custom_' + Date.now(),
      title: taskName.trim(),
      description: taskDesc.trim() || '自定义任务',
      icon: 'star',  // default icon name that exists in Icon
      iconBg: '#FBF5EA',
      category: 'life',
      steps: steps.map(s => ({
        ...s,
        mockup: s.mockup || { appName: 'App', elements: [{ type: 'text' as const, text: s.title, size: 'md' as const }] },
      })),
      systemPrompt: `你是一位名叫"小慢"的数字生活陪练员。正在教老人学习「${taskName.trim()}」。请耐心、一步一步引导。`,
      isCustom: true,
    } as Task;
    dispatch({ type: 'ADD_CUSTOM_TASK', task });
    setShowForm(false); setTaskName(''); setTaskDesc(''); setSteps([emptyStep()]);
  };

  const handleDelete = (taskId: string) => dispatch({ type: 'REMOVE_CUSTOM_TASK', taskId });

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => nav(-1)}><Icon name="arrow-left" size={18} /> 返回</button>
      <div className={styles.header}>
        <div className={styles.headerTitle}>📝 定制任务</div>
        <div className={styles.headerDesc}>帮爸妈创建专属的学习任务</div>
        <div className={styles.limitBadge}>
          已创建 {state.customTasks.length}/{maxTasks} 个
          {!state.isMember && <button onClick={() => nav('/member')} style={{color:'var(--color-accent)',fontWeight:700}}>升级无限 →</button>}
        </div>
      </div>

      {/* Existing custom tasks */}
      {state.customTasks.length > 0 && (
        <div className={styles.customList}>
          {state.customTasks.map(t => (
            <div key={t.id} className={styles.customItem}>
              <div className={styles.customIcon}>{EMOJIS[0]}</div>
              <div>
                <div className={styles.customTitle}>{t.title}</div>
                <div className={styles.customSteps}>{t.steps.length} 个步骤</div>
              </div>
              <button className={styles.deleteBtn} onClick={() => handleDelete(t.id)}>✕</button>
            </div>
          ))}
        </div>
      )}

      {!showForm && canAdd && (
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + 创建新任务
        </button>
      )}

      {!showForm && !canAdd && (
        <div className={styles.limitHint}>
          免费版最多 3 个定制任务。<br/>
          <button onClick={() => nav('/member')} style={{color:'var(--color-accent)',fontWeight:600,marginTop:8}}>升级高级会员 →</button>
        </div>
      )}

      {showForm && (
        <div className={styles.form}>
          <div>
            <div className={styles.formLabel}>任务名称</div>
            <input className={styles.formInput} placeholder="如：学打太极拳" value={taskName} onChange={e => setTaskName(e.target.value)} />
          </div>
          <div>
            <div className={styles.formLabel}>简短描述</div>
            <input className={styles.formInput} placeholder="如：跟着视频学24式太极拳" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
          </div>
          <div>
            <div className={styles.formLabel}>图标</div>
            <div className={styles.emojiPicker}>
              {EMOJIS.map(e => (
                <button key={e} className={`${styles.emojiBtn} ${taskIcon === e ? styles.emojiBtnActive : ''}`} onClick={() => setTaskIcon(e)}>{e}</button>
              ))}
            </div>
          </div>

          {steps.map((s, i) => (
            <div key={i} className={styles.stepBlock}>
              <div className={styles.stepBlockTitle}>步骤 {i + 1}</div>
              <input className={styles.formInput} placeholder="步骤标题" value={s.title} onChange={e => updateStep(i, 'title', e.target.value)} style={{marginBottom:8}} />
              <input className={styles.formInput} placeholder="详细说明" value={s.detail} onChange={e => updateStep(i, 'detail', e.target.value)} />
            </div>
          ))}

          <button className={styles.addBtn} onClick={addStep}>+ 添加步骤</button>

          <button className={styles.saveBtn} onClick={handleSave} disabled={!taskName.trim() || steps.some(s => !s.title.trim())}>
            保存任务
          </button>
          <button className={styles.addBtn} onClick={() => setShowForm(false)} style={{marginTop:8}}>取消</button>
        </div>
      )}
    </div>
  );
}
