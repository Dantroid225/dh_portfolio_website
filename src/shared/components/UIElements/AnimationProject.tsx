import React from 'react';
import { Card } from '@/shared/components';

interface AnimationProjectProps {
  title: string;
  description?: string;
  gifSrc: string;
  className?: string;
}

const AnimationProject: React.FC<AnimationProjectProps> = ({
  title,
  description,
  gifSrc,
  className = '',
}) => (
  <Card variant='default' className={className}>
    <div className='text-center'>
      <h2 className='text-2xl font-bold mb-4 text-white'>{title}</h2>
      <img src={gifSrc} alt={title} className='w-32 h-32 mb-4 mx-auto' />
      {description && <p className='text-gray-400'>{description}</p>}
    </div>
  </Card>
);

export default AnimationProject;
