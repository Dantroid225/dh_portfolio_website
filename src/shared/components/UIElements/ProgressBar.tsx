import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const baseClasses = 'progress-bar';
  const sizeClasses = `progress-bar--${size}`;
  const variantClasses = `progress-bar--${variant}`;

  const progressClasses =
    `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`.trim();

  return (
    <div className={progressClasses}>
      {showLabel && (
        <div className='progress-bar__label'>{Math.round(percentage)}%</div>
      )}
      <div className='progress-bar__track'>
        <div
          className='progress-bar__fill'
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
