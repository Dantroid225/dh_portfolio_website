import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge, Card, Divider } from '@/shared/components';

interface ArtPiece {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  status: 'placeholder' | 'coming-soon';
}

const fallbackArtPieces: ArtPiece[] = [
  {
    id: 1,
    title: '3D Character Design',
    description:
      'Coming soon - Detailed 3D character models and animations created in Blender',
    category: '3D Modeling',
    image: '/src/assets/space_hero.gif',
    status: 'coming-soon',
  },
  {
    id: 2,
    title: 'Digital Illustrations',
    description:
      'Coming soon - Digital artwork and illustrations created with Adobe Creative Suite',
    category: 'Digital Art',
    image: '/src/assets/react.svg',
    status: 'coming-soon',
  },
  {
    id: 3,
    title: 'Animation Projects',
    description:
      'Coming soon - 2D and 3D animations created with Unity and Adobe Animate',
    category: 'Animation',
    image: '/src/assets/space_hero.gif',
    status: 'coming-soon',
  },
  {
    id: 4,
    title: 'UI/UX Design',
    description:
      'Coming soon - User interface designs and user experience prototypes',
    category: 'Design',
    image: '/src/assets/react.svg',
    status: 'coming-soon',
  },
  {
    id: 5,
    title: 'Interactive Experiences',
    description:
      'Coming soon - Interactive web experiences and creative coding projects',
    category: 'Interactive',
    image: '/src/assets/space_hero.gif',
    status: 'coming-soon',
  },
  {
    id: 6,
    title: 'Motion Graphics',
    description:
      'Coming soon - Motion graphics and visual effects created with After Effects',
    category: 'Motion',
    image: '/src/assets/react.svg',
    status: 'coming-soon',
  },
];

// Define a type for the backend project data
interface BackendProject {
  id: number;
  title: string;
  description?: string;
  short_description?: string;
  category: string;
  thumbnail_url?: string;
  image_url?: string;
}

const Art = () => {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const fetchArtProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          '/api/projects?category=3d,animation,illustration&published=true&limit=12'
        );
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const transformed = json.data.map((proj: BackendProject) => ({
            id: proj.id,
            title: proj.title,
            description: proj.short_description || proj.description || '',
            category: proj.category,
            image:
              proj.thumbnail_url || proj.image_url || '/src/assets/react.svg',
            status: 'placeholder',
          }));
          setArtPieces(transformed);
          setUsedFallback(false);
        } else {
          setArtPieces(fallbackArtPieces);
          setUsedFallback(true);
        }
      } catch {
        setArtPieces(fallbackArtPieces);
        setUsedFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchArtProjects();
  }, []);

  return (
    <div className='pt-16 section-padding'>
      <div className='container-custom'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <Badge variant='secondary' size='lg' className='mb-4'>
            Creative Portfolio
          </Badge>
          <h1 className='text-4xl md:text-5xl font-bold mb-6'>
            <span className='gradient-text'>Art & Design</span> Portfolio
          </h1>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            A showcase of my creative work in 3D modeling, digital art,
            animation, and interactive design. New pieces coming soon!
          </p>
        </motion.div>

        {/* Art Grid */}
        {loading ? (
          <div className='text-center text-gray-400 py-16'>
            Loading art projects...
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
            {artPieces.map((piece, index) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className='h-full bg-dark-800 border border-dark-700 hover:border-primary-500 transition-colors duration-300'>
                  <div className='aspect-video bg-dark-700 rounded-t-lg flex items-center justify-center mb-4'>
                    <img
                      src={piece.image}
                      alt={piece.title}
                      className={`w-16 h-16 ${usedFallback ? 'opacity-50 object-contain' : 'object-cover'}`}
                    />
                  </div>
                  <div className='p-6'>
                    <div className='flex items-center justify-between mb-3'>
                      <Badge variant='info' size='sm'>
                        {piece.category}
                      </Badge>
                      {usedFallback && (
                        <Badge variant='secondary' size='sm'>
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <h3 className='text-xl font-semibold mb-3 text-white'>
                      {piece.title}
                    </h3>
                    <p className='text-gray-400 text-sm leading-relaxed'>
                      {piece.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center'
        >
          <Divider size='lg' />
          <div className='mt-8 p-8 bg-dark-800 rounded-lg border border-dark-700'>
            <h3 className='text-2xl font-bold mb-4'>
              Interested in Collaboration?
            </h3>
            <p className='text-gray-400 mb-6 max-w-2xl mx-auto'>
              I'm always open to creative projects and collaborations. Whether
              you need 3D modeling, digital art, or interactive experiences,
              let's create something amazing together.
            </p>
            <a
              href='/contact'
              className='inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200'
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Art;
