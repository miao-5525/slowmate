import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Web Speech API — TTS 语音播报 Hook
 * 支持中文，Chrome/Safari 移动端均可用
 */

interface UseTTSResult {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  replay: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  supported: boolean;
}

export function useTTS(): UseTTSResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const lastText = useRef('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported) return;
    window.speechSynthesis.cancel(); // stop any current speech
    lastText.current = text;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.9;       // slightly slower for elderly
    u.pitch = 1.05;
    u.volume = 1;

    // try to pick a Chinese female voice
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.startsWith('zh') && v.name.includes('Female'))
      || voices.find(v => v.lang.startsWith('zh-CN'))
      || voices.find(v => v.lang.startsWith('zh'));
    if (zhVoice) u.voice = zhVoice;

    u.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    u.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    u.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
    u.onpause = () => { setIsPaused(true); };
    u.onresume = () => { setIsPaused(false); };

    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, [supported]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    window.speechSynthesis?.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis?.resume();
    setIsPaused(false);
  }, []);

  const replay = useCallback(() => {
    if (lastText.current) speak(lastText.current);
  }, [speak]);

  return { speak, stop, pause, resume, replay, isSpeaking, isPaused, supported };
}
