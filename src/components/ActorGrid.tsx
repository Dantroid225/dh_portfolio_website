import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ActorCard, LoadingSpinner, ErrorMessage } from '@/shared/components';

interface Actor {
  actor_id: number;
  first_name: string;
  last_name: string;
}

interface ActorGridProps {
  className?: string;
}

const ActorGrid: React.FC<ActorGridProps> = ({ className = '' }) => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/actors`
        );

        if (response.data.success) {
          setActors(response.data.data);
        } else {
          setError('Failed to fetch actors');
        }
      } catch (err) {
        console.error('Error fetching actors:', err);
        setError('Failed to load actors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, []);

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-[400px] ${className}`}
      >
        <LoadingSpinner size='lg' color='blue' />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center min-h-[400px] ${className}`}
      >
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Top 50 Actors</h2>
        <p className='text-gray-600'>
          Displaying {actors.length} actors from the database
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {actors.map(actor => (
          <ActorCard
            key={actor.actor_id}
            firstName={actor.first_name}
            lastName={actor.last_name}
            actorId={actor.actor_id}
          />
        ))}
      </div>

      {actors.length === 0 && (
        <div className='text-center py-8'>
          <div className='text-gray-500'>No actors found</div>
        </div>
      )}
    </div>
  );
};

export default ActorGrid;
