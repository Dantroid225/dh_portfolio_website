import React from 'react';
import Card from './Card';

interface ProjectCardProps {
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
}

const ProjectCard: React.FC<ProjectCardProps> = ({
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
}) => {
  return (
    <Card variant='project' className={className} onClick={onClick}>
      {featured && <div className='card__featured-badge'>Featured</div>}

      {image && (
        <div className='card__image'>
          <img
            src={image}
            alt={imageAlt || title}
            className='card__image-img'
          />
        </div>
      )}

      <div className='card__content'>
        {category && <div className='card__category'>{category}</div>}

        <h3 className='card__title'>{title}</h3>

        {description && <p className='card__description'>{description}</p>}

        {technologies.length > 0 && (
          <div className='card__technologies'>
            {technologies.slice(0, 3).map((tech, index) => (
              <span key={index} className='card__technology'>
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className='card__technology-more'>
                +{technologies.length - 3} more
              </span>
            )}
          </div>
        )}

        {(links?.live || links?.github || links?.demo) && (
          <div className='card__links'>
            {links.live && (
              <a
                href={links.live}
                target='_blank'
                rel='noopener noreferrer'
                className='card__link card__link--live'
              >
                Live Demo →
              </a>
            )}
            {links.github && (
              <a
                href={links.github}
                target='_blank'
                rel='noopener noreferrer'
                className='card__link card__link--github'
              >
                GitHub →
              </a>
            )}
            {links.demo && (
              <a
                href={links.demo}
                target='_blank'
                rel='noopener noreferrer'
                className='card__link card__link--demo'
              >
                Demo →
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectCard;
