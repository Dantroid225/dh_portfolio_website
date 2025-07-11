import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'badge';
  const variantClasses = `badge--${variant}`;
  const sizeClasses = `badge--${size}`;

  const badgeClasses =
    `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  return <span className={badgeClasses}>{children}</span>;
};

export default Badge;
