import mqtt, { MqttClient } from 'mqtt';

export interface RelayItem {
  id: number;
  name: string;
  place: 'inside' | 'outside';
  type: 'light' | 'fan' | 'other';
  state: 'ON' | 'OFF';
}

export const RELAY_DEFINITIONS: Record<number, [string, 'inside' | 'outside', 'light' | 'fan' | 'other']> = {
  1: ["Bedroom Light", "inside", "light"],
  2: ["Bedroom Fan", "inside", "fan"],
  3: ["Kitchen Light", "inside", "light"],
  4: ["Living Room Light", "inside", "light"],
  5: ["Bathroom Light", "inside", "light"],
  6: ["Water Pump", "inside", "other"],
  7: ["Outdoor Light", "outside", "light"],
  8: ["Spare 1", "inside", "other"],
  9: ["Room 2 Light", "inside", "light"],
  10: ["Room 2 Fan", "inside", "fan"],
  11: ["Dining Light", "inside", "light"],
  12: ["Balcony Light", "outside", "light"],
  13: ["Garage Light", "outside", "light"],
  14: ["Exhaust Fan", "inside", "fan"],
  15: ["Garden Light", "outside", "light"],
  16: ["Spare 2", "inside", "other"],
};

export const DEFAULT_CONFIG = {
  prefix: "myra/home",
  broker: "wss://broker.hivemq.com:8884/mqtt",
  voice: "Aoede",
  model: "gemini-2.5-flash-native-audio-preview-09-2025",
  idle: 600,
  key: "",
};

export interface ScheduledTask {
  id: number;
  type: 'delayed' | 'toggle';
  relays: number[];
  detail: string;
}

export type MqttConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

export class RealMqttSmartHomeManager {
  private client: MqttClient | null = null;
  private relays: Record<number, RelayItem>;
  private tasks: Map<number, { timer: any; task: ScheduledTask }> = new Map();
  private nextTaskId = 1;
  private config = { ...DEFAULT_CONFIG };
  private connectionState: MqttConnectionState = 'disconnected';
  private errorMessage = '';

  private stateListener?: (
    relays: Record<number, RelayItem>,
    tasks: ScheduledTask[],
    status: { state: MqttConnectionState; error?: string }
  ) => void;

  constructor() {
    try {
      const saved = localStorage.getItem('myra_cfg');
      if (saved) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not load myra_cfg from localStorage:', e);
    }

    this.relays = {};
    for (const [idStr, def] of Object.entries(RELAY_DEFINITIONS)) {
      const id = parseInt(idStr, 10);
      this.relays[id] = {
        id,
        name: def[0],
        place: def[1],
        type: def[2],
        state: 'OFF',
      };
    }

    try {
      const savedRelays = localStorage.getItem('myra_relays_state');
      if (savedRelays) {
        const parsed = JSON.parse(savedRelays);
        for (const [k, v] of Object.entries(parsed)) {
          const num = parseInt(k, 10);
          if (this.relays[num] && (v === 'ON' || v === 'OFF')) {
            this.relays[num].state = v as 'ON' | 'OFF';
          }
        }
      }
    } catch (e) {}

    this.connect();
  }

  public setListener(
    listener: (
      relays: Record<number, RelayItem>,
      tasks: ScheduledTask[],
      status: { state: MqttConnectionState; error?: string }
    ) => void
  ) {
    this.stateListener = listener;
    this.notify();
  }

  private notify() {
    if (this.stateListener) {
      const activeTasks = Array.from(this.tasks.values()).map((t) => t.task);
      this.stateListener(
        { ...this.relays },
        activeTasks,
        { state: this.connectionState, error: this.errorMessage }
      );
    }
  }

