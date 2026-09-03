interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 120, className = '' }: LogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width={size}
        height={size * 0.85}
        viewBox="0 0 200 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Upper eyelid - black */}
        <path
          d="M15 65 C45 20 75 5 100 5 C125 5 155 20 185 65"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Eye shape - purple */}
        <path
          d="M100 25 C30 25 5 85 5 85 C5 85 30 145 100 145 C170 145 195 85 195 85 C195 85 170 25 100 25Z"
          fill="var(--accent)"
        />
        {/* Inner white */}
        <path
          d="M100 40 C45 40 25 85 25 85 C25 85 45 130 100 130 C155 130 175 85 175 85 C175 85 155 40 100 40Z"
          fill="white"
        />
        {/* Iris */}
        <circle cx="100" cy="85" r="38" fill="var(--accent)" />
        {/* Iris detail */}
        <circle cx="100" cy="85" r="34" fill="none" stroke="var(--accent-dark)" strokeWidth="1.5" />
        <circle cx="100" cy="85" r="28" fill="none" stroke="#8b5cf6" strokeWidth="1" />
        {/* Iris radial lines */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + Math.cos(rad) * 22;
          const y1 = 85 + Math.sin(rad) * 22;
          const x2 = 100 + Math.cos(rad) * 33;
          const y2 = 85 + Math.sin(rad) * 33;
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#5b21b6"
              strokeWidth="1"
              opacity="0.4"
            />
          );
        })}
        {/* Pupil */}
        <circle cx="100" cy="85" r="16" fill="#0f0720" />
        {/* Light reflection */}
        <circle cx="107" cy="78" r="5" fill="white" opacity="0.9" />
        <circle cx="94" cy="92" r="2.5" fill="white" opacity="0.5" />
        {/* Lower eyelid curve - subtle */}
        <path
          d="M25 100 C50 135 75 148 100 148 C125 148 150 135 175 100"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
