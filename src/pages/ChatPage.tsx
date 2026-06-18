import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useProgress } from '../hooks/useProgress';
import { useAppState } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTTS } from '../hooks/useTTS';
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
  const tts = useTTS();

  const chatId = taskId ?? 'free';
  const task = TASKS.find(t => t.id === taskId);
  const sysPrompt = task?.systemPrompt ?? `你是一位名叫"小慢"的数字生活陪练员，正在耐心地帮助一位中老年人学习使用智能手机。说话要温暖、耐心，每次只说一个步骤。多鼓励。遇到验证码、密码、转账、陌生链接等情况要先提醒风险。`;
  const { messages, addMessage, buildAIMessages } = useChat(chatId);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);        // 语音对话模式
  const [screenMode, setScreenMode] = useState(false);      // 屏幕识别模式
  const endRef = useRef<HTMLDivElement>(null);
  const lastAIRef = useRef('');

  useEffect(() => { if (taskId) startTask(taskId) }, [taskId, startTask]);
  useEffect(() => { if (transcript) setInput(transcript) }, [transcript]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading]);

  // When voice mode is on, auto-read AI responses
  useEffect(() => {
    if (voiceMode && lastAIRef.current && tts.supported) {
      tts.speak(lastAIRef.current);
      lastAIRef.current = '';
    }
  }, [messages, voiceMode, tts]);

  // Continuous conversation: when TTS finishes, auto-listen
  useEffect(() => {
    if (voiceMode && !tts.isSpeaking && !tts.isPaused && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant' && !loading && voiceOk && !listening) {
        const timer = setTimeout(() => vStart(), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [tts.isSpeaking, loading, voiceMode, messages]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    addMessage('user', msg);
    setInput(''); setLoading(true);
    try {
      let reply: string;
      if (state.apiKey) {
        const allMsgs = buildAIMessages(sysPrompt);
        allMsgs.push({ role: 'user', content: msg });
        const r = await chatWithDeepSeek(allMsgs, state.apiKey);
        reply = r.error ? `抱歉：${r.error}` : r.content || '嗯…换个方式问一下？';
      } else {
        reply = (await getMockReplyAsync()).content;
      }
      addMessage('assistant', reply);
      lastAIRef.current = reply;
    } finally { setLoading(false) }
  };

  const handleVoice = () => {
    if (listening) {
      vStop();
    } else {
      vStart();
    }
  };

  const toggleVoiceMode = () => {
    if (voiceMode) {
      tts.stop();
      if (listening) vStop();
    }
    setVoiceMode(!voiceMode);
  };

  // Screen recognition: send a guided prompt
  const startScreenRecognition = () => {
    const prompt = `📸 我现在需要你帮我看看手机屏幕，告诉我接下来该点哪里。

请你先问我以下几个问题（每次只问一个）：
1. 你现在用的是什么App？（微信、支付宝、还是别的？）
2. 屏幕上最上面写的什么标题？
3. 屏幕中间有什么按钮？按钮是什么颜色的？上面写的什么字？
4. 屏幕下方有什么？

根据我的描述，一步步告诉我要点哪里。`;
    send(prompt);
    setScreenMode(true);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => nav(-1)}><Icon name="arrow-left" size={22} /></button>
        <div className={styles.headerTitle}>{task ? task.title : '自由陪练'}</div>
        <div className={styles.headerActions}>
          {/* Voice mode toggle */}
          {tts.supported && (
            <button
              className={`${styles.headerBtn} ${voiceMode ? styles.headerBtnActive : ''}`}
              onClick={toggleVoiceMode}
              title={voiceMode ? '关闭语音对话' : '开启语音对话'}
            >
              <Icon name="mic" size={20} color={voiceMode ? '#fff' : 'var(--color-ink-tertiary)'} />
            </button>
          )}
          {/* Screen recognition */}
          <button
            className={`${styles.headerBtn} ${screenMode ? styles.headerBtnActive : ''}`}
            onClick={startScreenRecognition}
            title="截屏识别"
          >
            <Icon name="camera" size={20} color={screenMode ? '#fff' : 'var(--color-ink-tertiary)'} />
          </button>
        </div>
      </div>

      {/* Voice mode indicator */}
      {voiceMode && (
        <div className={styles.voiceBanner}>
          <span className={styles.voiceDot} />
          <span>语音对话中{listening ? ' — 正在听…' : tts.isSpeaking ? ' — 正在说…' : ''}</span>
          <button className={styles.voiceBannerClose} onClick={toggleVoiceMode}>关闭</button>
        </div>
      )}

      {/* Messages */}
      <div className={styles.msgList}>
        {messages.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}><Icon name="message-circle" size={44} color="var(--color-accent)" /></div>
            <div className={styles.emptyTitle}>{task ? `来练「${task.title}」吧！` : '有什么想学的？'}</div>
            <div className={styles.emptyHint}>
              {task
                ? '我会一步一步陪着您练，慢慢来～'
                : '告诉我您想做啥\n我会一步一步教您'}
            </div>

            {/* Screen recognition entry */}
            <button className={`${styles.quickQ} ${styles.screenQ}`} onClick={startScreenRecognition}>
              📸 截屏识别 — 告诉AI你屏幕上有什么
            </button>

            <div className={styles.quickQs}>
              {QUICK.map(q => <button key={q} className={styles.quickQ} onClick={() => send(q)}>{q}</button>)}
            </div>
          </div>
        )}
        {messages.map(m => <ChatBubble key={m.id} message={m} />)}
        {loading && <div className={styles.typing}><div className={styles.typingDot}/><div className={styles.typingDot}/><div className={styles.typingDot}/></div>}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className={styles.inputBar}>
        {voiceOk && (
          <button
            className={`${styles.voiceBtn} ${listening ? styles.voiceActive : ''} ${voiceMode ? styles.voiceBtnBig : ''}`}
            onClick={handleVoice}
          >
            <Icon name="mic" size={voiceMode ? 26 : 22} color={listening ? 'var(--color-red)' : voiceMode ? 'var(--color-accent)' : 'var(--color-ink-tertiary)'} />
          </button>
        )}
        <textarea
          className={styles.textInput}
          placeholder={listening ? '正在听您说话…' : voiceMode ? '语音模式 — 直接说话' : '打字告诉我你想学什么…'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          rows={1}
        />
        <button className={styles.sendBtn} onClick={() => send()} disabled={!input.trim() || loading}>
          <Icon name="send" size={20} color="#fff" />
        </button>
      </div>
    </div>
  );
}