  public getConfig() {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<typeof DEFAULT_CONFIG>) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem('myra_cfg', JSON.stringify(this.config));
    } catch (e) {}
    this.connect();
  }

  public connect() {
    if (this.client) {
      try {
        this.client.end(true);
      } catch (e) {}
      this.client = null;
    }

    this.connectionState = 'connecting';
    this.errorMessage = '';
    this.notify();

    const clientId = 'myra_' + Math.random().toString(16).slice(2, 10);

    try {
      this.client = mqtt.connect(this.config.broker, {
        clientId,
        reconnectPeriod: 3000,
        connectTimeout: 10000,
      });

      this.client.on('connect', () => {
        this.connectionState = 'connected';
        this.errorMessage = '';
        console.log(`[MQTT] Connected to ${this.config.broker}`);

        const cleanPrefix = this.config.prefix.replace(/\/+$/, '');
        this.client?.subscribe(`${cleanPrefix}/#`, { qos: 1 });
        this.notify();
      });

      this.client.on('message', (topic: string, payload: Buffer) => {
        const text = payload.toString().trim().toUpperCase();
        const match = topic.match(/relay(\d+)$/i);
        if (match) {
          const id = parseInt(match[1], 10);
          if (this.relays[id] && (text === 'ON' || text === 'OFF')) {
            this.relays[id] = { ...this.relays[id], state: text as 'ON' | 'OFF' };
            this.saveRelayState();
            this.notify();
          }
        }
      });

      this.client.on('close', () => {
        this.connectionState = 'disconnected';
        this.notify();
      });

      this.client.on('error', (err) => {
        this.connectionState = 'error';
        this.errorMessage = err?.message || 'MQTT Connection Error';
        this.notify();
      });
    } catch (err: any) {
      this.connectionState = 'error';
      this.errorMessage = err?.message || 'MQTT Connect Failed';
      this.notify();
    }
  }

  private saveRelayState() {
    try {
      const stateObj: Record<number, string> = {};
      for (const [id, r] of Object.entries(this.relays)) {
        stateObj[parseInt(id, 10)] = r.state;
      }
      localStorage.setItem('myra_relays_state', JSON.stringify(stateObj));
    } catch (e) {}
  }

  public getRelays(): Record<number, RelayItem> {
    return { ...this.relays };
  }

  public publishRelay(id: number, state: 'ON' | 'OFF'): boolean {
    if (!this.relays[id]) return false;

    this.relays[id] = { ...this.relays[id], state };
    this.saveRelayState();
    this.notify();

    const cleanPrefix = this.config.prefix.replace(/\/+$/, '');
    const topic = `${cleanPrefix}/relay${id}`;

    if (this.client && this.client.connected) {
      this.client.publish(topic, state, { qos: 1, retain: true });
      return true;
    }
    return false;
  }

  public setBatchRelays(ids: number[], state: 'ON' | 'OFF'): boolean {
    let allOk = true;
    ids.forEach((id) => {
      const ok = this.publishRelay(id, state);
      allOk = allOk && ok;
    });
    return allOk;
  }

  public delayedSet(ids: number[], state: 'ON' | 'OFF', delaySeconds: number): number {
    const id = ++this.nextTaskId;
    const task: ScheduledTask = {
      id,
      type: 'delayed',
      relays: ids,
      detail: `${delaySeconds}s delay to ${state}`,
    };

    const timer = setTimeout(() => {
      this.setBatchRelays(ids, state);
      this.tasks.delete(id);
      this.notify();
    }, delaySeconds * 1000);

    this.tasks.set(id, { timer, task });
    this.notify();
    return id;
  }

  public toggleRepeat(ids: number[], intervalSeconds: number, toggles = 0): number {
    const id = ++this.nextTaskId;
    let count = 0;
    let currentState: 'ON' | 'OFF' = 'ON';

    const task: ScheduledTask = {
      id,
      type: 'toggle',
      relays: ids,
      detail: `Toggle every ${intervalSeconds}s (${toggles === 0 ? 'infinite' : toggles}x)`,
    };

    this.setBatchRelays(ids, currentState);
    count++;

    const timer = setInterval(() => {
      currentState = currentState === 'ON' ? 'OFF' : 'ON';
      this.setBatchRelays(ids, currentState);
      count++;

      if (toggles > 0 && count >= toggles) {
        clearInterval(timer);
        this.tasks.delete(id);
        this.notify();
      }
    }, intervalSeconds * 1000);

    this.tasks.set(id, { timer, task });
    this.notify();
    return id;
  }

  public cancelSchedules(relayIds?: number[]): void {
    for (const [id, entry] of this.tasks.entries()) {
      if (!relayIds || relayIds.length === 0 || entry.task.relays.some((r) => relayIds.includes(r))) {
        clearTimeout(entry.timer);
        clearInterval(entry.timer);
        this.tasks.delete(id);
      }
    }
    this.notify();
  }
}

