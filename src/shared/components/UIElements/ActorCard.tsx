import React from 'react';
import Card from './Card';

interface ActorCardProps {
  firstName: string;
  lastName: string;
  actorId: number;
  className?: string;
  onClick?: () => void;
}

const ActorCard: React.FC<ActorCardProps> = ({
  firstName,
  lastName,
  actorId,
  className = '',
  onClick,
}) => {
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  return (
    <Card variant='actor' className={className} onClick={onClick}>
      <div className='card__avatar'>
        <span className='card__avatar-text'>{initials}</span>
      </div>
      <h3 className='card__title'>{fullName}</h3>
      <p className='card__description'>ID: {actorId}</p>
    </Card>
  );
};

export default ActorCard;
