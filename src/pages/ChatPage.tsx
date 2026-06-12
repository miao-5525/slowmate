import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useProgress } from '../hooks/useProgress';
import { useAppState } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { chatWithDeepSeek, getMockReplyAsync } from '../services/ai';
import ChatBubble from '../components/ChatBubble';
import Icon from '../components/Icon';
import TASKS from '../data/tasks';
import styles from './ChatPage.module.css';

const QUICK = ['我想学网上挂号','怎么用手机缴费？','帮我看看这条短信是不是诈骗','怎么打视频电话？'];

export default function ChatPage() {
  const { taskId } = useParams<{ taskId?: string }>();
  const nav = useNavigate();
  const { state } = useAppState();
  const { startTask } = useProgress();
  const { supported: voiceOk, listening, transcript, start: vStart, stop: vStop } = useSpeechRecognition();

  const chatId = taskId ?? 'free';
  const task = TASKS.find(t => t.id === taskId);
  const sysPrompt = task?.systemPrompt ?? `你是一位名叫"小慢"的数字生活陪练员，正在耐心地帮助一位中老年人学习使用智能手机。说话要温暖、耐心，每次只说一个步骤。多鼓励。遇到验证码、密码、转账、陌生链接等情况要先提醒风险。`;
  const { messages, addMessage, buildAIMessages } = useChat(chatId);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (taskId) startTask(taskId) }, [taskId, startTask]);
  useEffect(() => { if (transcript) setInput(transcript) }, [transcript]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    addMessage('user', msg);
    setInput(''); setLoading(true);
    try {
      let reply: string;
      if (state.apiKey) {
        const msgs = buildAIMessages(sysPrompt); msgs.push({ role: 'user', content: msg });
        const r = await chatWithDeepSeek(msgs, state.apiKey);
        reply = r.error ? `抱歉：${r.error}` : r.content || '嗯…换个方式问一下？';
      } else {
        reply = (await getMockReplyAsync()).content;
      }
      addMessage('assistant', reply);
    } finally { setLoading(false) }
  };

  const handleVoice = () => listening ? vStop() : vStart();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => nav(-1)}><Icon name="arrow-left" size={22} /></button>
        <div className={styles.headerTitle}>{task ? task.title : '自由陪练'}</div>
        <div className={styles.headerRight} />
      </div>

      <div className={styles.msgList}>
        {messages.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}><Icon name="message-circle" size={44} color="var(--color-accent)" /></div>
            <div className={styles.emptyTitle}>{task ? `来练「${task.title}」吧！` : '有什么想学的？'}</div>
            <div className={styles.emptyHint}>{task ? '我会一步一步陪着您练，慢慢来～' : '直接告诉我您想做啥\n我会一步一步教您'}</div>
            <div className={styles.quickQs}>{QUICK.map(q => <button key={q} className={styles.quickQ} onClick={() => send(q)}>{q}</button>)}</div>
          </div>
        )}
        {messages.map(m => <ChatBubble key={m.id} message={m} />)}
        {loading && <div className={styles.typing}><div className={styles.typingDot}/><div className={styles.typingDot}/><div className={styles.typingDot}/></div>}
        <div ref={endRef} />
      </div>

      <div className={styles.inputBar}>
        {voiceOk && (
          <button className={`${styles.voiceBtn} ${listening ? styles.voiceActive : ''}`} onClick={handleVoice}>
            <Icon name="mic" size={22} color={listening ? 'var(--color-red)' : 'var(--color-ink-tertiary)'} />
          </button>
        )}
        <textarea className={styles.textInput} placeholder={listening ? '正在听您说话…' : '打字告诉我你想学什么…'} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} rows={1} />
        <button className={styles.sendBtn} onClick={() => send()} disabled={!input.trim() || loading}>
          <Icon name="send" size={20} color="#fff" />
        </button>
      </div>
    </div>
  );
}
