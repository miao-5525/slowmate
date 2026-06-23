import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useProgress } from '../hooks/useProgress';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTTS } from '../hooks/useTTS';
import { getMockReplyAsync } from '../services/ai';
import ChatBubble from '../components/ChatBubble';
import Icon from '../components/Icon';
import TASKS from '../data/tasks';
import styles from './ChatPage.module.css';

// 自由对话模式预设问题
const FREE_CHIPS = [
  '我想学手机挂号 🏥',
  '怎么缴水电费？💡',
  '教我用手机打车 🚗',
  '怎么跟儿女视频？📞',
  '帮我看短信是不是诈骗 🛡️',
  '想学在网上买东西 🛒',
];

// 任务学习模式预设
const TASK_CHIPS = ['下一步', '再讲一遍', '这里不太懂', '我学会了！'];

export default function ChatPage() {
  const { taskId } = useParams<{ taskId?: string }>();
  const nav = useNavigate();
  const { startTask } = useProgress();
  const { supported: voiceOk, listening, transcript, start: vStart, stop: vStop } = useSpeechRecognition();
  const tts = useTTS();

  const chatId = taskId ?? 'free';
  const task = TASKS.find((t) => t.id === taskId);
  const { messages, addMessage } = useChat(chatId);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastAIRef = useRef('');

  // 根据场景切换预设对话
  const chips = task ? TASK_CHIPS : FREE_CHIPS;

  useEffect(() => { if (taskId) startTask(taskId); }, [taskId, startTask]);
  useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading, imagePreview]);

  useEffect(() => {
    if (voiceMode && lastAIRef.current && tts.supported) {
      tts.speak(lastAIRef.current);
      lastAIRef.current = '';
    }
  }, [messages, voiceMode, tts]);

  useEffect(() => {
    if (voiceMode && !tts.isSpeaking && !tts.isPaused && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant' && !loading && voiceOk && !listening) {
        const timer = setTimeout(() => vStart(), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [tts.isSpeaking, loading, voiceMode, messages]);

  // 图片上传
  const handleImagePick = () => fileRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const removeImage = () => setImagePreview(null);

  /** 发送消息 */
  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    const hasImage = !!imagePreview;
    if ((!msg && !hasImage) || loading) return;

    if (hasImage) {
      addMessage('user', msg || '帮我看看这张截图');
      setImagePreview(null);
      setInput('');
      setLoading(true);
      setTimeout(() => {
        addMessage(
          'assistant',
          '📸 收到你的截图啦！\n\n' +
            '目前演示版本还看不懂图片，不过别急～\n' +
            '你可以用文字描述一下屏幕上有什么，我会一步一步帮你！\n\n' +
            '比如告诉我：\n' +
            '• 你现在用的是什么 App？\n' +
            '• 屏幕上最上面写的什么标题？\n' +
            '• 你看到了什么按钮？'
        );
        setLoading(false);
      }, 1000);
      return;
    }

    if (!msg) return;
    addMessage('user', msg);
    setInput('');
    setLoading(true);

    // 模拟 AI 对话
    const reply = (await getMockReplyAsync(msg)).content;
    addMessage('assistant', reply);
    lastAIRef.current = reply;
    setLoading(false);
  };

  const handleVoice = () => (listening ? vStop() : vStart());

  const toggleVoiceMode = () => {
    if (voiceMode) {
      tts.stop();
      if (listening) vStop();
    }
    setVoiceMode(!voiceMode);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => nav(-1)}>
          <Icon name="arrow-left" size={22} />
        </button>
        <div className={styles.headerTitle}>{task ? task.title : '自由陪练'}</div>
        <div className={styles.headerActions}>
          {tts.supported && (
            <button
              className={`${styles.headerBtn} ${voiceMode ? styles.headerBtnActive : ''}`}
              onClick={toggleVoiceMode}
              title={voiceMode ? '关闭语音' : '语音对话'}
            >
              <Icon name="mic" size={20} color={voiceMode ? '#fff' : 'var(--color-ink-tertiary)'} />
            </button>
          )}
        </div>
      </div>

      {voiceMode && (
        <div className={styles.voiceBanner}>
          <span className={styles.voiceDot} />
          <span>
            语音对话中{listening ? ' — 正在听…' : tts.isSpeaking ? ' — 正在说…' : ''}
          </span>
          <button className={styles.voiceBannerClose} onClick={toggleVoiceMode}>
            关闭
          </button>
        </div>
      )}

      {/* Messages */}
      <div className={styles.msgList}>
        {messages.length === 0 && !imagePreview && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Icon name="message-circle" size={44} color="var(--color-accent)" />
            </div>
            <div className={styles.emptyTitle}>
              {task ? `来练「${task.title}」吧！` : '有什么想学的？'}
            </div>
            <div className={styles.emptyHint}>
              {task ? '我会一步一步陪着您练，慢慢来～' : '点下方标签快速体验 👇\n或者自己打字问我'}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {loading && (
          <div className={styles.typing}>
            <div className={styles.typingDot} />
            <div className={styles.typingDot} />
            <div className={styles.typingDot} />
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* 预设对话标签 —— 始终可见 */}
      <div className={styles.chipsBar}>
        {chips.map((chip) => (
          <button
            key={chip}
            className={styles.chip}
            onClick={() => send(chip)}
            disabled={loading}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className={styles.imgPreview}>
          <img src={imagePreview} alt="截图预览" className={styles.imgPreviewImg} />
          <button className={styles.imgRemove} onClick={removeImage}>
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className={styles.inputBar}>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        <button className={styles.uploadBtn} onClick={handleImagePick} title="上传截图">
          <Icon name="camera" size={22} color="var(--color-ink-tertiary)" />
        </button>
        {voiceOk && (
          <button
            className={`${styles.voiceBtn} ${listening ? styles.voiceActive : ''} ${voiceMode ? styles.voiceBtnBig : ''}`}
            onClick={handleVoice}
          >
            <Icon
              name="mic"
              size={voiceMode ? 26 : 22}
              color={listening ? 'var(--color-red)' : voiceMode ? 'var(--color-accent)' : 'var(--color-ink-tertiary)'}
            />
          </button>
        )}
        <textarea
          className={styles.textInput}
          placeholder={
            imagePreview
              ? '添加文字描述（可选）…'
              : listening
                ? '正在听您说话…'
                : voiceMode
                  ? '语音模式 — 直接说话'
                  : '打字告诉我你想学什么…'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
        />
        <button className={styles.sendBtn} onClick={() => send()} disabled={(!input.trim() && !imagePreview) || loading}>
          <Icon name="send" size={20} color="#fff" />
        </button>
      </div>
    </div>
  );
}
