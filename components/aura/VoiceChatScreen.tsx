'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  RotateCcw,
  AlertCircle,
  Volume2,
  ArrowLeft,
  Settings2,
} from 'lucide-react';
import { ThemeMode, ScreenId } from './types';
import { SUPPORTED_LANGUAGES } from '@/app/lib/utils';

interface VoiceChatScreenProps {
  theme: ThemeMode;
  onNavigate?: (screen: ScreenId) => void;
  onClose?: () => void;
  language?: string;
  speaker?: string;
}

export function VoiceChatScreen({
  theme,
  onNavigate,
  onClose,
  language = 'en-IN',
  speaker = 'shubh',
}: VoiceChatScreenProps) {
  const isDark = theme === 'dark';

  // State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Tap Orb or Mic to speak');
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Refs
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => { });
      }
    };
  }, []);

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // Request browser microphone permission and return the stream
  const requestMicrophonePermission = async (): Promise<MediaStream | null> => {
    setPermissionError(null);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Your browser does not support microphone access.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
      setupAudioAnalyser(stream);
      return stream;
    } catch (err: any) {
      console.error('Microphone permission error:', err);
      let message = 'Microphone permission denied. Please allow microphone access in your browser.';
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'No microphone found on your device.';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Microphone access was blocked. Please click the lock or settings icon in your browser URL bar to allow microphone access.';
      }
      setPermissionError(message);
      setStatus('Microphone access required');
      return null;
    }
  };

  // Setup real-time audio volume visualizer
  const setupAudioAnalyser = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(avg);
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      };
      updateVolume();
    } catch (e) {
      console.warn('AudioContext setup skipped:', e);
    }
  };

  // Start recording
  const startRecording = async () => {
    // Stop any currently playing response audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsPlayingAudio(false);
    }

    let stream = mediaStreamRef.current;
    if (!stream || !stream.active) {
      stream = await requestMicrophonePermission();
    }

    if (!stream) return;

    try {
      audioChunksRef.current = [];
      let mimeType = 'audio/webm;codecs=opus';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else {
            mimeType = '';
          }
        }
      }

      const options = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        const cleanMime = mimeType ? mimeType.split(';')[0] : 'audio/webm';
        const recordedBlob = new Blob(audioChunksRef.current, {
          type: cleanMime,
        });
        if (recordedBlob.size > 500) {
          await processVoiceInput(recordedBlob);
        } else {
          setStatus('No voice detected. Tap to speak.');
        }
      };

      recorder.start(100);
      setIsRecording(true);
      setStatus('Listening... (Tap Orb when finished)');
      setUserTranscript('');
      setAiResponse('');
    } catch (err: any) {
      console.error('Failed to start MediaRecorder:', err);
      setPermissionError('Could not start audio recorder. Please try again.');
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setStatus('Processing audio...');
  };

  // Toggle record / stop
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Process voice: STT -> Groq Analyze -> TTS -> Audio playback
  const processVoiceInput = async (blob: Blob) => {
    try {
      setStatus('Transcribing your speech...');
      const cleanType = blob.type ? blob.type.split(';')[0] : 'audio/webm';
      const cleanFile = new File([blob], 'recording.webm', { type: cleanType });
      const formData = new FormData();
      formData.append('file', cleanFile, 'recording.webm');

      const sttRes = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      });

      const sttData = await sttRes.json();
      if (!sttRes.ok || !sttData.transcript) {
        throw new Error(sttData.error || 'Could not understand audio. Please speak clearly.');
      }

      const transcript = sttData.transcript.trim();
      setUserTranscript(transcript);

      // Analyze with Groq
      setStatus('Aura is analyzing your symptoms...');
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcript,
          history: [],
          language,
        }),
      });

      const analyzeData = await analyzeRes.json();
      const aiReply = analyzeData.response || 'Please consult a healthcare professional for persistent symptoms.';
      setAiResponse(aiReply);

      // Convert response to speech
      setStatus('Generating clinical audio response...');
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: aiReply,
          language,
          speaker,
        }),
      });

      const ttsData = await ttsRes.json();
      if (ttsData.audio) {
        setStatus('Speaking response...');
        setIsPlayingAudio(true);
        const audio = new Audio(`data:audio/wav;base64,${ttsData.audio}`);
        currentAudioRef.current = audio;
        audio.onended = () => {
          setIsPlayingAudio(false);
          setStatus('Ready · Tap Orb to speak again');
        };
        audio.onerror = () => {
          setIsPlayingAudio(false);
          setStatus('Ready · Tap Orb to speak again');
        };
        await audio.play();
      } else {
        setStatus('Ready · Tap Orb to speak again');
      }
    } catch (error: any) {
      console.error('Voice processing error:', error);
      setStatus(error?.message || 'Error occurred. Tap Orb to retry.');
    }
  };

  const isActiveMode = isRecording || isPlayingAudio;

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);
  const currentLangName = currentLangObj ? currentLangObj.name : 'English';
  const speakerDisplayName = speaker.charAt(0).toUpperCase() + speaker.slice(1);

  return (
    <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col items-center justify-between min-h-[calc(100vh-80px)] px-4 py-6 sm:py-10 select-none relative transition-colors">
      {/* Top Header Controls: Back to Profile & Current Voice Avatar / Language Info */}
      <div className="w-full flex items-center justify-between gap-3 mb-2">
        <button
          onClick={() => (onNavigate ? onNavigate('profile') : onClose?.())}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${isDark
            ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:border-slate-300 shadow-xs'
            }`}
          aria-label="Back to Profile Settings"
          title="Back to Profile Settings"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Profile Settings</span>
        </button>

        <button
          onClick={() => (onNavigate ? onNavigate('profile') : onClose?.())}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${isDark
            ? 'bg-teal-950/40 border-teal-800/60 text-teal-300 hover:border-teal-700'
            : 'bg-teal-50 border-teal-200 text-teal-800 hover:border-teal-300'
            }`}
          title="Change language or voice avatar in Profile Settings"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span>
            {speakerDisplayName} · {currentLangName}
          </span>
          <Settings2 className="w-3.5 h-3.5 opacity-70" />
        </button>
      </div>

      {/* Top Status Pill */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
          <span
            className={`w-2 h-2 rounded-full ${isRecording
              ? 'bg-rose-500 animate-ping'
              : isPlayingAudio
                ? 'bg-teal-400 animate-pulse'
                : 'bg-emerald-400'
              }`}
          />
          <span>{status}</span>
        </div>

        {/* Permission Error Banner */}
        {permissionError && (
          <div className="max-w-md mx-auto p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2 text-center mt-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{permissionError}</span>
          </div>
        )}
      </div>

      {/* Center Hero: 3D Glowing Bio Orb */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-6">
        <button
          onClick={toggleRecording}
          aria-label={isRecording ? 'Stop recording voice' : 'Start microphone recording'}
          title={isRecording ? 'Click to finish speaking' : 'Click to start speaking'}
          className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        >
          {/* Multi-Layered Radial Aura Glow */}
          <div
            className={`absolute inset-0 rounded-full blur-3xl transition-all duration-500 ${isRecording
              ? 'bg-rose-500/35 animate-orb-glow'
              : isPlayingAudio
                ? 'bg-teal-500/40 animate-orb-glow'
                : 'bg-teal-500/20'
              }`}
          />

          <div
            className={`absolute inset-4 rounded-full blur-xl transition-all duration-500 ${isRecording
              ? 'bg-amber-400/25'
              : isPlayingAudio
                ? 'bg-emerald-400/30'
                : 'bg-teal-400/15'
              }`}
          />

          {/* Concentric Soft Rings */}
          <div
            className={`absolute inset-2 rounded-full border transition-all duration-500 ${isRecording
              ? 'border-rose-500/40 scale-105'
              : isPlayingAudio
                ? 'border-teal-400/40 scale-105'
                : 'border-teal-500/20 scale-95'
              }`}
          />

          {/* Central 3D Bio Orb */}
          <div
            className={`relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 ${isActiveMode ? 'animate-float-orb scale-100' : 'scale-95'
              }`}
            style={{
              background: isRecording
                ? 'radial-gradient(circle at 35% 30%, #fb7185 0%, #e11d48 50%, #881337 95%)'
                : isDark
                  ? 'radial-gradient(circle at 35% 30%, #2dd4bf 0%, #0d9488 45%, #042f2e 95%)'
                  : 'radial-gradient(circle at 35% 30%, #5eead4 0%, #0d9488 50%, #0f766e 90%)',
              boxShadow: isRecording
                ? '0 20px 50px rgba(225, 29, 72, 0.45), inset 0 2px 6px rgba(255, 255, 255, 0.4)'
                : isDark
                  ? '0 20px 50px rgba(13, 148, 136, 0.45), inset 0 2px 6px rgba(255, 255, 255, 0.4)'
                  : '0 20px 45px rgba(13, 148, 136, 0.35), inset 0 2px 6px rgba(255, 255, 255, 0.6)',
            }}
          >
            {/* Animated Audio Equalizer Waveform inside Orb */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-4 h-12">
              {[0.4, 0.8, 1.2, 0.7, 1.0, 0.5, 0.9].map((delay, idx) => {
                const dynamicHeight = isRecording
                  ? Math.max(10, Math.min(42, (audioLevel / 255) * 80 + idx * 4))
                  : isPlayingAudio
                    ? undefined
                    : 8;

                return (
                  <div
                    key={idx}
                    className={`w-1.5 sm:w-2 bg-white rounded-full transition-all ${isPlayingAudio ? 'animate-wave-bar' : ''
                      }`}
                    style={{
                      height: dynamicHeight ? `${dynamicHeight}px` : undefined,
                      animationDelay: `${delay * 0.25}s`,
                      animationDuration: '1.1s',
                      opacity: isRecording || isPlayingAudio ? 0.95 : 0.4,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </button>

        {/* Dynamic Spoken Transcript & AI Clinical Answer */}
        <div className="text-center px-4 max-w-lg mt-6 mb-2 min-h-[80px] flex flex-col items-center justify-center">
          {userTranscript ? (
            <p
              className={`text-lg sm:text-xl font-bold tracking-tight leading-snug ${isDark ? 'text-white' : 'text-slate-900'
                }`}
            >
              &ldquo;{userTranscript}&rdquo;
            </p>
          ) : (
            <p
              className={`text-sm font-medium ${isDark ? 'text-zinc-500' : 'text-slate-400'
                }`}
            >
              {isRecording
                ? 'Listening to your microphone... Speak clearly.'
                : 'Tap the Microphone button below to speak.'}
            </p>
          )}

          {aiResponse && (
            <p
              className={`text-xs sm:text-sm font-medium mt-3 leading-relaxed ${isDark ? 'text-teal-300' : 'text-teal-800'
                }`}
            >
              {aiResponse}
            </p>
          )}
        </div>
      </div>

      {/* Clean Floating Bottom Control Dock */}
      <div className="w-full flex justify-center z-20 pt-2 pb-6">
        <div
          className={`px-5 py-2.5 rounded-full border shadow-xl backdrop-blur-xl flex items-center gap-5 ${isDark
            ? 'bg-zinc-900/90 border-zinc-800/80 shadow-black/60'
            : 'bg-white/95 border-slate-200 shadow-slate-300/40'
            }`}
        >
          {/* Reset / Clear Button */}
          <button
            onClick={() => {
              if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
              }
              if (isRecording) {
                stopRecording();
              }
              setUserTranscript('');
              setAiResponse('');
              setStatus('Tap Orb or Mic to speak');
              setIsPlayingAudio(false);
            }}
            aria-label="Reset conversation"
            title="Reset conversation"
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px] transition-colors ${isDark
              ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
              : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
          >
            <RotateCcw className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Primary Microphone / Recording Button */}
          <button
            onClick={toggleRecording}
            aria-label={isRecording ? 'Stop recording voice' : 'Start microphone recording'}
            title={isRecording ? 'Stop recording' : 'Start speaking'}
            className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 cursor-pointer min-h-[56px] min-w-[56px] transition-all ${isRecording
              ? 'bg-rose-600 shadow-rose-600/40 animate-pulse'
              : 'bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 shadow-teal-700/35'
              }`}
          >
            {isRecording ? (
              <MicOff className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <Mic className="w-6 h-6 stroke-[2.2]" />
            )}
          </button>

          {/* Audio Playing Indicator / Volume */}
          <button
            onClick={() => {
              if (currentAudioRef.current) {
                if (isPlayingAudio) {
                  currentAudioRef.current.pause();
                  setIsPlayingAudio(false);
                } else {
                  currentAudioRef.current.play();
                  setIsPlayingAudio(true);
                }
              }
            }}
            aria-label="Audio playback"
            title={isPlayingAudio ? 'Pause playback' : 'Play audio'}
            disabled={!currentAudioRef.current}
            className={`w-10 h-10 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${!currentAudioRef.current
              ? 'opacity-40 cursor-not-allowed text-slate-400'
              : isDark
                ? 'bg-zinc-800 text-teal-400 hover:text-white cursor-pointer'
                : 'bg-slate-100 text-teal-600 hover:text-slate-900 cursor-pointer'
              }`}
          >
            <Volume2 className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
}
