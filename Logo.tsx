import React from 'react';

export const Logo: React.FC<{ className?: string, light?: boolean }> = ({ className = "h-8", light = false }) => (
  <svg 
    viewBox="0 0 360 120" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="360" height="120" rx="60" fill={light ? "white" : "white"} />
    
    {/* Left Dark Background Section */}
    <path 
      d="M60 0 H130 C150 0 140 120 120 120 H60 C26.8629 120 0 93.1371 0 60 C0 26.8629 26.8629 0 60 0 Z" 
      fill="#0B1340" 
    />
    
    {/* Outline/Border */}
    <rect x="2" y="2" width="356" height="116" rx="58" stroke="#0044FF" strokeWidth="4" fill="none" />

    {/* The H Icon */}
    <g transform="translate(45, 25)">
      {/* Left blue figure */}
      <circle cx="15" cy="15" r="12" fill="#00B4FF" />
      <path d="M0 35 H30 V75 H0 Z" fill="#0044FF" rx="4" />
      
      {/* Right green figure */}
      <circle cx="55" cy="15" r="12" fill="#00E640" />
      <path d="M40 35 H70 V75 H40 Z" fill="#00A650" rx="4" />

      {/* Connecting bar */}
      <path d="M20 45 H50 V60 H20 Z" fill="#0044FF" />
      
      {/* Swoosh */}
      <path 
        d="M-15 50 C 15 85 70 85 90 40" 
        stroke="#00B4FF" 
        strokeWidth="4" 
        strokeLinecap="round" 
        fill="none" 
      />
    </g>

    {/* HRSync Text */}
    <g transform="translate(150, 65)">
      <text fontFamily="Inter, sans-serif" fontWeight="800" fontSize="48" fill="#0B1340">HR</text>
      <text x="65" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="48" fill="#0044FF">Sync</text>
    </g>
    
    {/* HRMS Text */}
    <g transform="translate(200, 95)">
      <text fontFamily="Inter, sans-serif" fontWeight="500" fontSize="18" fill="#6B7280" letterSpacing="6">HRMS</text>
    </g>
    
    {/* Lines around HRMS */}
    <line x1="150" y1="90" x2="185" y2="90" stroke="#00B4FF" strokeWidth="2" />
    <line x1="290" y1="90" x2="325" y2="90" stroke="#00A650" strokeWidth="2" />
  </svg>
);
