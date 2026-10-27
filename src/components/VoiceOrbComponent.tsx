import React from 'react';
import { Mic, Volume2, Loader2, PhoneCall, PhoneOff } from 'lucide-react';

export type VoiceInteractionState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING';

interface VoiceOrbComponentProps {
  state: VoiceInteractionState;
  isCallActive: boolean;
  onToggleCall: () => void;
  audioLevel?: number;
}

export const VoiceOrbComponent: React.FC<VoiceOrbComponentProps> = ({
  state,
  isCallActive,
  onToggleCall,
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-2 relative select-none">
      {/* Voice Orb Container - Clicking orb toggles live call */}
      <div
        onClick={onToggleCall}
        className="relative w-44 h-44 flex items-center justify-center cursor-pointer group"
      >
        {/* Pulsing Outer Neon Glow Aura */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
            state === 'LISTENING'
              ? 'bg-cyan-500/50 scale-125'
              : state === 'SPEAKING'
              ? 'bg-pink-500/55 scale-120 animate-pulse'
              : state === 'THINKING'
              ? 'bg-purple-500/45 scale-110'
              : isCallActive
              ? 'bg-pink-500/40 scale-110'
              : 'bg-gradient-to-r from-pink-500/25 to-purple-600/30 scale-100 group-hover:scale-105'
          }`}
        />

        {/* Outer Rotating Cyber Orbital Ring 1 */}
        <div
          className={`absolute w-40 h-40 rounded-full border border-dashed transition-all duration-500 ${
            state === 'LISTENING'
              ? 'border-cyan-400/80 animate-ring-spin-fast scale-105'
              : state === 'THINKING'
              ? 'border-purple-400/80 animate-ring-spin-fast'
              : isCallActive
              ? 'border-pink-400/60 animate-ring-spin'
              : 'border-pink-500/35 animate-ring-spin'
          }`}
        />

        {/* Outer Orbital Ring 2 (Counter-spin) */}
        <div
          className={`absolute w-36 h-36 rounded-full border border-dotted transition-all duration-500 ${
            state === 'LISTENING'
              ? 'border-cyan-300/60 [animation:ring-spin_4s_linear_infinite_reverse]'
              : 'border-purple-300/30 [animation:ring-spin_12s_linear_infinite_reverse]'
          }`}
        />

        {/* Pulse Ripple Waves when Call is Active */}
        {isCallActive && (
          <div
            className={`absolute w-32 h-32 rounded-full border animate-ping opacity-60 ${
              state === 'LISTENING' ? 'border-cyan-400' : 'border-pink-400'
            }`}
          />
        )}

        {/* Core Sphere with Radial Neon Gradient */}
        <div
          className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
            state === 'LISTENING'
              ? 'scale-110 shadow-[0_0_50px_rgba(0,229,255,0.7)] bg-gradient-to-tr from-cyan-600 via-teal-400 to-white'
              : state === 'SPEAKING'
              ? 'animate-orb-pulse shadow-[0_0_50px_rgba(255,111,174,0.7)] bg-gradient-to-tr from-purple-700 via-pink-500 to-pink-200'
              : state === 'THINKING'
              ? 'scale-105 shadow-[0_0_40px_rgba(155,107,255,0.7)] bg-gradient-to-tr from-indigo-800 via-purple-600 to-cyan-300'
              : isCallActive
              ? 'animate-orb-pulse shadow-[0_0_40px_rgba(255,111,174,0.6)] bg-gradient-to-tr from-[#251342] via-[#9e3a93] to-[#FF6FAE]'
              : 'animate-orb-pulse shadow-[0_0_35px_rgba(255,111,174,0.4)] bg-gradient-to-tr from-[#1E1138] via-[#85347B] to-[#FF6FAE] group-hover:scale-105'
          }`}
        >
          {/* Inner Light Reflection Specular */}
          <div className="absolute top-2 left-3 w-8 h-4 rounded-full bg-white/40 blur-[2px] transform -rotate-30" />

          {/* Central State Icon */}
          <div className="text-white drop-shadow-md z-10">
            {state === 'IDLE' && !isCallActive && <Mic className="w-9 h-9 text-white/95" />}
            {isCallActive && state === 'IDLE' && <Mic className="w-10 h-10 text-pink-200 animate-pulse" />}
            {state === 'LISTENING' && <Mic className="w-10 h-10 text-slate-900 animate-pulse" />}
            {state === 'THINKING' && <Loader2 className="w-9 h-9 text-white animate-spin" />}
            {state === 'SPEAKING' && <Volume2 className="w-9 h-9 text-white animate-bounce" />}
          </div>
        </div>
      </div>

      {/* Prominent Live Call Button (Matching reference Myra Live) */}
      <button
        onClick={onToggleCall}
        className={`mt-2 w-full max-w-[280px] py-3 px-5 rounded-2xl font-bold text-sm tracking-wide shadow-lg transition-all active:scale-97 flex items-center justify-center gap-2 ${
          isCallActive
            ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white shadow-rose-600/35 border border-rose-400/50 animate-pulse'
            : 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white shadow-pink-500/30 border border-white/20'
        }`}
      >
        {isCallActive ? (
          <>
            <PhoneOff className="w-4 h-4" />
            <span>■ লাইভ কল বন্ধ করো (End Call)</span>
          </>
        ) : (
          <>
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>▶ মায়রাকে কল করো (Live Call)</span>
          </>
        )}
      </button>

      {/* Real-time State Label */}
      <div className="mt-2.5 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <span
          className={`w-2 h-2 rounded-full ${
            state === 'LISTENING'
              ? 'bg-cyan-400 animate-ping'
              : state === 'SPEAKING'
              ? 'bg-pink-400 animate-pulse'
              : state === 'THINKING'
              ? 'bg-purple-400 animate-pulse'
              : isCallActive
              ? 'bg-emerald-400 animate-ping'
              : 'bg-purple-400/50'
          }`}
        />
        <span
          className={`text-xs font-medium tracking-wide ${
            state === 'LISTENING'
              ? 'text-cyan-300'
              : state === 'SPEAKING'
              ? 'text-pink-300'
              : state === 'THINKING'
              ? 'text-purple-300'
              : isCallActive
              ? 'text-emerald-300'
              : 'text-purple-200/80'
          }`}
        >
          {isCallActive ? (
            state === 'LISTENING'
              ? 'মায়রা শুনছে… কথা বলো জান 🌸'
              : state === 'THINKING'
              ? 'মায়রা চিন্তা করছে…'
              : state === 'SPEAKING'
              ? 'মায়রা কথা বলছে… 💕'
              : 'লাইভ কল সংযুক্ত (মাইক চালু আছে)'
          ) : (
            'কল করতে ট্যাপ করো (Tap to Call)'
          )}
        </span>
      </div>

      {/* Audio Waveform Bars */}
      <div className="mt-2.5 w-60 h-7 flex items-center justify-center gap-1">
        {Array.from({ length: 22 }).map((_, i) => {
          const isActive = isCallActive || state === 'LISTENING' || state === 'SPEAKING';
          const height = isActive
            ? Math.max(5, Math.min(26, (Math.sin(i * 0.7 + Date.now() / 180) + 1.2) * 11))
            : 3;

          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                state === 'LISTENING'
                  ? 'bg-gradient-to-t from-cyan-500 to-teal-300'
                  : state === 'SPEAKING'
                  ? 'bg-gradient-to-t from-pink-500 to-purple-400'
                  : isCallActive
                  ? 'bg-gradient-to-t from-pink-500/70 to-cyan-400/70'
                  : 'bg-purple-400/20'
              }`}
              style={{
                height: `${height}px`,
                animationDelay: `${i * 40}ms`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
