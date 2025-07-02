import React from 'react';

interface BackdropProps {
  show: boolean;
  onClick?: () => void;
  className?: string;
}

const Backdrop: React.FC<BackdropProps> = ({
  show,
  onClick,
  className = '',
}) => {
  if (!show) return null;

  const baseClasses = 'backdrop';
  const backdropClasses = `${baseClasses} ${className}`.trim();

  return <div className={backdropClasses} onClick={onClick}></div>;
};

export default Backdrop;
