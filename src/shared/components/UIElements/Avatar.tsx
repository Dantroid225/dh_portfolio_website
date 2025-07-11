import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  initials,
  size = 'md',
  shape = 'circle',
  className = '',
}) => {
  const baseClasses = 'avatar';
  const sizeClasses = `avatar--${size}`;
  const shapeClasses = `avatar--${shape}`;

  const avatarClasses =
    `${baseClasses} ${sizeClasses} ${shapeClasses} ${className}`.trim();

  if (src) {
    return (
      <div className={avatarClasses}>
        <img src={src} alt={alt || 'Avatar'} className='avatar__image' />
      </div>
    );
  }

  return (
    <div className={avatarClasses}>
      <span className='avatar__initials'>{initials}</span>
    </div>
  );
};

export default Avatar;
