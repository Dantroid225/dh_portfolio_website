import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  className = '',
}) => {
  return (
    <div className={`error-message ${className}`.trim()}>
      <div className='error-message__title'>{title}</div>
      <div className='error-message__message'>{message}</div>
    </div>
  );
};

export default ErrorMessage;