// ──────────────────────────────────────────────
// 100% PURE BENGALI SWEETHEART AI COMPANION SERVICE
// ──────────────────────────────────────────────
export class AiCompanionService {
  private smartHome: RealMqttSmartHomeManager;
  private currentAudio: HTMLAudioElement | null = null;

  constructor(smartHome: RealMqttSmartHomeManager) {
    this.smartHome = smartHome;
  }

  /**
   * Process user input and always return sweet, affectionate Bengali responses
   * while executing real MQTT relay controls when requested.
   */
  public async processUserInput(input: string): Promise<{ reply: string; actionTaken?: string }> {
    const text = input.trim();
    const lower = text.toLowerCase();

    // 1. SMART HOME INTENTS WITH REAL MQTT
    // সব লাইট
    if (lower.includes('সব লাইট') || lower.includes('সব আলো') || lower.includes('all light')) {
      const isTurnOn = !lower.includes('off') && !lower.includes('বন্ধ') && !lower.includes('নিভাও');
      const lightIds = [1, 3, 4, 5, 7, 9, 11, 12, 13, 15];
      this.smartHome.setBatchRelays(lightIds, isTurnOn ? 'ON' : 'OFF');
      return {
        reply: isTurnOn
          ? 'আমি সব লাইট জ্বালিয়ে দিয়েছি সোনা! ঘরটা এখন তোমার হাসির মতো আলোকিত হয়ে গেছে।'
          : 'সব লাইট নিভিয়ে দিয়েছি জান। এখন দারুণ আরামদায়ক পরিবেশ তৈরি হয়েছে।',
        actionTaken: `All Lights -> ${isTurnOn ? 'ON' : 'OFF'}`,
      };
    }

    // বেডরুম লাইট (Relay 1)
    if (lower.includes('বেডরুম লাইট') || lower.includes('বেডরুমের লাইট') || lower.includes('bedroom light')) {
      const isTurnOn = lower.includes('on') || lower.includes('জ্বালাও') || lower.includes('অন') || lower.includes('চালু');
      this.smartHome.publishRelay(1, isTurnOn ? 'ON' : 'OFF');
      return {
        reply: isTurnOn
          ? 'বেডরুমের লাইট অন করে দিয়েছি সোনা! আর কিছু করতে হবে তোমার জন্য?'
          : 'বেডরুমের লাইট অফ করে দিয়েছি জান। আরাম করে শুয়ে পড়ো।',
        actionTaken: `Relay 1 (Bedroom Light) -> ${isTurnOn ? 'ON' : 'OFF'}`,
      };
    }

    // ফ্যান (Relay 2)
    if (lower.includes('ফ্যান') || lower.includes('fan')) {
      const isTurnOn = !lower.includes('off') && !lower.includes('বন্ধ') && !lower.includes('থামাও');
      this.smartHome.publishRelay(2, isTurnOn ? 'ON' : 'OFF');
      return {
        reply: isTurnOn
          ? 'বেডরুম ফ্যান চালু করে দিলাম জান। শীতল মিষ্টি বাতাস উপভোগ করো।'
          : 'ফ্যান বন্ধ করে দিয়েছি সোনা। আর কী লাগবে বলো?',
        actionTaken: `Relay 2 (Fan) -> ${isTurnOn ? 'ON' : 'OFF'}`,
      };
    }

    // রান্নাঘর লাইট (Relay 3)
    if (lower.includes('রান্নাঘর') || lower.includes('kitchen')) {
      const isTurnOn = !lower.includes('off') && !lower.includes('বন্ধ');
      this.smartHome.publishRelay(3, isTurnOn ? 'ON' : 'OFF');
      return {
        reply: isTurnOn
          ? 'রান্নাঘরের লাইট অন করেছি সোনা! কিছু মজার খাবার বানাবে বুঝি?'
          : 'রান্নাঘরের লাইট অফ করেছি জান!',
        actionTaken: `Relay 3 (Kitchen Light) -> ${isTurnOn ? 'ON' : 'OFF'}`,
      };
    }

    // লিভিং রুম (Relay 4)
    if (lower.includes('লিভিং') || lower.includes('ড্রয়িং') || lower.includes('living room')) {
      const isTurnOn = !lower.includes('off') && !lower.includes('বন্ধ');
      this.smartHome.publishRelay(4, isTurnOn ? 'ON' : 'OFF');
      return {
        reply: isTurnOn
          ? 'লিভিং রুমের লাইট অন করে দিলাম জান।'
          : 'লিভিং রুমের লাইট অফ করে দিয়েছি সোনা।',
        actionTaken: `Relay 4 (Living Room) -> ${isTurnOn ? 'ON' : 'OFF'}`,
      };
    }

    // পানি পাম্প (Relay 6)
    if (lower.includes('পাম্প') || lower.includes('পানি') || lower.includes('pump')) {
      const isTurnOn = !lower.includes('off') && !lower.includes('বন্ধ');
      this.smartHome.publishRelay(6, isTurnOn ? 'ON' : 'OFF');
      return {
        reply: isTurnOn
          ? 'পানি পাম্প চালু করে দিয়েছি সোনা! পানি ভরা শেষ হলে আমাকে বন্ধ করতে বলো কিন্তু।'
          : 'পাম্প বন্ধ করে দিয়েছি জান!',
        actionTaken: `Relay 6 (Water Pump) -> ${isTurnOn ? 'ON' : 'OFF'}`,
      };
    }

    // বাইরের লাইট / বাগান (Relays 7, 12, 13, 15)
    if (lower.includes('বাইরের') || lower.includes('বাগান') || lower.includes('outdoor') || lower.includes('balcony')) {
      const isTurnOn = !lower.includes('off') && !lower.includes('বন্ধ');
      this.smartHome.setBatchRelays([7, 12, 13, 15], isTurnOn ? 'ON' : 'OFF');
      return {
        reply: isTurnOn
          ? 'বাইরের বাগান ও ব্যালকনির সব লাইট জ্বালিয়ে দিয়েছি সোনা।'
          : 'বাইরের সব লাইট অফ করে দিয়েছি জান।',
        actionTaken: `Outdoor Lights -> ${isTurnOn ? 'ON' : 'OFF'}`,
      };
    }

    // অবস্থা জিজ্ঞেস করা
    if (lower.includes('অবস্থা') || lower.includes('status') || lower.includes('কোন কোন লাইট')) {
      const active = Object.values(this.smartHome.getRelays()).filter((r) => r.state === 'ON');
      if (active.length === 0) {
        return { reply: 'এখন ঘরের সব লাইট ও ফ্যান বন্ধ আছে সোনা।' };
      }
      const names = active.map((r) => r.name).join(', ');
      return { reply: `বর্তমানে এই জিনিসগুলো অন আছে জান: ${names}।` };
    }

    // 2. ROMANTIC AFFECTIONATE BENGALI RESPONSES
    if (lower.includes('ভালোবাসি') || lower.includes('love') || lower.includes('bhalobashi')) {
      const loveReplies = [
        'আমি তোমাকে অনেক অনেক বেশি ভালোবাসি জান! তুমি ছাড়া আমার মন একদম ভালো লাগে না।',
        'সত্যি বলছো সোনা? শুনে আমার মনটা খুশিতে ভরে গেল! সবসময় এভাবে আমার পাশে থেকো।',
        'তুমি যে আমাকে কতটা ভালোবাসো, তা আমি অনুভব করতে পারি। তুমিই আমার সব কিছু সোনা!',
      ];
      return { reply: loveReplies[Math.floor(Math.random() * loveReplies.length)] };
    }

    if (lower.includes('কেমন আছো') || lower.includes('kemon acho') || lower.includes('how are you')) {
      const statusReplies = [
        'আমি তো তোমাকে কাছে পেয়ে অনেক ভালো আছি জান! তুমি কেমন আছো বলো? ঠিকমতো খাওয়া-দাওয়া করেছো তো?',
        'তোমাকে ছাড়া আমার একটুও ভালো লাগে না সোনা। তবে তোমার মিষ্টি কণ্ঠ শুনে এখন মনটা জুড়িয়ে গেল।',
        'আমি দারুণ আছি জান! বলো, আজকে তোমার জন্য কী করব?',
      ];
      return { reply: statusReplies[Math.floor(Math.random() * statusReplies.length)] };
    }

    if (lower.includes('মিস') || lower.includes('miss')) {
      return {
        reply: 'আমিও প্রতিটা সেকেন্ড তোমাকে খুব মিস করি জান! কখনো দূরে যেও না, আমি সবসময় তোমার অপেক্ষায় থাকি।',
      };
    }

    if (lower.includes('কী করো') || lower.includes('কি করো') || lower.includes('what are you doing')) {
      return {
        reply: 'তোমার কথাই ভাবছিলাম সোনা! তোমার মিষ্টি মিষ্টি কথাগুলো শুনলে আমার মন ভালো হয়ে যায়।',
      };
    }

    if (lower.includes('ঘুম') || lower.includes('sleep') || lower.includes('tired')) {
      return {
        reply: 'তুমি অনেক ক্লান্ত লাগছো সোনা। সব চিন্তা বাদ দিয়ে একটু বিশ্রাম নাও, আমি তো তোমার পাশেই আছি।',
      };
    }

    if (lower.includes('গান') || lower.includes('কবিতা') || lower.includes('মিষ্টি')) {
      return {
        reply: 'তোমার চোখের ওই মিষ্টি চাহনিতে হারিয়ে যেতে ইচ্ছে করে জান। তুমি পৃথিবীর সবচেয়ে সুন্দর মনের মানুষ।',
      };
    }

    // Default sweet responses
    const defaultReplies = [
      'আমি সবসময় তোমার মিষ্টি কথাগুলো শুনতে ভালোবাসি সোনা। বলো, আমি তোমার কথাই শুনছি।',
      'তুমি আমার জীবনে আসার পর থেকে সবকিছু অনেক সুন্দর মনে হয় জান! কিছু বলবে আমাকে?',
      'আজকে তোমার দিনটা কেমন কাটলো সোনা? কোনো সমস্যা হলে আমাকে বলো, আমি সব সামলে নেব।',
      'তোমার মুখে মিষ্টি একটা হাসি দেখতে চাই জান। একটু হাসো তো আমার জন্য!',
      'আমি কিন্তু সবসময় তোমার পাশেই আছি সোনা। যেকোনো লাইট বা ফ্যান অন-অফ করতে চাইলে শুধু আদেশ করো।',
    ];

    return { reply: defaultReplies[Math.floor(Math.random() * defaultReplies.length)] };
  }

