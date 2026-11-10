// Official mark: an "L" whose foot ends in a grid node (the brand's gold dot), with a
// power trace rising to a terminal. One source for the nav, favicon, and app icon.
// No hooks: it also renders inside next/og ImageResponse (icon.tsx, apple-icon.tsx).

type Props = { size?: number; framed?: boolean; id?: string; className?: string };

export function LogoMark({ size = 40, framed = true, id = "lm", className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Les John Paul Oliver logo"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-gold`} x1="14" y1="12" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F1D68F" />
          <stop offset="0.5" stopColor="#E0B94A" />
          <stop offset="1" stopColor="#B58E26" />
        </linearGradient>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1C1D27" />
          <stop offset="0.6" stopColor="#0E0F14" />
          <stop offset="1" stopColor="#050608" />
        </linearGradient>
      </defs>
      {framed && (
        <rect x="1" y="1" width="62" height="62" rx="14" fill={`url(#${id}-bg)`} stroke="#E0B94A" strokeOpacity="0.45" strokeWidth="1.5" />
      )}
      {/* The L */}
      <path d="M21 14V45H38" stroke={`url(#${id}-gold)`} strokeWidth="8" strokeLinejoin="miter" />
      {/* Power trace up to a terminal */}
      <path d="M46 40V25" stroke="#E0B94A" strokeOpacity="0.7" strokeWidth="2" />
      <circle cx="46" cy="20.5" r="3.5" stroke="#E0B94A" strokeOpacity="0.7" strokeWidth="2" />
      {/* The node: the brand's gold dot */}
      <circle cx="46" cy="45" r="4.5" fill="#E0B94A" />
    </svg>
  );
}
