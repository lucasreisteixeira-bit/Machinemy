export default function Mascot({ className = '', size = 120 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size * 1.15}
      viewBox="0 0 120 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left leg */}
      <path d="M38 108 L38 128" stroke="#17130F" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right leg */}
      <path d="M82 108 L82 128" stroke="#17130F" strokeWidth="3.5" strokeLinecap="round" />
      {/* Left shoe */}
      <ellipse cx="38" cy="131" rx="14" ry="7" fill="#FFFFFF" stroke="#17130F" strokeWidth="1.5" />
      <path d="M28 131 Q38 126 48 131" stroke="#17130F" strokeWidth="1.2" fill="none" />
      {/* Right shoe */}
      <ellipse cx="82" cy="131" rx="14" ry="7" fill="#FFFFFF" stroke="#17130F" strokeWidth="1.5" />
      <path d="M72 131 Q82 126 92 131" stroke="#17130F" strokeWidth="1.2" fill="none" />

      {/* Left arm */}
      <path d="M18 72 Q8 82 12 96" stroke="#17130F" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Right arm (thumbs up) */}
      <path d="M102 72 Q112 78 108 88" stroke="#17130F" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M108 88 L108 78" stroke="#17130F" strokeWidth="3" strokeLinecap="round" />
      <path d="M108 78 L114 72" stroke="#17130F" strokeWidth="2.5" strokeLinecap="round" />

      {/* Left glove */}
      <ellipse cx="12" cy="98" rx="8" ry="7" fill="#FFFFFF" stroke="#17130F" strokeWidth="1.2" />
      {/* Right glove (thumbs up) */}
      <ellipse cx="110" cy="90" rx="8" ry="7" fill="#FFFFFF" stroke="#17130F" strokeWidth="1.2" />

      {/* Box body */}
      <rect x="22" y="28" width="76" height="82" rx="4" fill="#D4A574" stroke="#8B6914" strokeWidth="2" />
      {/* Box top flap line */}
      <line x1="22" y1="38" x2="98" y2="38" stroke="#8B6914" strokeWidth="1.5" opacity="0.5" />
      {/* Box side fold */}
      <path d="M22 38 L60 28 L98 38" stroke="#8B6914" strokeWidth="1.5" fill="none" opacity="0.4" />

      {/* Left eye white */}
      <ellipse cx="46" cy="58" rx="14" ry="16" fill="#FFFFFF" stroke="#17130F" strokeWidth="1.5" />
      {/* Right eye white */}
      <ellipse cx="74" cy="58" rx="14" ry="16" fill="#FFFFFF" stroke="#17130F" strokeWidth="1.5" />
      {/* Left pupil */}
      <ellipse cx="48" cy="60" rx="7" ry="8" fill="#17130F" />
      {/* Right pupil */}
      <ellipse cx="76" cy="60" rx="7" ry="8" fill="#17130F" />
      {/* Eye shine */}
      <ellipse cx="45" cy="56" rx="3" ry="3.5" fill="#FFFFFF" />
      <ellipse cx="73" cy="56" rx="3" ry="3.5" fill="#FFFFFF" />

      {/* Freckles */}
      <circle cx="40" cy="72" r="1.5" fill="#8B6914" opacity="0.6" />
      <circle cx="44" cy="74" r="1.2" fill="#8B6914" opacity="0.6" />
      <circle cx="48" cy="72" r="1.3" fill="#8B6914" opacity="0.6" />
      <circle cx="72" cy="72" r="1.5" fill="#8B6914" opacity="0.6" />
      <circle cx="76" cy="74" r="1.2" fill="#8B6914" opacity="0.6" />
      <circle cx="80" cy="72" r="1.3" fill="#8B6914" opacity="0.6" />

      {/* Smile */}
      <path
        d="M48 82 Q60 94 72 82"
        stroke="#17130F"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Mouth interior */}
      <path d="M50 83 Q60 90 70 83" fill="#8B4513" opacity="0.3" />
    </svg>
  )
}
