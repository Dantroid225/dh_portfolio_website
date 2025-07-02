import React from 'react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  removable = false,
  onRemove,
  className = '',
}) => {
  const baseClasses = 'tag';
  const variantClasses = `tag--${variant}`;
  const sizeClasses = `tag--${size}`;

  const tagClasses =
    `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  return (
    <span className={tagClasses}>
      <span className='tag__content'>{children}</span>
      {removable && onRemove && (
        <button
          className='tag__remove'
          onClick={onRemove}
          aria-label='Remove tag'
        >
          ×
        </button>
      )}
    </span>
  );
};

export default Tag;
