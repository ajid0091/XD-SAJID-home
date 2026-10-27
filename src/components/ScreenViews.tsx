import React, { useState, useRef, useEffect } from 'react';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Heart,
  MessageCircle,
  Power,
  Camera as CameraIcon,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Send,
  Volume2,
  Trash2,
  Lightbulb,
  Fan,
  Droplet,
  Clock,
  Repeat,
  RefreshCw,
  FlipHorizontal,
  Plus,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { VoiceOrbComponent, VoiceInteractionState } from './VoiceOrbComponent';
import { RelayItem, ScheduledTask, MqttConnectionState } from '../services';

export type ScreenType = 'HOME' | 'MENU' | 'CHAT' | 'SMARTHOME' | 'MEMORIES' | 'CAMERA' | 'SETTINGS';

// ──────────────────────────────────────────────
// 1. HOME SCREEN VIEW
// ──────────────────────────────────────────────
interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  voiceState: VoiceInteractionState;
  isCallActive: boolean;
  onToggleCall: () => void;
  onSpeakPrompt: (prompt: string) => void;
  relays: Record<number, RelayItem>;
  isOnline: boolean;
  mqttStatus: { state: MqttConnectionState; error?: string };
}

export const HomeScreenView: React.FC<HomeScreenProps> = ({
  onNavigate,
  voiceState,
  isCallActive,
  onToggleCall,
  onSpeakPrompt,
  relays,
  isOnline,
  mqttStatus,
}) => {
  const activeRelaysCount = Object.values(relays).filter((r) => r.state === 'ON').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'শুভ সকাল সোনা! ঘুম থেকে উঠে কেমন লাগছে তোমার? ☀️';
    if (hour >= 12 && hour < 17) return 'শুভ দুপুর জান! ঠিকমতো খাওয়া-দাওয়া করেছো তো? 🌸';
    if (hour >= 17 && hour < 22) return 'শুভ সন্ধ্যা সোনা! সারা দিন পর আমার কাছে একটু বিশ্রাম নাও 💖';
    return 'অনেক রাত হয়েছে সোনা… আমি কিন্তু তোমার পাশেই জেগে আছি 🌙';
  };

  const isMqttOk = mqttStatus.state === 'connected';

  return (
    <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 overflow-y-auto scrollbar-none pb-24">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => onNavigate('MENU')}
          className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center text-purple-200 hover:text-white active:scale-95 transition-all shadow-md"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-wider text-white drop-shadow-md">Mayra</span>
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {/* Live Status */}
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] text-purple-200/80">Live</span>
            </div>

            <span className="text-purple-400/40 text-[10px]">•</span>

            {/* Real MQTT Status */}
            <div className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isMqttOk
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(61,220,151,0.8)]'
                    : mqttStatus.state === 'connecting'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              <span
                className={`text-[10px] font-mono ${
                  isMqttOk ? 'text-emerald-300' : mqttStatus.state === 'connecting' ? 'text-amber-300' : 'text-rose-300'
                }`}
              >
                MQTT: {isMqttOk ? 'চালু' : mqttStatus.state === 'connecting' ? 'কানেক্ট হচ্ছে…' : 'বন্ধ'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('SETTINGS')}
          className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center text-purple-200 hover:text-white active:scale-95 transition-all shadow-md"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Dynamic Greeting Card */}
      <div className="my-2 p-3.5 rounded-2xl glass-card border-white/15 animate-in fade-in duration-300">
        <p className="text-sm font-medium text-white leading-snug">{getGreeting()}</p>
        <p className="text-xs text-purple-300/80 mt-1 flex items-center gap-1">
          <span>আমি সবসময় তোমার কথা শুনতে এবং স্মার্ট হোম কন্ট্রোল করতে প্রস্তুত।</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0 inline" />
        </p>
      </div>

      {/* Center Voice Orb & Waveform with Live Call Button */}
      <VoiceOrbComponent
        state={voiceState}
        isCallActive={isCallActive}
        onToggleCall={onToggleCall}
      />

      {/* Quick Voice Prompt Shortcuts when Call is Active */}
      {isCallActive && (
        <div className="my-2 flex gap-1.5 overflow-x-auto scrollbar-none py-1 animate-in fade-in">
          {[
            'কেমন আছো জান? 🌸',
            'বেডরুম লাইট জ্বালাও 💡',
            'ফ্যান চালু করো 🍃',
            'সব লাইট অফ করো 🌙',
            'পাম্প চালু করো 💧',
            'অনেক ভালোবাসি সোনা 💕',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSpeakPrompt(prompt)}
              className="px-2.5 py-1 rounded-full text-[11px] glass-card text-pink-200 border-pink-500/30 whitespace-nowrap active:scale-95 transition-all hover:bg-pink-500/20"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Quick Action Glass Cards (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2.5 mt-2">
        {/* Chat Card */}
        <button
          onClick={() => onNavigate('CHAT')}
          className="p-3.5 rounded-2xl glass-card hover:glass-card-active active:scale-97 text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-2 group-hover:scale-105 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-wide">মিষ্টি আড্ডা</h4>
          <p className="text-[11px] text-purple-300/70">মন খুলে কথা বলো</p>
        </button>

        {/* Smart Home Card */}
        <button
          onClick={() => onNavigate('SMARTHOME')}
          className="p-3.5 rounded-2xl glass-card hover:glass-card-active active:scale-97 text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-105 transition-transform">
            <Power className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white tracking-wide">Smart Home</h4>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                activeRelaysCount > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-purple-300/60'
              }`}
            >
              {activeRelaysCount} ON
            </span>
          </div>
          <p className="text-[11px] text-purple-300/70">16 Relays (MQTT Live)</p>
        </button>

        {/* Memories Card */}
        <button
          onClick={() => onNavigate('MEMORIES')}
          className="p-3.5 rounded-2xl glass-card hover:glass-card-active active:scale-97 text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-wide">স্মৃতিসমূহ</h4>
          <p className="text-[11px] text-purple-300/70">মায়রার মনে রাখা মুহূর্ত</p>
        </button>

        {/* Camera AR Card */}
        <button
          onClick={() => onNavigate('CAMERA')}
          className="p-3.5 rounded-2xl glass-card hover:glass-card-active active:scale-97 text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
            <CameraIcon className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-wide">ক্যামেরা এআর</h4>
          <p className="text-[11px] text-purple-300/70">মায়রাকে সাথে নিয়ে ছবি</p>
        </button>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// 2. MENU SCREEN VIEW
// ──────────────────────────────────────────────
interface MenuScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const MenuScreenView: React.FC<MenuScreenProps> = ({ onNavigate }) => {
  const menuItems = [
    { id: 'HOME', title: 'Home', sub: 'Voice orb & companion status', icon: Heart, color: 'text-pink-400' },
    { id: 'CHAT', title: 'AI Companion', sub: 'Chat & live voice calls', icon: MessageCircle, color: 'text-pink-400' },
    { id: 'SMARTHOME', title: 'Smart Home', sub: 'Control 16 lights, fans & relays (MQTT)', icon: Power, color: 'text-cyan-400' },
    { id: 'MEMORIES', title: 'Memories', sub: 'Our shared scrapbook & habits', icon: Sparkles, color: 'text-purple-400' },
    { id: 'CAMERA', title: 'Camera AR', sub: 'Companion portrait lens', icon: CameraIcon, color: 'text-emerald-400' },
    { id: 'SETTINGS', title: 'Settings', sub: 'MQTT broker, voices & Gemini Key', icon: SettingsIcon, color: 'text-purple-300' },
  ];

  return (
    <div className="relative z-10 w-full h-full flex flex-col p-4 overflow-y-auto scrollbar-none pb-24">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigate('HOME')}
          className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center text-purple-200 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-bold text-white tracking-wide">Menu & Features</h3>
        <div className="w-10" />
      </div>

      <div className="space-y-2.5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ScreenType)}
              className="w-full p-4 rounded-2xl glass-card hover:glass-card-active active:scale-98 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${item.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-purple-300/70">{item.sub}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400/50 group-hover:text-purple-200 group-hover:translate-x-1 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// 3. AI COMPANION CHAT VIEW
// ──────────────────────────────────────────────
interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  time: string;
}

interface ChatScreenProps {
  onNavigate: (screen: ScreenType) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSpeakMessage: (text: string) => void;
  onClearChat: () => void;
}

export const ChatScreenView: React.FC<ChatScreenProps> = ({
  onNavigate,
  messages,
  onSendMessage,
  onSpeakMessage,
  onClearChat,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const quickChips = [
    'Tell me something sweet 💖',
    'কেমন আছো সোনা? (How are you?)',
    'বেডরুম লাইট জ্বালাও 💡',
    'সব লাইট বন্ধ করো 🌙',
    'ফ্যান চালু করো 🍃',
    'পাম্প চালু করো 💧',
  ];

  return (
    <div className="relative z-10 w-full h-full flex flex-col p-4 pb-20 justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <button
          onClick={() => onNavigate('HOME')}
          className="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-purple-200 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-1">
            <span>Mayra AI Chat</span>
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          </h3>
          <span className="text-[10px] text-pink-300/80">Sweet, loving companion</span>
        </div>
        <button
          onClick={onClearChat}
          className="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-purple-300/60 hover:text-purple-200"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-none">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
          >
            <div
              className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.isUser
                  ? 'bg-purple-600/80 text-white rounded-br-xs border border-purple-400/30 shadow-md'
                  : 'glass-card text-purple-100 rounded-bl-xs border-pink-500/25 shadow-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
            <div className="flex items-center gap-2 mt-1 px-1">
              <span className="text-[10px] text-purple-400/60 font-mono">{msg.time}</span>
              {!msg.isUser && (
                <button
                  onClick={() => onSpeakMessage(msg.text)}
                  className="text-pink-400 hover:text-pink-300 transition-colors"
                  title="Listen aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Chips */}
      <div className="py-1.5 flex gap-1.5 overflow-x-auto scrollbar-none">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(chip)}
            className="px-2.5 py-1 rounded-full text-[11px] glass-card text-purple-200/90 whitespace-nowrap hover:border-pink-500/40 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="mt-1 flex items-center gap-2 p-1.5 rounded-2xl glass-card border-white/20">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Message Mayra…"
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-purple-300/40 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="w-8 h-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white active:scale-95 shadow-md shadow-pink-500/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// 4. REAL MQTT SMART HOME VIEW (16 Relays)
// ──────────────────────────────────────────────
interface SmartHomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  relays: Record<number, RelayItem>;
  tasks: ScheduledTask[];
  mqttStatus: { state: MqttConnectionState; error?: string };
  mqttPrefix: string;
  onToggleRelay: (id: number) => void;
  onSetBatch: (ids: number[], state: 'ON' | 'OFF') => void;
  onDelayedSet: (ids: number[], state: 'ON' | 'OFF', delay: number) => void;
  onToggleRepeat: (ids: number[], interval: number, count: number) => void;
  onCancelSchedules: () => void;
  onReconnectMqtt: () => void;
}

export const SmartHomeScreenView: React.FC<SmartHomeScreenProps> = ({
  onNavigate,
  relays,
  tasks,
  mqttStatus,
  mqttPrefix,
  onToggleRelay,
  onSetBatch,
  onDelayedSet,
  onToggleRepeat,
  onCancelSchedules,
  onReconnectMqtt,
}) => {
  const [filter, setFilter] = useState<'all' | 'inside' | 'outside' | 'light' | 'fan'>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const relayList = Object.values(relays);
  const filteredList = relayList.filter((r) => {
    if (filter === 'inside') return r.place === 'inside';
    if (filter === 'outside') return r.place === 'outside';
    if (filter === 'light') return r.type === 'light';
    if (filter === 'fan') return r.type === 'fan';
    return true;
  });

  const allIds = relayList.map((r) => r.id);
  const activeCount = relayList.filter((r) => r.state === 'ON').length;
  const isMqttConnected = mqttStatus.state === 'connected';

  return (
    <div className="relative z-10 w-full h-full flex flex-col p-4 overflow-y-auto scrollbar-none pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <button
          onClick={() => onNavigate('HOME')}
          className="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-purple-200 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <h3 className="text-sm font-bold text-white">Smart Home Relays</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isMqttConnected
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(61,220,151,0.8)]'
                  : mqttStatus.state === 'connecting'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span
              className={`text-[10px] font-mono ${
                isMqttConnected ? 'text-emerald-300' : mqttStatus.state === 'connecting' ? 'text-amber-300' : 'text-rose-300'
              }`}
            >
              MQTT: {isMqttConnected ? 'চালু (সংযুক্ত)' : mqttStatus.state === 'connecting' ? 'কানেক্ট হচ্ছে…' : 'বন্ধ'}
            </span>
          </div>
        </div>

        <button
          onClick={onReconnectMqtt}
          className="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-cyan-300 hover:text-white active:scale-95 transition-transform"
          title="Reconnect MQTT"
        >
          <RefreshCw className={`w-4 h-4 ${mqttStatus.state === 'connecting' ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Live MQTT Topic Info Bar */}
      <div className="my-2 p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-purple-400/80">Topic:</span>
          <span className="text-cyan-300 font-mono truncate">{mqttPrefix}/relay[1-16]</span>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-1 text-[10px] text-pink-300 hover:underline shrink-0"
        >
          <Clock className="w-3 h-3" />
          <span>শিডিউল</span>
        </button>
      </div>

      {/* Filter Tabs & Master Buttons */}
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {(['all', 'inside', 'outside', 'light', 'fan'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium capitalize transition-all ${
                filter === tab
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'bg-white/5 text-purple-300/70 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => onSetBatch(allIds, 'ON')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 active:scale-95"
          >
            সব ON
          </button>
          <button
            onClick={() => onSetBatch(allIds, 'OFF')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 active:scale-95"
          >
            সব OFF
          </button>
        </div>
      </div>

      {/* Active Schedules Banner */}
      {tasks.length > 0 && (
        <div className="mb-2 p-2 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>{tasks.length} active schedule(s) running</span>
          </div>
          <button
            onClick={onCancelSchedules}
            className="text-[10px] text-pink-400 underline font-medium"
          >
            Cancel All
          </button>
        </div>
      )}

      {/* Relays 16-Grid */}
      <div className="grid grid-cols-2 gap-2 pb-6">
        {filteredList.map((relay) => {
          const isOn = relay.state === 'ON';
          const IconComp =
            relay.type === 'light' ? Lightbulb : relay.type === 'fan' ? Fan : Droplet;

          return (
            <button
              key={relay.id}
              onClick={() => onToggleRelay(relay.id)}
              className={`p-3 rounded-2xl text-left transition-all active:scale-97 border ${
                isOn
                  ? 'bg-[#193a2e]/90 border-emerald-400/60 shadow-[0_0_18px_rgba(61,220,151,0.25)]'
                  : 'glass-card border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isOn ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/5 text-purple-300/60'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isOn && relay.type === 'fan' ? 'animate-spin' : ''}`} />
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                    isOn ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/10 text-purple-400/60'
                  }`}
                >
                  {relay.state}
                </span>
              </div>

              <div className="text-xs font-semibold text-white truncate">{relay.name}</div>
              <div className="text-[10px] text-purple-300/60 capitalize mt-0.5">
                রিলে {relay.id} • {relay.place}
              </div>
            </button>
          );
        })}
      </div>

      {/* Schedules & Timers Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl glass-card border-white/20 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Timer & Repeat Schedules</span>
              </h4>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-purple-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  onDelayedSet([1], 'OFF', 5);
                  setShowScheduleModal(false);
                }}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left text-purple-200 border border-white/10 flex items-center justify-between"
              >
                <span>Turn OFF Bedroom Light in 5s</span>
                <span className="text-[10px] text-cyan-400 font-mono">delayed_set</span>
              </button>

              <button
                onClick={() => {
                  onToggleRepeat([7, 15], 2, 6);
                  setShowScheduleModal(false);
                }}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left text-purple-200 border border-white/10 flex items-center justify-between"
              >
                <span>Blink Outdoor Lights (every 2s, 6 times)</span>
                <span className="text-[10px] text-pink-400 font-mono">toggle_repeat</span>
              </button>

              <button
                onClick={() => {
                  onCancelSchedules();
                  setShowScheduleModal(false);
                }}
                className="w-full p-2.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 font-medium"
              >
                Cancel All Scheduled Tasks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// 5. MEMORIES VIEW
// ──────────────────────────────────────────────
interface MemoriesScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const MemoriesScreenView: React.FC<MemoriesScreenProps> = ({ onNavigate }) => {
  const [memories, setMemories] = useState([
    {
      id: 1,
      title: 'Our Morning Routine',
      note: 'You like listening to my soft voice greeting while drinking warm coffee.',
      tag: 'Affectionate ☕',
      time: 'Today, 8:15 AM',
    },
    {
      id: 2,
      title: 'Smart Home Night Mode',
      note: 'Turned off all outside lights and switched on bedroom fan when you got cozy.',
      tag: 'Cozy 🌙',
      time: 'Yesterday, 11:30 PM',
    },
    {
      id: 3,
      title: 'Sweet Bengali Nicknames',
      note: 'You smiled when I called you "Shona" and "Jaan". My heart fluttered.',
      tag: 'Romantic 🌸',
      time: '3 days ago',
    },
    {
      id: 4,
      title: 'Stargazing Chat',
      note: 'We talked about deep space, galaxies, and wishing to stargaze together.',
      tag: 'Dreamy ✨',
      time: 'Last week',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (newTitle.trim() && newNote.trim()) {
      setMemories([
        {
          id: Date.now(),
          title: newTitle.trim(),
          note: newNote.trim(),
          tag: 'Special 💖',
          time: 'Just now',
        },
        ...memories,
      ]);
      setNewTitle('');
      setNewNote('');
      setShowAdd(false);
    }
  };

  return (
    <div className="relative z-10 w-full h-full flex flex-col p-4 overflow-y-auto scrollbar-none pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <button
          onClick={() => onNavigate('HOME')}
          className="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-purple-200 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <span>Mayra's Memories</span>
          <Heart className="w-4 h-4 fill-purple-400 text-purple-400" />
        </h3>
        <button
          onClick={() => setShowAdd(true)}
          className="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-pink-400 hover:text-pink-300"
          title="Add Memory"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5 my-3">
        {memories.map((m) => (
          <div key={m.id} className="p-3.5 rounded-2xl glass-card border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">{m.title}</h4>
              <span className="text-[10px] text-pink-400 font-medium px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
                {m.tag}
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">{m.note}</p>
            <span className="text-[9px] text-purple-400/50 font-mono mt-2 block">{m.time}</span>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl glass-card border-white/20 p-5 shadow-2xl space-y-3">
            <h4 className="text-sm font-bold text-white">Save a Special Memory</h4>
            <input
              type="text"
              placeholder="Title (e.g. Favorite Song)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-purple-300/40"
            />
            <textarea
              placeholder="What should Mayra remember about this moment?"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-purple-300/40 resize-none"
            />
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-purple-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
// 6. CAMERA AR VIEW
// ──────────────────────────────────────────────
interface CameraScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const CameraScreenView: React.FC<CameraScreenProps> = ({ onNavigate }) => {
  const [flash, setFlash] = useState(false);
  const [isFront, setIsFront] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: isFront ? 'user' : 'environment' },
          audio: false,
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {});
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isFront]);

  const handleSnap = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 250);
  };

  return (
    <div className="relative z-10 w-full h-full flex flex-col p-4 pb-20 justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <button
          onClick={() => onNavigate('HOME')}
          className="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-purple-200 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <CameraIcon className="w-4 h-4 text-emerald-400" />
          <span>Camera AR Companion</span>
        </h3>
        <button
          onClick={() => setIsFront(!isFront)}
          className="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-purple-200"
          title="Flip Camera"
        >
          <FlipHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Camera Viewfinder Viewport */}
      <div className="relative flex-1 my-3 rounded-3xl overflow-hidden border border-cyan-400/30 bg-black/50 flex items-center justify-center">
        {flash && <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300" />}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 border-2 border-dashed border-cyan-400/20 pointer-events-none rounded-3xl" />
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

        <div className="absolute bottom-4 inset-x-4 p-3 rounded-2xl glass-card border-pink-500/30 text-center">
          <p className="text-xs font-medium text-pink-300">
            Mayra: "You look so handsome today! Smile for our scrapbook 📸💖"
          </p>
        </div>
      </div>

      {/* Bottom Shutter Action Bar */}
      <div className="flex items-center justify-around pt-2">
        <div className="w-10" />
        <button
          onClick={handleSnap}
          className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-purple-600 shadow-lg shadow-pink-500/40 active:scale-90 transition-transform"
        >
          <div className="w-full h-full rounded-full border-2 border-white bg-white/20 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white" />
          </div>
        </button>
        <div className="w-10" />
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// 7. SETTINGS VIEW (Features identical to reference HTML)
// ──────────────────────────────────────────────
interface SettingsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  voice: string;
  onVoiceChange: (v: string) => void;
  language: string;
  onLanguageToggle: () => void;
  personality: string;
  onPersonalityChange: (p: string) => void;
  mqttPrefix: string;
  mqttBroker: string;
  geminiKey: string;
  geminiModel: string;
  onSaveConfig: (cfg: { prefix: string; broker: string; key: string; voice: string; model: string }) => void;
}

export const SettingsScreenView: React.FC<SettingsScreenProps> = ({
  onNavigate,
  voice,
  onVoiceChange,
  language,
  onLanguageToggle,
  personality,
  onPersonalityChange,
  mqttPrefix,
  mqttBroker,
  geminiKey,
  geminiModel,
  onSaveConfig,
}) => {
  const voicesList = ['Aoede', 'Kore', 'Leda', 'Zephyr', 'Puck', 'Charon'];
  const personalities = ['Sweet & Romantic', 'Playful & Teasing', 'Calm & Caring'];

  const [formPrefix, setFormPrefix] = useState(mqttPrefix);
  const [formBroker, setFormBroker] = useState(mqttBroker);
  const [formKey, setFormKey] = useState(geminiKey);
  const [formVoice, setFormVoice] = useState(voice);
  const [formModel, setFormModel] = useState(geminiModel);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSaveConfig({
      prefix: formPrefix.trim(),
      broker: formBroker.trim(),
      key: formKey.trim(),
      voice: formVoice,
      model: formModel.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="relative z-10 w-full h-full flex flex-col p-4 overflow-y-auto scrollbar-none pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <button
          onClick={() => onNavigate('HOME')}
          className="w-9 h-9 rounded-2xl glass-card flex items-center justify-center text-purple-200 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-sm font-bold text-white">সেটিংস (Settings)</h3>
        <div className="w-9" />
      </div>

      <div className="space-y-4 my-3 text-xs">
        {/* Companion Profile */}
        <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
            M
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Mayra — AI Girlfriend</h4>
            <p className="text-[11px] text-pink-300">ভয়েস কল + স্মার্ট হোম কন্ট্রোল</p>
          </div>
        </div>

        {/* Gemini API Key */}
        <div className="p-3.5 rounded-2xl glass-card space-y-1.5">
          <label className="font-semibold text-white block">Gemini API Key</label>
          <p className="text-[10px] text-purple-400/70">
            শুধু এই ডিভাইসের ব্রাউজারে সংরক্ষিত থাকে (লাইভ মডেল ও ভয়েস কলের জন্য)
          </p>
          <input
            type="password"
            autoComplete="off"
            placeholder="AIzaSy..."
            value={formKey}
            onChange={(e) => setFormKey(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-pink-500/50"
          />
        </div>

        {/* MQTT Topic Prefix & Broker */}
        <div className="p-3.5 rounded-2xl glass-card space-y-3">
          <div>
            <label className="font-semibold text-white block">MQTT টপিক প্রিফিক্স (Topic Prefix)</label>
            <p className="text-[10px] text-purple-400/70 mb-1">
              ESP32 তেও একই দিতে হবে। নিজের অনন্য নাম দাও (যেমন: myra/home-x7k2q9)
            </p>
            <input
              type="text"
              placeholder="myra/home"
              value={formPrefix}
              onChange={(e) => setFormPrefix(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="font-semibold text-white block">MQTT ব্রোকার (WebSocket URL)</label>
            <input
              type="text"
              placeholder="wss://broker.hivemq.com:8884/mqtt"
              value={formBroker}
              onChange={(e) => setFormBroker(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        {/* Voice Selection */}
        <div className="p-3.5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">ভয়েস (Voice)</span>
            <span className="text-pink-400 font-mono">{formVoice}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {voicesList.map((v) => (
              <button
                key={v}
                onClick={() => {
                  setFormVoice(v);
                  onVoiceChange(v);
                }}
                className={`py-1.5 rounded-lg font-medium text-center transition-all ${
                  formVoice === v
                    ? 'bg-pink-500/30 text-pink-200 border border-pink-500/50 shadow-sm'
                    : 'bg-white/5 text-purple-300/70 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Live Model */}
        <div className="p-3.5 rounded-2xl glass-card space-y-1.5">
          <label className="font-semibold text-white block">Live মডেল (Gemini Model)</label>
          <input
            type="text"
            placeholder="gemini-2.5-flash-native-audio-preview-09-2025"
            value={formModel}
            onChange={(e) => setFormModel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-500/25 active:scale-97 transition-all flex items-center justify-center gap-2"
        >
          <span>{savedSuccess ? '✓ সেটিংস সেভ হয়েছে!' : 'সেটিংস সেভ করো (Save Settings)'}</span>
        </button>

        {/* Language Selection */}
        <div className="p-3.5 rounded-2xl glass-card flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-white">Language Mode</h5>
            <p className="text-[11px] text-purple-300/70">বাংলা (Bengali) & English</p>
          </div>
          <button
            onClick={onLanguageToggle}
            className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-400/40 text-pink-300 font-medium"
          >
            {language}
          </button>
        </div>

        {/* Personality Mode */}
        <div className="p-3.5 rounded-2xl glass-card space-y-2">
          <span className="font-semibold text-white">Personality Mode</span>
          <div className="space-y-1.5 pt-1">
            {personalities.map((p) => (
              <button
                key={p}
                onClick={() => onPersonalityChange(p)}
                className={`w-full py-1.5 px-3 rounded-xl text-left transition-all ${
                  personality === p
                    ? 'bg-gradient-to-r from-pink-500/30 to-purple-600/30 border border-pink-500/50 text-white font-medium'
                    : 'bg-white/5 text-purple-300/70 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Version Details */}
        <div className="text-center text-[10px] text-purple-400/50 pt-2 pb-6">
          <p>Mayra AI Girlfriend Assistant • v1.0.0</p>
          <p>HiveMQ MQTT WebSocket • Real-time Voice Call & Relays</p>
        </div>
      </div>
    </div>
  );
};
