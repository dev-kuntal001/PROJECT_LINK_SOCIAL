import React from 'react';

interface GdgLogoProps {
  className?: string;
  size?: number | string;
}

/**
 * Transparent SVG of the official GDG four-colour bracket logo:
 * - Left bracket `<`: Red (#EA4335) top arm, Blue (#4285F4) bottom arm
 * - Right bracket `>`: Green (#34A853) top arm, Yellow (#FBBC04) bottom arm
 */
export const GdgLogo: React.FC<GdgLogoProps> = ({ className = 'w-6 h-6', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      style={style}
      aria-label="GDG on Campus Logo"
    >
      {/* Left bracket `<` */}
      {/* Blue bottom arm */}
      <line
        x1="28"
        y1="50"
        x2="45"
        y2="67"
        stroke="#4285F4"
        strokeWidth="13.5"
        strokeLinecap="round"
      />
      {/* Red top arm */}
      <line
        x1="45"
        y1="33"
        x2="28"
        y2="50"
        stroke="#EA4335"
        strokeWidth="13.5"
        strokeLinecap="round"
      />

      {/* Right bracket `>` */}
      {/* Yellow bottom arm */}
      <line
        x1="72"
        y1="50"
        x2="55"
        y2="67"
        stroke="#FBBC04"
        strokeWidth="13.5"
        strokeLinecap="round"
      />
      {/* Green top arm */}
      <line
        x1="55"
        y1="33"
        x2="72"
        y2="50"
        stroke="#34A853"
        strokeWidth="13.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
