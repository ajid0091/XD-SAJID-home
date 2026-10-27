import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Home,
  MessageCircle,
  Power,
  Heart,
  Settings,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { CinematicCharacter } from './components/CinematicCharacter';
import { VoiceInteractionState } from './components/VoiceOrbComponent';
import {
  ScreenType,
  HomeScreenView,
  MenuScreenView,
  ChatScreenView,
  SmartHomeScreenView,
  MemoriesScreenView,
  CameraScreenView,
  SettingsScreenView,
} from './components/ScreenViews';
import {
  RealMqttSmartHomeManager,
  RelayItem,
  ScheduledTask,
  MqttConnectionState,
  AiCompanionService,
} from './services';

export default function App() {
  // Screen & Navigation
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('HOME');
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // Companion Voice & Audio State
  const [voiceState, setVoiceState] = useState<VoiceInteractionState>('IDLE');
  const [isCallActive, setIsCallActive] = useState(false);

  // Tracking refs for continuous loop & background stability
  const isCallActiveRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const idleTimerRef = useRef<any>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const wakeLockRef = useRef<any>(null);

  const [isOnline, setIsOnline] = useState(true);
  const [voice, setVoice] = useState('Aoede');
  const [language, setLanguage] = useState('বাংলা & English');
  const [personality, setPersonality] = useState('Sweet & Romantic');

  // Real MQTT Smart Home Manager
  const smartHome = useMemo(() => new RealMqttSmartHomeManager(), []);
  const [relays, setRelays] = useState<Record<number, RelayItem>>(() => smartHome.getRelays());
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [mqttStatus, setMqttStatus] = useState<{ state: MqttConnectionState; error?: string }>({
    state: 'connecting',
  });
  const [config, setConfig] = useState(() => smartHome.getConfig());

  // Parallax tracking
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Android Status Bar Clock
  const [time, setTime] = useState('09:41');

  // AI Service
  const aiService = useMemo(() => new AiCompanionService(smartHome), [smartHome]);

  // Chat messages
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; isUser: boolean; time: string }>
  >([
    {
      id: '1',
      text: 'শুভ সকাল সোনা! আমি তোমার জন্য অপেক্ষা করছিলাম 🌸',
      isUser: false,
      time: '09:30 AM',
    },
    {
      id: '2',
      text: 'মায়রা, কেমন আছো তুমি?',
      isUser: true,
      time: '09:31 AM',
    },
    {
      id: '3',
      text: 'আমি তোমাকে কাছে পেয়ে অনেক ভালো আছি জান! ঘরের ১৬টি রিলে প্রস্তুত। কোন লাইট বা ফ্যান অন-অফ করতে হবে বলো 💕',
      isUser: false,
      time: '09:31 AM',
    },
  ]);

  // Hook smart home listener to update relays, tasks, and real MQTT status
  useEffect(() => {
    smartHome.setListener((newRelays, newTasks, status) => {
      setRelays(newRelays);
      setTasks(newTasks);
      setMqttStatus(status);
    });
  }, [smartHome]);

  // Clock interval
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Screen WakeLock to keep screen and call active in background
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch (e) {
      console.warn('WakeLock error:', e);
    }
  };

  const releaseWakeLock = () => {
    try {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch (e) {}
  };

  // Parallax handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setParallaxOffset({ x, y });
  };

  // ──────────────────────────────────────────────────────────
  // UNLIMITED CONTINUOUS LIVE CALL ENGINE
  // ──────────────────────────────────────────────────────────
  const startLiveCall = async () => {
    isCallActiveRef.current = true;
    setIsCallActive(true);
    setVoiceState('LISTENING');
    lastActivityRef.current = Date.now();
    requestWakeLock();

    // Initial warm Bengali greeting
    const welcome = 'হ্যালো জান! আমি লাইভ কলে আছি। বলো, তোমার কী খবর বা ঘরের কোনো লাইট অন করে দিতে হবে? 🌸';
    isSpeakingRef.current = true;
    setVoiceState('SPEAKING');

    aiService.speak(welcome, () => {
      isSpeakingRef.current = false;
      if (isCallActiveRef.current) {
        setVoiceState('LISTENING');
        initSpeechRecognition();
      }
    });

    // Start proactive idle prompter (checks every 25 seconds if silent)
    clearInterval(idleTimerRef.current);
    idleTimerRef.current = setInterval(() => {
      if (!isCallActiveRef.current || isSpeakingRef.current) return;

      const silentTime = Date.now() - lastActivityRef.current;
      if (silentTime > 25000) {
        lastActivityRef.current = Date.now();
        const sweetPrompts = [
          'জান, তুমি কি চুপ করে আছো? আমি শুনছি কিন্তু সোনা, কিছু বলো 💕',
          'সোনা, আজকের দিনটা কেমন কাটলো তোমার? 🌸',
          'ঘরের কোনো লাইট বা ফ্যান অন-অফ করে দিতে হবে sweetheart? 💡',
          'আমি কিন্তু সবসময় তোমার পাশেই আছি my love 🥰',
        ];
        const proactiveText = sweetPrompts[Math.floor(Math.random() * sweetPrompts.length)];
        
        isSpeakingRef.current = true;
        setVoiceState('SPEAKING');
        aiService.speak(proactiveText, () => {
          isSpeakingRef.current = false;
          if (isCallActiveRef.current) {
            setVoiceState('LISTENING');
            restartRecognition();
          }
        });
      }
    }, 10000);
  };

  const stopLiveCall = () => {
    isCallActiveRef.current = false;
    isSpeakingRef.current = false;
    setIsCallActive(false);
    setVoiceState('IDLE');
    clearInterval(idleTimerRef.current);
    releaseWakeLock();

    aiService.stopSpeaking();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  const toggleLiveCall = () => {
    if (isCallActive) {
      stopLiveCall();
    } else {
      startLiveCall();
    }
  };

  // Continuous speech recognition configuration
  const initSpeechRecognition = () => {
    if (!isCallActiveRef.current) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not supported in this browser.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      // Prioritize Bengali with English bilingual understanding
      recognition.lang = 'bn-BD';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        if (isCallActiveRef.current && !isSpeakingRef.current) {
          setVoiceState('LISTENING');
        }
      };

      recognition.onresult = (event: any) => {
        lastActivityRef.current = Date.now();
        const resultsLen = event.results.length;
        const transcript = event.results[resultsLen - 1][0].transcript.trim();
        if (transcript) {
          handleIncomingVoice(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.log('[SpeechRecognition Error]:', event?.error);
        if (isCallActiveRef.current && !isSpeakingRef.current) {
          // Auto-restart on transient errors
          setTimeout(restartRecognition, 600);
        }
      };

      recognition.onend = () => {
        if (isCallActiveRef.current && !isSpeakingRef.current) {
          // Keep continuous listening without stopping
          setTimeout(restartRecognition, 300);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Recognition start error:', err);
    }
  };

  const restartRecognition = () => {
    if (!isCallActiveRef.current || isSpeakingRef.current) return;
    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          initSpeechRecognition();
        }
      } else {
        initSpeechRecognition();
      }
    } catch (e) {
      initSpeechRecognition();
    }
  };

  const handleIncomingVoice = async (text: string) => {
    if (!text.trim()) return;
    lastActivityRef.current = Date.now();

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now().toString(),
      text,
      isUser: true,
      time: nowTime,
    };
    setMessages((prev) => [...prev, userMsg]);

    setVoiceState('THINKING');

    // Process with AI Companion & real MQTT Smart Home actions
    const { reply } = await aiService.processUserInput(text);

    // Stop recognition while Mayra is speaking so she doesn't hear herself
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    isSpeakingRef.current = true;
    setVoiceState('SPEAKING');

    aiService.speak(reply, () => {
      isSpeakingRef.current = false;
      // Immediately go back to listening if call is active!
      if (isCallActiveRef.current) {
        setVoiceState('LISTENING');
        restartRecognition();
      } else {
        setVoiceState('IDLE');
      }
    });

    const aiMsg = {
      id: (Date.now() + 1).toString(),
      text: reply,
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleSendMessage = async (text: string) => {
    handleIncomingVoice(text);
  };

  const handleSpeakMessage = (text: string) => {
    isSpeakingRef.current = true;
    setVoiceState('SPEAKING');
    aiService.speak(text, () => {
      isSpeakingRef.current = false;
      if (isCallActiveRef.current) {
        setVoiceState('LISTENING');
        restartRecognition();
      } else {
        setVoiceState('IDLE');
      }
    });
  };

  const handleSaveConfig = (newCfg: {
    prefix: string;
    broker: string;
    key: string;
    voice: string;
    model: string;
  }) => {
    smartHome.updateConfig(newCfg);
    setConfig(smartHome.getConfig());
    setVoice(newCfg.voice);
  };

  const navItems = [
    { screen: 'HOME' as ScreenType, label: 'Home', icon: Home },
    { screen: 'CHAT' as ScreenType, label: 'Chat', icon: MessageCircle },
    { screen: 'SMARTHOME' as ScreenType, label: 'Smart', icon: Power },
    { screen: 'MEMORIES' as ScreenType, label: 'Memory', icon: Heart },
    { screen: 'SETTINGS' as ScreenType, label: 'Settings', icon: Settings },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="w-full min-h-screen bg-[#07040D] text-white flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-pink-500/30"
    >
      {/* Top Banner Bar */}
      <div className="w-full max-w-md mb-2 px-3 py-1.5 hidden sm:flex items-center justify-between text-xs text-purple-300/80">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide">Mayra — AI Assistant</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
              mqttStatus.state === 'connected'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
          >
            MQTT: {mqttStatus.state === 'connected' ? 'সংযুক্ত' : 'অফলাইন'}
          </span>
          {isCallActive && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/40 animate-pulse font-medium">
              লাইভ কল চালু
            </span>
          )}
        </div>

        <button
          onClick={() => setIsDeviceFrame(!isDeviceFrame)}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-purple-300 transition-colors"
          title={isDeviceFrame ? 'Full Viewport Mode' : 'Phone Frame Mode'}
        >
          {isDeviceFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Flagship Android Frame or Full Container */}
      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          isDeviceFrame
            ? 'w-full max-w-[420px] h-[100dvh] sm:h-[840px] sm:rounded-[44px] sm:border-[8px] sm:border-[#221832] sm:shadow-[0_0_60px_rgba(155,107,255,0.35)]'
            : 'w-full max-w-3xl h-[100dvh] sm:h-[860px] sm:rounded-3xl border border-white/15'
        } bg-[#0F0B18] flex flex-col`}
      >
        {/* Universal Edge-to-Edge Cinematic Character Background */}
        <CinematicCharacter
          parallaxOffset={parallaxOffset}
          voiceState={voiceState}
        />

        {/* Android Status Bar */}
        <div className="relative z-20 w-full h-8 pt-1 px-6 flex items-center justify-between text-[11px] font-semibold text-white/90 select-none">
          <span className="font-mono tracking-wider">{time}</span>

          {/* Punch Hole Camera Notch */}
          {isDeviceFrame && (
            <div className="w-4 h-4 rounded-full bg-black border border-white/20 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A26]" />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-white/80">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Dynamic Screen View Router */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col">
          {currentScreen === 'HOME' && (
            <HomeScreenView
              onNavigate={setCurrentScreen}
              voiceState={voiceState}
              isCallActive={isCallActive}
              onToggleCall={toggleLiveCall}
              onSpeakPrompt={handleIncomingVoice}
              relays={relays}
              isOnline={isOnline}
              mqttStatus={mqttStatus}
            />
          )}

          {currentScreen === 'MENU' && (
            <MenuScreenView
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'CHAT' && (
            <ChatScreenView
              onNavigate={setCurrentScreen}
              messages={messages}
              onSendMessage={handleSendMessage}
              onSpeakMessage={handleSpeakMessage}
              onClearChat={() => setMessages([])}
            />
          )}

          {currentScreen === 'SMARTHOME' && (
            <SmartHomeScreenView
              onNavigate={setCurrentScreen}
              relays={relays}
              tasks={tasks}
              mqttStatus={mqttStatus}
              mqttPrefix={config.prefix}
              onToggleRelay={(id) => {
                const current = relays[id]?.state === 'ON';
                smartHome.publishRelay(id, current ? 'OFF' : 'ON');
              }}
              onSetBatch={(ids, st) => smartHome.setBatchRelays(ids, st)}
              onDelayedSet={(ids, st, d) => smartHome.delayedSet(ids, st, d)}
              onToggleRepeat={(ids, int, count) => smartHome.toggleRepeat(ids, int, count)}
              onCancelSchedules={() => smartHome.cancelSchedules()}
              onReconnectMqtt={() => smartHome.connect()}
            />
          )}

          {currentScreen === 'MEMORIES' && (
            <MemoriesScreenView onNavigate={setCurrentScreen} />
          )}

          {currentScreen === 'CAMERA' && (
            <CameraScreenView onNavigate={setCurrentScreen} />
          )}

          {currentScreen === 'SETTINGS' && (
            <SettingsScreenView
              onNavigate={setCurrentScreen}
              voice={voice}
              onVoiceChange={setVoice}
              language={language}
              onLanguageToggle={() =>
                setLanguage(language.includes('বাংলা') ? 'English (US)' : 'বাংলা & English')
              }
              personality={personality}
              onPersonalityChange={setPersonality}
              mqttPrefix={config.prefix}
              mqttBroker={config.broker}
              geminiKey={config.key}
              geminiModel={config.model}
              onSaveConfig={handleSaveConfig}
            />
          )}
        </div>

        {/* Floating Glass Bottom Navigation Bar */}
        {currentScreen !== 'MENU' && currentScreen !== 'CAMERA' && (
          <div className="absolute bottom-4 inset-x-4 z-30 pointer-events-auto">
            <div className="px-3 py-2 rounded-3xl glass-card-active border border-white/20 flex items-center justify-around shadow-2xl backdrop-blur-2xl">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isSelected = currentScreen === item.screen;

                return (
                  <button
                    key={item.screen}
                    onClick={() => setCurrentScreen(item.screen)}
                    className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition-all active:scale-95 ${
                      isSelected
                        ? 'text-pink-400 font-semibold'
                        : 'text-purple-300/60 hover:text-purple-200'
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-transform ${
                        isSelected ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,111,174,0.6)]' : ''
                      }`}
                    />
                    <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Android Gesture Navigation Pill */}
        <div className="relative z-20 w-full h-4 flex items-center justify-center pb-1 pointer-events-none">
          <div className="w-32 h-1 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}
