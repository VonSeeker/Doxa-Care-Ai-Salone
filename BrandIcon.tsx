
import React from 'react';

interface BrandIconProps {
  className?: string;
  color?: string;
  size?: number | string;
}

const BrandIcon: React.FC<BrandIconProps> = ({ 
  className = "w-10 h-10", 
  color = "currentColor",
  size
}) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      style={size ? { width: size, height: size } : {}}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stethoscope tube forming the heart */}
      <path 
        d="M25 55 
           C 10 40, 10 15, 30 15 
           C 40 15, 50 25, 50 25 
           C 50 25, 60 15, 70 15 
           C 90 15, 90 40, 75 55 
           C 65 65, 55 85, 30 85" 
        stroke={color} 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Stethoscope Chestpiece */}
      <circle 
        cx="30" 
        cy="85" 
        r="7" 
        stroke={color} 
        strokeWidth="4" 
        fill="white"
      />
      
      {/* Inner Heart/EKG Pulse Line */}
      <path 
        d="M35 42 H 42 L 47 30 L 53 55 L 58 42 H 65" 
        stroke={color} 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BrandIcon;
