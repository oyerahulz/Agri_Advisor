// Agri Advisor logo — leaf + upward growth + subtle circuit node motif.
// Scales cleanly from favicon to navbar size.

export default function Logo({ size = 32, title = "Agri Advisor logo" }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="agriLeaf" x1="8" y1="56" x2="56" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#15803d" />
          <stop offset="1" stopColor="#4ade80" />
        </linearGradient>
        <linearGradient id="agriStem" x1="32" y1="60" x2="32" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#166534" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      {/* Rounded square badge */}
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#agriLeaf)" />
      <rect x="2" y="2" width="60" height="60" rx="16" fill="none" stroke="#0f3d22" strokeOpacity="0.25" strokeWidth="2" />

      {/* Left leaf */}
      <path
        d="M14 40 C14 26, 24 18, 34 18 C34 32, 26 40, 14 40 Z"
        fill="#ffffff"
        fillOpacity="0.95"
      />
      <path d="M16.5 38 C22 32, 28 26, 33 20" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />

      {/* Right leaf */}
      <path
        d="M50 40 C50 26, 40 18, 30 18 C30 32, 38 40, 50 40 Z"
        fill="#dcfce7"
        fillOpacity="0.92"
      />
      <path d="M47.5 38 C42 32, 36 26, 31 20" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* Growth stem with circuit node */}
      <path
        d="M32 56 L32 34"
        stroke="url(#agriStem)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="30" r="4.5" fill="#ffffff" />
      <circle cx="32" cy="30" r="2.2" fill="#15803d" />
      <path d="M32 44 L40 44" stroke="#dcfce7" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      <circle cx="43" cy="44" r="2.4" fill="#dcfce7" />
      <path d="M32 50 L24 50" stroke="#dcfce7" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      <circle cx="21" cy="50" r="2.4" fill="#dcfce7" />
    </svg>
  );
}
