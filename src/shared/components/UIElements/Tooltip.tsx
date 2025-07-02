import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const baseClasses = 'tooltip';
  const positionClasses = `tooltip--${position}`;

  const tooltipClasses =
    `${baseClasses} ${positionClasses} ${className}`.trim();

  return (
    <div
      className='tooltip-container'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && <div className={tooltipClasses}>{content}</div>}
    </div>
  );
};

export default Tooltip;
