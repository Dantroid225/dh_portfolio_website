import React from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'divider';
  const orientationClasses = `divider--${orientation}`;
  const sizeClasses = `divider--${size}`;

  const dividerClasses =
    `${baseClasses} ${orientationClasses} ${sizeClasses} ${className}`.trim();

  return <div className={dividerClasses} />;
};

export default Divider;
