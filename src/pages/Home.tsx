import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Button,
  ProjectCard,
  Badge,
  Divider,
  ProgressBar,
} from '@/shared/components';

const Home = () => {
  // Sample featured projects data
  const featuredProjects = [
    {
      id: 1,
      title: 'Portfolio Website',
      description:
        'A modern, responsive portfolio built with React and TypeScript, featuring smooth animations and a clean design.',
      image: '/src/assets/react.svg',
      category: 'web',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      featured: true,
      links: {
        live: '#',
        github: '#',
      },
    },
    {
      id: 2,
      title: '3D Animation Project',
      description:
        'Interactive 3D scene created with Three.js, showcasing advanced lighting and particle effects.',
      image: '/src/assets/space_hero.gif',
      category: '3d',
      technologies: ['Three.js', 'WebGL', 'JavaScript'],
      featured: true,
      links: {
        live: '#',
        demo: '#',
      },
    },
    {
      id: 3,
      title: 'Mobile App Design',
      description:
        'UI/UX design for a mobile application, focusing on user experience and modern design principles.',
      image: '/src/assets/react.svg',
      category: 'mobile',
      technologies: ['Figma', 'Adobe XD', 'Prototyping'],
      featured: false,
      links: {
        live: '#',
      },
    },
  ];

  return (
    <div className='pt-16'>
      {/* Hero Section */}
      <section className='min-h-screen flex items-center justify-center relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary-900/20 to-secondary-900/20'></div>
        <div className='container-custom text-center relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='space-y-6'
          >
            <h1 className='text-5xl md:text-7xl font-bold'>
              <span className='gradient-text'>Creative</span> Developer
            </h1>
            <p className='text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto'>
              Crafting digital experiences through web development, 3D modeling,
              and interactive animations
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link to='/projects'>
                <Button variant='primary' size='lg'>
                  View Projects
                </Button>
              </Link>
              <Link to='/contact'>
                <Button variant='outline' size='lg'>
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className='section-padding bg-dark-800'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <Badge variant='primary' size='lg' className='mb-4'>
              Featured Work
            </Badge>
            <h2 className='text-4xl font-bold mb-4'>Latest Projects</h2>
            <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
              Explore my latest projects showcasing web development, 3D
              modeling, and creative digital solutions
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  category={project.category}
                  technologies={project.technologies}
                  links={project.links}
                  featured={project.featured}
                  onClick={() =>
                    (window.location.href = `/projects/${project.id}`)
                  }
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className='text-center mt-12'
          >
            <Divider size='lg' />
            <Link to='/projects'>
              <Button variant='secondary' size='lg' className='mt-8'>
                View All Projects
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className='section-padding'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl font-bold mb-4'>Skills & Technologies</h2>
            <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
              Proficient in modern web technologies and creative tools
            </p>
          </motion.div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              { name: 'React', level: 90 },
              { name: 'TypeScript', level: 85 },
              { name: 'Three.js', level: 80 },
              { name: 'Node.js', level: 75 },
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='text-center'
              >
                <h3 className='font-semibold mb-2'>{skill.name}</h3>
                <ProgressBar value={skill.level} variant='primary' size='md' />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
