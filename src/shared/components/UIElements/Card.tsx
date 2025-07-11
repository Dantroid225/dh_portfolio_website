import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'project' | 'actor' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  className = '',
  style,
  children,
  onClick,
  variant = 'default',
  size = 'md',
}) => {
  const baseClasses = 'card';
  const variantClasses = `card--${variant}`;
  const sizeClasses = `card--${size}`;
  const interactiveClasses = onClick ? 'card--interactive' : '';

  const cardClasses =
    `${baseClasses} ${variantClasses} ${sizeClasses} ${interactiveClasses} ${className}`.trim();

  const CardWrapper = onClick ? motion.div : 'div';
  const cardProps = onClick
    ? {
        whileHover: { y: -5 },
        whileTap: { scale: 0.98 },
        onClick,
        className: cardClasses,
        style,
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        },
      }
    : {
        className: cardClasses,
        style,
      };

  return <CardWrapper {...cardProps}>{children}</CardWrapper>;
};

export default Card;
