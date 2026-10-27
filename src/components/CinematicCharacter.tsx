import React from 'react';

interface CinematicCharacterProps {
  parallaxOffset?: { x: number; y: number };
  voiceState?: 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING';
  customImage?: string | null;
}

export const CinematicCharacter: React.FC<CinematicCharacterProps> = ({
  parallaxOffset = { x: 0, y: 0 },
  voiceState = 'IDLE',
  customImage,
}) => {
  const isSpeaking = voiceState === 'SPEAKING';
  const isListening = voiceState === 'LISTENING';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Dynamic Ambient Neon Lighting / Radial Blooms */}
      <div
        className={`absolute -top-24 left-1/2 -translate-x-1/2 w-[460px] h-[460px] rounded-full blur-[90px] transition-all duration-1000 ${
          isListening
            ? 'bg-cyan-500/35 scale-110'
            : isSpeaking
            ? 'bg-pink-500/40 scale-105'
            : 'bg-purple-600/30'
        }`}
      />
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-pink-500/20 blur-[80px]" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-[80px]" />

      {/* Character Visual Container with Parallax & Breathing Motion */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out animate-character-breathe"
        style={{
          transform: `translate3d(${parallaxOffset.x * 14}px, ${parallaxOffset.y * 14}px, 0)`,
        }}
      >
        {customImage ? (
          <img
            src={customImage}
            alt="Mayra AI Character"
            className="w-full h-full object-cover object-top filter contrast-[1.05] brightness-95"
          />
        ) : (
          /* High-Definition Cinematic Mayra Vector Portrait */
          <svg
            className="w-full h-full max-w-[500px] object-cover"
            viewBox="0 0 500 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="cyberSky" x1="250" y1="0" x2="250" y2="900" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#140D24" />
                <stop offset="35%" stopColor="#1E1336" />
                <stop offset="70%" stopColor="#150B24" />
                <stop offset="100%" stopColor="#0B0614" />
              </linearGradient>

              <radialGradient id="hairGlow" cx="250" cy="280" r="220" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF6FAE" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#9B6BFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="hairStrands" x1="120" y1="120" x2="380" y2="580" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3A1C52" />
                <stop offset="30%" stopColor="#6C2E7D" />
                <stop offset="60%" stopColor="#FF6FAE" />
                <stop offset="100%" stopColor="#2E1B4E" />
              </linearGradient>

              <linearGradient id="skinTone" x1="250" y1="180" x2="250" y2="380" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF2F4" />
                <stop offset="50%" stopColor="#FED7E2" />
                <stop offset="100%" stopColor="#E2A6C4" />
              </linearGradient>

              <linearGradient id="neonChoker" x1="200" y1="370" x2="300" y2="390" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#FF6FAE" />
              </linearGradient>

              <linearGradient id="outfitGrad" x1="250" y1="390" x2="250" y2="850" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#26173E" />
                <stop offset="40%" stopColor="#1C102E" />
                <stop offset="100%" stopColor="#0F081B" />
              </linearGradient>

              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Deep Background Canvas */}
            <rect width="500" height="900" fill="url(#cyberSky)" />

            {/* Ambient Halo Behind Head */}
            <circle cx="250" cy="270" r="170" fill="url(#hairGlow)" filter="url(#softGlow)" />

            {/* Back Hair Silhouette */}
            <path
              d="M130 250 C110 380, 100 550, 120 700 C180 720, 320 720, 380 700 C400 550, 390 380, 370 250 Z"
              fill="#201133"
            />

            {/* Shoulders & Upper Body Silhouette */}
            <path
              d="M100 450 C120 400, 180 390, 250 390 C320 390, 380 400, 400 450 L450 780 C400 850, 100 850, 50 780 Z"
              fill="url(#outfitGrad)"
            />

            {/* Subtle Collarbones & Neck */}
            <path d="M220 310 L220 380 Q250 395 280 380 L280 310 Z" fill="url(#skinTone)" />

            {/* Neon Cyber Choker */}
            <path
              d="M218 362 Q250 376 282 362 L282 374 Q250 388 218 374 Z"
              fill="url(#neonChoker)"
              filter="url(#softGlow)"
            />
            {/* Glowing Pendant Heart */}
            <path
              d="M250 382 C246 376 238 376 238 382 C238 388 250 396 250 396 C250 396 262 388 262 382 C262 376 254 376 250 382 Z"
              fill="#FF6FAE"
              filter="url(#softGlow)"
            />

            {/* Face Shape */}
            <path
              d="M185 200 C185 150, 315 150, 315 200 C315 270, 285 320, 250 335 C215 320, 185 270, 185 200 Z"
              fill="url(#skinTone)"
            />

            {/* Soft Cheeks Blush */}
            <ellipse cx="205" cy="265" rx="18" ry="9" fill="#FF6FAE" opacity="0.38" filter="url(#softGlow)" />
            <ellipse cx="295" cy="265" rx="18" ry="9" fill="#FF6FAE" opacity="0.38" filter="url(#softGlow)" />

            {/* Elegant Eyes */}
            {/* Left Eye */}
            <path d="M198 238 Q215 230 230 240 Q215 244 198 238 Z" fill="#2E193C" stroke="#1D0B2B" strokeWidth="2" />
            <circle cx="215" cy="238" r="6" fill="#00E5FF" />
            <circle cx="215" cy="238" r="3" fill="#0F061C" />
            <circle cx="217" cy="236" r="1.5" fill="#FFFFFF" />

            {/* Right Eye */}
            <path d="M270 240 Q285 230 302 238 Q285 244 270 240 Z" fill="#2E193C" stroke="#1D0B2B" strokeWidth="2" />
            <circle cx="285" cy="238" r="6" fill="#00E5FF" />
            <circle cx="285" cy="238" r="3" fill="#0F061C" />
            <circle cx="287" cy="236" r="1.5" fill="#FFFFFF" />

            {/* Soft Feminine Eyebrows */}
            <path d="M198 226 Q215 220 230 228" stroke="#5E2C6B" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M270 228 Q285 220 302 226" stroke="#5E2C6B" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Petite Nose */}
            <path d="M248 260 Q250 268 253 268" stroke="#E294B6" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Gentle Smile (Animates subtly when speaking) */}
            <path
              d={isSpeaking ? 'M236 290 Q250 304 264 290 Q250 298 236 290 Z' : 'M238 292 Q250 300 262 292'}
              stroke="#D84A86"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill={isSpeaking ? '#E2548E' : 'none'}
            />

            {/* Flowing Front Hair / Bangs */}
            <path
              d="M175 180 C200 120, 300 120, 325 180 C340 220, 345 320, 320 400 C300 350, 310 270, 305 210 C270 240, 240 240, 200 205 C195 260, 200 340, 180 400 C160 330, 160 220, 175 180 Z"
              fill="url(#hairStrands)"
            />

            {/* Radiant Cyberpunk Hair Highlights */}
            <path
              d="M205 155 Q245 140 285 155"
              stroke="#FF94C2"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.75"
              filter="url(#softGlow)"
            />
            <path
              d="M178 280 Q170 360 185 430"
              stroke="#00E5FF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
              filter="url(#softGlow)"
            />
            <path
              d="M322 280 Q330 360 315 430"
              stroke="#FF6FAE"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
              filter="url(#softGlow)"
            />

            {/* Ambient Cyber Light Particle Embers */}
            <circle cx="160" cy="300" r="2" fill="#00E5FF" opacity="0.6" filter="url(#softGlow)" />
            <circle cx="340" cy="320" r="2.5" fill="#FF6FAE" opacity="0.7" filter="url(#softGlow)" />
            <circle cx="180" cy="460" r="1.5" fill="#9B6BFF" opacity="0.5" />
            <circle cx="320" cy="480" r="2" fill="#00E5FF" opacity="0.6" />
          </svg>
        )}
      </div>

      {/* Cinematic Vignette Overlay to ensure 100% UI readability for glass cards */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0B18] via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
