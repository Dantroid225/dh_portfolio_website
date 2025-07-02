import React from 'react';

interface AlertProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const baseClasses = 'alert';
  const typeClasses = `alert--${type}`;

  const alertClasses = `${baseClasses} ${typeClasses} ${className}`.trim();

  return (
    <div className={alertClasses}>
      <div className='alert__content'>
        {title && <div className='alert__title'>{title}</div>}
        <div className='alert__message'>{children}</div>
      </div>
      {onClose && (
        <button
          className='alert__close'
          onClick={onClose}
          aria-label='Close alert'
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
