import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center min-h-[400px] ${className}`}
      >
        <div className='text-center'>
          <div className='text-red-600 text-lg font-semibold mb-2'>Error</div>
          <div className='text-gray-600'>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Top 50 Actors</h2>
        <p className='text-gray-600'>
          Displaying {actors.length} actors from the database
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {actors.map(actor => (
          <div
            key={actor.actor_id}
            className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-200'
          >
            <div className='text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-white font-bold text-lg'>
                  {actor.first_name.charAt(0)}
                  {actor.last_name.charAt(0)}
                </span>
              </div>
              <h3 className='font-semibold text-gray-800 text-sm mb-1'>
                {actor.first_name} {actor.last_name}
              </h3>
              <p className='text-xs text-gray-500'>ID: {actor.actor_id}</p>
            </div>
          </div>
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
