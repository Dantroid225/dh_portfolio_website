import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'blue' | 'white';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'primary',
}) => {
  const baseClasses = 'loading-spinner';
  const sizeClasses = `loading-spinner--${size}`;
  const colorClasses = `loading-spinner--${color}`;

  const spinnerClasses =
    `${baseClasses} ${sizeClasses} ${colorClasses} ${className}`.trim();

  return (
    <div className={spinnerClasses}>
      <div className='loading-spinner__inner'></div>
    </div>
  );
};

export default LoadingSpinner;
