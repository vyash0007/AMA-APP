import React from 'react';

interface IncognitoIconProps {
  className?: string;
  size?: number;
}

export const IncognitoIcon: React.FC<IncognitoIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      {/* Hat */}
      <path d="M12 3L4 8h16l-8-5z" />
      
      {/* Hat brim */}
      <rect x="2" y="8" width="20" height="2" rx="1" />
      
      {/* Left lens */}
      <circle cx="8" cy="16" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Right lens */}
      <circle cx="16" cy="16" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Nose bridge */}
      <path d="M11.5 16h1" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
};
