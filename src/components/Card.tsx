import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  technologies?: string[];
  links?: {
    live?: string;
    github?: string;
    demo?: string;
  };
  featured?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: 'default' | 'project' | 'actor' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  imageAlt,
  category,
  technologies = [],
  links,
  featured = false,
  className = '',
  onClick,
  children,
  variant = 'default',
  size = 'md',
}) => {
  const baseClasses =
    'bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-500 transition-all duration-300 overflow-hidden';

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

  const renderImage = () => {
    if (!image) return null;

    return (
      <div className='aspect-video bg-dark-700 rounded-lg mb-4 overflow-hidden'>
        <img
          src={image}
          alt={imageAlt || title}
          className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
        />
      </div>
    );
  };

  const renderCategory = () => {
    if (!category) return null;

    return (
      <div className='inline-block bg-primary-600/20 text-primary-400 text-xs font-medium px-2 py-1 rounded-full mb-3'>
        {category}
      </div>
    );
  };

  const renderTechnologies = () => {
    if (!technologies || technologies.length === 0) return null;

    return (
      <div className='flex flex-wrap gap-1 mb-4'>
        {technologies.slice(0, 3).map((tech, index) => (
          <span
            key={index}
            className='bg-dark-700 text-gray-300 text-xs px-2 py-1 rounded'
          >
            {tech}
          </span>
        ))}
        {technologies.length > 3 && (
          <span className='text-gray-500 text-xs px-2 py-1'>
            +{technologies.length - 3} more
          </span>
        )}
      </div>
    );
  };

  const renderLinks = () => {
    if (!links || (!links.live && !links.github && !links.demo)) return null;

    return (
      <div className='flex gap-2 mt-4'>
        {links.live && (
          <a
            href={links.live}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors'
          >
            Live Demo →
          </a>
        )}
        {links.github && (
          <a
            href={links.github}
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors'
          >
            GitHub →
          </a>
        )}
        {links.demo && (
          <a
            href={links.demo}
            target='_blank'
            rel='noopener noreferrer'
            className='text-secondary-400 hover:text-secondary-300 text-sm font-medium transition-colors'
          >
            Demo →
          </a>
        )}
      </div>
    );
  };

  const renderFeaturedBadge = () => {
    if (!featured) return null;

    return (
      <div className='absolute top-4 right-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-bold px-2 py-1 rounded-full'>
        Featured
      </div>
    );
  };

  const renderActorVariant = () => (
    <div className='text-center'>
      <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3'>
        <span className='text-white font-bold text-lg'>
          {title
            .split(' ')
            .map(name => name.charAt(0))
            .join('')}
        </span>
      </div>
      <h3 className='font-semibold text-white text-sm mb-1'>{title}</h3>
      {description && <p className='text-xs text-gray-500'>{description}</p>}
    </div>
  );

  const renderMinimalVariant = () => (
    <div>
      <h3 className='font-semibold text-white mb-2'>{title}</h3>
      {description && <p className='text-gray-400 text-sm'>{description}</p>}
    </div>
  );

  const renderDefaultVariant = () => (
    <>
      {renderImage()}
      {renderCategory()}
      <h3 className='text-xl font-semibold text-white mb-2'>{title}</h3>
      {description && <p className='text-gray-400 mb-4'>{description}</p>}
      {renderTechnologies()}
      {renderLinks()}
    </>
  );

  const renderProjectVariant = () => (
    <>
      {renderImage()}
      <div className='flex items-center justify-between mb-3'>
        {renderCategory()}
        {featured && (
          <div className='bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs font-bold px-2 py-1 rounded-full'>
            Featured
          </div>
        )}
      </div>
      <h3 className='text-xl font-semibold text-white mb-2'>{title}</h3>
      {description && (
        <p className='text-gray-400 mb-4 line-clamp-2'>{description}</p>
      )}
      {renderTechnologies()}
      {renderLinks()}
    </>
  );

  const renderContent = () => {
    switch (variant) {
      case 'actor':
        return renderActorVariant();
      case 'minimal':
        return renderMinimalVariant();
      case 'project':
        return renderProjectVariant();
      default:
        return renderDefaultVariant();
    }
  };

  const CardWrapper = onClick ? motion.div : 'div';
  const cardProps = onClick
    ? {
        whileHover: { y: -5 },
        whileTap: { scale: 0.98 },
        onClick,
        className: `${cardClasses} cursor-pointer`,
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
      };

  return (
    <CardWrapper {...cardProps}>
      {featured && variant !== 'project' && renderFeaturedBadge()}
      {children || renderContent()}
    </CardWrapper>
  );
};

export default Card;
