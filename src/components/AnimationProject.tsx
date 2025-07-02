import React from 'react';

interface AnimationProjectProps {
  title: string;
  description?: string;
  gifSrc: string;
}

const AnimationProject: React.FC<AnimationProjectProps> = ({
  title,
  description,
  gifSrc,
}) => (
  <div className='bg-dark-800 rounded-xl p-6 shadow-lg border border-dark-700 flex flex-col items-center'>
    <h2 className='text-2xl font-bold mb-4 text-white'>{title}</h2>
    <img src={gifSrc} alt={title} className='w-32 h-32 mb-4' />
    {description && <p className='text-gray-400'>{description}</p>}
  </div>
);

export default AnimationProject;
