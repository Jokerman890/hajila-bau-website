import React from 'react';

interface HexagonLogoProps {
  size?: number;
  color1?: string;
  color2?: string;
  className?: string;
}

const HexagonLogo: React.FC<HexagonLogoProps> = ({
  size = 32,
  color1 = '#00C3E3',
  color2 = '#005B9F',
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <defs>
      <linearGradient id="hex-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor={color1} />
        <stop offset="1" stopColor={color2} />
      </linearGradient>
    </defs>
    <polygon
      points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
      fill="url(#hex-gradient)"
      stroke={color2}
      strokeWidth="4"
      filter="drop-shadow(0 2px 8px rgba(0,0,0,0.15))"
    />
    <text
      x="50%"
      y="58%"
      textAnchor="middle"
      fontSize="38"
      fontWeight="bold"
      fill="#fff"
      fontFamily="Merriweather, serif"
      dominantBaseline="middle"
      style={{ letterSpacing: '-2px' }}
    >
      HB
    </text>
  </svg>
);

export default HexagonLogo;
