export default function IndustrialWatermarks() {
  return (
    <div className="login-watermarks" aria-hidden="true">
      {/* Wrench - middle left */}
      <svg className="watermark watermark--wrench" viewBox="0 0 120 120" fill="none">
        <path
          d="M20 90 L70 40 M70 40 L85 25 M70 40 L55 55 M85 25 C95 15 105 25 95 35 L80 50"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Gear - bottom right */}
      <svg className="watermark watermark--gear" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="22" stroke="currentColor" strokeWidth="3" />
        <circle cx="60" cy="60" r="10" stroke="currentColor" strokeWidth="2.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <rect
            key={angle}
            x="56"
            y="28"
            width="8"
            height="14"
            rx="2"
            fill="currentColor"
            transform={`rotate(${angle} 60 60)`}
          />
        ))}
      </svg>

      {/* Piston - bottom left */}
      <svg className="watermark watermark--piston" viewBox="0 0 100 140" fill="none">
        <rect x="30" y="20" width="40" height="60" rx="4" stroke="currentColor" strokeWidth="3" />
        <rect x="35" y="80" width="30" height="40" stroke="currentColor" strokeWidth="3" />
        <line x1="50" y1="120" x2="50" y2="135" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="2.5" />
      </svg>

      {/* Industrial bottle - middle right */}
      <svg className="watermark watermark--bottle" viewBox="0 0 80 140" fill="none">
        <rect x="28" y="50" width="24" height="80" rx="4" stroke="currentColor" strokeWidth="3" />
        <path d="M32 50 L32 30 Q40 20 48 30 L48 50" stroke="currentColor" strokeWidth="3" fill="none" />
        <rect x="34" y="22" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="2.5" />
        <rect x="30" y="90" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Warehouse shelves - top right */}
      <svg className="watermark watermark--shelves" viewBox="0 0 160 120" fill="none">
        <rect x="10" y="10" width="140" height="100" rx="2" stroke="currentColor" strokeWidth="2.5" />
        <line x1="10" y1="40" x2="150" y2="40" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="70" x2="150" y2="70" stroke="currentColor" strokeWidth="2" />
        <line x1="55" y1="10" x2="55" y2="110" stroke="currentColor" strokeWidth="2" />
        <line x1="105" y1="10" x2="105" y2="110" stroke="currentColor" strokeWidth="2" />
        <rect x="18" y="18" width="30" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="62" y="48" width="36" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="112" y="78" width="28" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