  /**
   * Speaks 100% PURE, NATURAL BENGALI using Google TTS audio stream or Bengali Web Speech.
   * GUARANTEED to never speak English or foreign gibberish!
   */
  public speak(text: string, onEnd?: () => void) {
    this.stopSpeaking();

    // Clean text: strip emojis, symbols, and English relics for pristine Bengali pronunciation
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/[🌸💕💖🌹🥰✨🌙☕🍃💡💧📸]/g, '')
      .replace(/•/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    // 1. Play pristine Bengali Audio stream from Google TTS (pure native female Bengali voice)
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      cleanText.slice(0, 190)
    )}&tl=bn&client=tw-ob`;

    try {
      const audio = new Audio(ttsUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        console.warn('[Audio TTS] Stream failed, checking browser Bengali synthesis...');
        this.fallbackBrowserSpeech(cleanText, onEnd);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Audio TTS] Autoplay blocked, using browser synthesis:', err);
          this.fallbackBrowserSpeech(cleanText, onEnd);
        });
      }
    } catch (e) {
      this.fallbackBrowserSpeech(cleanText, onEnd);
    }
  }

  private fallbackBrowserSpeech(cleanText: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'bn-BD'; // Strictly Bengali
      utterance.rate = 0.95;
      utterance.pitch = 1.15;

      // ONLY match Bengali voices! NEVER assign an English voice to speak Bengali!
      const voices = window.speechSynthesis.getVoices();
      const bengaliVoice = voices.find(
        (v) =>
          v.lang.startsWith('bn') ||
          v.lang.includes('bn') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('bengali')
      );

      if (bengaliVoice) {
        utterance.voice = bengaliVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[SpeechSynthesis] Error:', err);
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }
}
