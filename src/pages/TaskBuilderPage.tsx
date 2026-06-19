import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../contexts/AppContext';
import StepMockup from '../components/StepMockup';
import Icon from '../components/Icon';
import { Task, TaskStep, MockupElement } from '../types';
import styles from './TaskBuilderPage.module.css';

const EMOJIS = ['🐼','🐱','🌸','🐢','🐶','🦊','🐨','🐵','🎵','📱','💡','🎯','🍳','🎨','📖','✈️'];

function emptyStep(): TaskStep {
  return {
    title: '', detail: '',
    mockup: { appName: 'App', elements: [{ type: 'text', text: '这里是操作说明', size: 'md' }] },
  };
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
  const [previewStep, setPreviewStep] = useState(0);

  const addStep = () => setSteps(s => [...s, emptyStep()]);
  const removeStep = (i: number) => { if (steps.length > 1) setSteps(s => s.filter((_, idx) => idx !== i)); };
  const updateStep = (i: number, field: keyof TaskStep, val: string) => {
    setSteps(s => s.map((st, idx) => idx === i ? { ...st, [field]: val } : st));
  };
  const updateMockupApp = (i: number, appName: string) => {
    setSteps(s => s.map((st, idx) => idx === i ? { ...st, mockup: { ...st.mockup, appName } } : st));
  };
  const addMockupEl = (i: number) => {
    setSteps(s => s.map((st, idx) => idx === i ? {
      ...st, mockup: { ...st.mockup, elements: [...st.mockup.elements, { type: 'text', text: '新内容', size: 'md' }] }
    } : st));
  };

  const handleSave = () => {
    if (!taskName.trim() || steps.some(s => !s.title.trim())) return;
    const task: Task = {
      id: 'custom_' + Date.now(),
      title: taskName.trim(),
      description: taskDesc.trim() || '自定义任务',
      icon: 'star',
      iconBg: '#FBF5EA',
      category: 'life',
      steps,
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
        <div className={styles.headerDesc}>帮爸妈创建专属的学习任务，每一步都能配手机界面模拟图</div>
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

          {/* Steps */}
          <div className={styles.formLabel}>步骤设计（{steps.length} 步）
            <span style={{fontSize:'var(--text-xs)',color:'var(--color-ink-tertiary)',fontWeight:400}}> — 每步配文字 + 模拟图</span>
          </div>

          {steps.map((s, i) => (
            <div key={i} className={styles.stepBlock}>
              <div className={styles.stepBlockHeader}>
                <span className={styles.stepBlockTitle}>步骤 {i + 1}</span>
                {steps.length > 1 && (
                  <button className={styles.removeStepBtn} onClick={() => removeStep(i)}>删除</button>
                )}
              </div>

              <input className={styles.formInput} placeholder="步骤标题（如：打开微信搜索）" value={s.title} onChange={e => updateStep(i, 'title', e.target.value)} />
              <textarea className={styles.formTextarea} placeholder="详细操作说明…" value={s.detail} onChange={e => updateStep(i, 'detail', e.target.value)} />

              {/* Mockup editor */}
              <div className={styles.mockupEditor}>
                <div className={styles.mockupEditorTitle}>📱 模拟图设置</div>
                <div className={styles.mockupRow}>
                  <span className={styles.mockupLabel}>App 名：</span>
                  <input className={styles.mockupInput} placeholder="微信" value={s.mockup.appName} onChange={e => updateMockupApp(i, e.target.value)} />
                </div>
                <div className={styles.mockupLabel}>界面元素</div>
                <div className={styles.mockupElements}>
                  {s.mockup.elements.map((el, ei) => (
                    <div key={ei} className={styles.mockupEl}>
                      <select className={styles.mockupSelect} value={el.type} onChange={e => {
                        const type = e.target.value as MockupElement['type'];
                        setSteps(st => st.map((st2, idx) => idx === i ? {
                          ...st2, mockup: { ...st2.mockup, elements: st2.mockup.elements.map((e2, idx2) =>
                            idx2 === ei ? { type, text: type==='text' ? '新内容' : '', size:'md' } as MockupElement : e2
                          )}
                        } : st2));
                      }}>
                        <option value="text">文字</option>
                        <option value="button">按钮</option>
                        <option value="card">卡片</option>
                        <option value="input">输入框</option>
                        <option value="list">列表</option>
                      </select>
                      {'text' in el && (
                        <input className={styles.mockupInputSm} value={el.text} onChange={e => {
                          setSteps(st => st.map((st2, idx) => idx === i ? {
                            ...st2, mockup: { ...st2.mockup, elements: st2.mockup.elements.map((e2, idx2) =>
                              idx2 === ei ? { ...e2, text: e.target.value } : e2
                            )}
                          } : st2));
                        }} />
                      )}
                      {'label' in el && (
                        <input className={styles.mockupInputSm} value={el.label} onChange={e => {
                          setSteps(st => st.map((st2, idx) => idx === i ? {
                            ...st2, mockup: { ...st2.mockup, elements: st2.mockup.elements.map((e2, idx2) =>
                              idx2 === ei ? { ...e2, label: e.target.value } as any : e2
                            )}
                          } : st2));
                        }} />
                      )}
                    </div>
                  ))}
                </div>
                <button className={styles.addMockupBtn} onClick={() => addMockupEl(i)}>+ 添加元素</button>
              </div>
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
