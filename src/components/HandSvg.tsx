import React from 'react';
import { Move, HandSkin } from '../types/game';

interface HandSvgProps {
  move: Move;
  isAi?: boolean;
  skin?: HandSkin;
  className?: string;
  size?: number;
}

export const HandSvg: React.FC<HandSvgProps> = ({
  move,
  isAi = false,
  skin,
  className = '',
  size = 140
}) => {
  const primaryId = isAi ? 'ai-grad' : `player-grad-${skin?.id || 'classic'}`;
  const accentId = isAi ? 'ai-accent' : `player-accent-${skin?.id || 'classic'}`;

  // Custom skin colors or default palette
  const startColor = isAi ? '#F43F5E' : (skin?.colors.start || '#F59E0B');
  const midColor = isAi ? '#E11D48' : (skin?.colors.mid || '#D97706');
  const endColor = isAi ? '#9F1239' : (skin?.colors.end || '#B45309');
  const glowColor = isAi ? 'rgba(244,63,94,0.4)' : (skin?.colors.glow || 'rgba(245,158,11,0.4)');
  const skinHighlight = isAi ? '#FDA4AF' : (skin?.colors.highlight || '#FDE68A');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-[0_10px_20px_${glowColor}]`}
    >
      <defs>
        <linearGradient id={primaryId} x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={skinHighlight} />
          <stop offset="35%" stopColor={startColor} />
          <stop offset="70%" stopColor={midColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
        <linearGradient id={accentId} x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
        <filter id="hand-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={glowColor} />
        </filter>
      </defs>

      {/* Render according to Move */}
      {move === 'rock' && (
        <g filter="url(#hand-glow)">
          {/* Forearm / Wrist with battle gauntlet strap */}
          <path
            d="M20 145 L45 85 L70 85 L50 145 Z"
            fill={`url(#${primaryId})`}
            opacity="0.85"
          />
          <path
            d="M24 135 L62 135 L60 120 L28 120 Z"
            fill="#1E293B"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Fist Clench Base */}
          <path
            d="M45 85 C45 60, 60 45, 90 45 C118 45, 135 62, 135 88 C135 110, 115 125, 80 125 C55 125, 45 110, 45 85 Z"
            fill={`url(#${primaryId})`}
          />
          {/* Curled Knuckles (4 fingers) */}
          {/* Index */}
          <path
            d="M60 48 C60 38, 76 38, 76 52 C76 66, 60 66, 60 52 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Middle (Protruding) */}
          <path
            d="M74 44 C74 32, 92 32, 92 48 C92 64, 74 64, 74 48 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Ring */}
          <path
            d="M90 47 C90 36, 108 36, 108 52 C108 68, 90 68, 90 52 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Pinky */}
          <path
            d="M106 54 C106 45, 122 45, 122 60 C122 75, 106 75, 106 60 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Thumb locked across fingers */}
          <path
            d="M48 85 C48 70, 62 65, 85 70 C100 73, 105 85, 95 95 C85 105, 55 105, 48 85 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="3"
          />
          {/* Knuckle highlight shine */}
          <circle cx="83" cy="48" r="3" fill="#FFFFFF" opacity="0.6" />
          <circle cx="99" cy="51" r="2.5" fill="#FFFFFF" opacity="0.6" />
        </g>
      )}

      {move === 'paper' && (
        <g filter="url(#hand-glow)">
          {/* Forearm & Wrist */}
          <path
            d="M25 145 L50 95 L80 95 L60 145 Z"
            fill={`url(#${primaryId})`}
            opacity="0.85"
          />
          <path
            d="M28 135 L68 135 L66 122 L32 122 Z"
            fill="#1E293B"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Palm Base */}
          <path
            d="M50 95 C50 75, 60 70, 75 70 L115 75 C125 90, 120 115, 85 120 C60 120, 50 110, 50 95 Z"
            fill={`url(#${primaryId})`}
          />
          {/* Open Fingers Extended Upward */}
          {/* Index Finger */}
          <path
            d="M62 72 L64 24 C64 16, 75 16, 75 24 L76 72 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Middle Finger */}
          <path
            d="M77 71 L81 16 C81 8, 93 8, 93 16 L91 71 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Ring Finger */}
          <path
            d="M93 72 L98 22 C98 14, 110 14, 110 22 L106 73 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Pinky Finger */}
          <path
            d="M108 76 L118 36 C118 29, 128 29, 128 36 L120 82 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Thumb splayed outward */}
          <path
            d="M54 90 C45 85, 34 78, 38 68 C42 58, 52 64, 62 76 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Fingertip gleams */}
          <circle cx="87" cy="18" r="2.5" fill="#FFFFFF" opacity="0.7" />
          <circle cx="70" cy="25" r="2" fill="#FFFFFF" opacity="0.7" />
        </g>
      )}

      {move === 'scissors' && (
        <g filter="url(#hand-glow)">
          {/* Forearm & Wrist */}
          <path
            d="M25 145 L50 95 L80 95 L60 145 Z"
            fill={`url(#${primaryId})`}
            opacity="0.85"
          />
          <path
            d="M28 135 L68 135 L66 122 L32 122 Z"
            fill="#1E293B"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Palm Base & Folded Fingers */}
          <path
            d="M50 92 C50 75, 65 72, 85 75 C115 80, 118 105, 95 120 C70 120, 50 110, 50 92 Z"
            fill={`url(#${primaryId})`}
          />
          {/* Folded Ring and Pinky */}
          <path
            d="M85 78 C95 78, 108 84, 105 98 C102 110, 85 106, 85 92 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Extended Index Finger (Splayed Left) */}
          <path
            d="M65 76 L55 22 C53 14, 66 12, 70 20 L80 74 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Extended Middle Finger (Splayed Right) */}
          <path
            d="M79 73 L105 20 C110 13, 122 18, 116 26 L93 76 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Thumb clamping over folded ring finger */}
          <path
            d="M52 88 C50 78, 62 74, 82 78 C90 82, 88 94, 76 96 C62 98, 54 94, 52 88 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Scissor Gleam Sparkle on Blade Tips */}
          <polygon
            points="62,18 64,12 66,18 72,20 66,22 64,28 62,22 56,20"
            fill="#FFFFFF"
            opacity="0.9"
          />
          <polygon
            points="110,18 112,13 114,18 119,20 114,22 112,27 110,22 105,20"
            fill="#FFFFFF"
            opacity="0.9"
          />
        </g>
      )}

      {move === 'lizard' && (
        <g filter="url(#hand-glow)">
          {/* Forearm */}
          <path d="M25 145 L50 95 L80 95 L60 145 Z" fill={`url(#${primaryId})`} opacity="0.85" />
          {/* Snapping hand puppet lizard head */}
          {/* Upper snout (4 fingers pressed together) */}
          <path
            d="M50 85 C55 60, 75 45, 115 40 C135 38, 145 48, 135 60 C120 70, 85 75, 75 80 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Lower jaw (thumb) */}
          <path
            d="M55 88 C65 92, 90 98, 120 102 C132 104, 130 118, 115 116 C85 112, 65 105, 55 88 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Lizard Eye */}
          <circle cx="95" cy="52" r="5" fill="#0F172A" />
          <circle cx="96" cy="51" r="2" fill="#34D399" />
          <circle cx="97" cy="50" r="1" fill="#FFFFFF" />
        </g>
      )}

      {move === 'spock' && (
        <g filter="url(#hand-glow)">
          {/* Forearm */}
          <path d="M25 145 L50 95 L80 95 L60 145 Z" fill={`url(#${primaryId})`} opacity="0.85" />
          {/* Palm */}
          <path
            d="M50 95 C50 75, 60 70, 75 70 L115 75 C125 90, 120 115, 85 120 C60 120, 50 110, 50 95 Z"
            fill={`url(#${primaryId})`}
          />
          {/* Index + Middle paired together */}
          <path
            d="M60 75 L62 20 C62 14, 75 14, 75 20 L76 72 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          <path
            d="M75 72 L77 16 C77 10, 88 10, 88 16 L88 72 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Wide Vulcan Gap in the middle */}
          {/* Ring + Pinky paired together */}
          <path
            d="M96 73 L105 18 C105 12, 116 12, 116 18 L110 74 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          <path
            d="M110 75 L122 25 C122 19, 132 19, 132 25 L122 80 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Thumb extended sideways */}
          <path
            d="M52 90 C42 85, 30 76, 36 66 C42 58, 52 64, 60 76 Z"
            fill={`url(#${primaryId})`}
            stroke="#0F172A"
            strokeWidth="2.5"
          />
        </g>
      )}
    </svg>
  );
};
