import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Badge,
  Tabs,
  Accordion,
  Breadcrumb,
  ProjectGrid,
} from '@/shared/components';

const Projects = () => {
  const [activeCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: '3d', label: '3D & Animation' },
    { id: 'illustration', label: 'Illustration' },
  ];

  const projectStats = [
    { label: 'Total Projects', value: '24' },
    { label: 'Featured', value: '8' },
    { label: 'Technologies', value: '12+' },
    { label: 'Years Experience', value: '3+' },
  ];

  const faqItems = [
    {
      id: 'tech',
      title: 'What technologies do you use?',
      content:
        'I primarily work with React, TypeScript, Node.js, Three.js, and various design tools like Figma and Adobe Creative Suite.',
    },
    {
      id: 'process',
      title: 'What is your development process?',
      content:
        'I follow an iterative approach: planning, design, development, testing, and deployment. Each project is carefully crafted with attention to detail and user experience.',
    },
    {
      id: 'collaboration',
      title: 'Do you work with clients?',
      content:
        'Yes, I collaborate with clients to understand their needs and deliver custom solutions that exceed expectations.',
    },
  ];

  return (
    <div className='pt-16 section-padding'>
      <div className='container-custom'>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
          className='mb-6'
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center mb-12'
        >
          <Badge variant='primary' size='lg' className='mb-4'>
            Portfolio
          </Badge>
          <h1 className='text-4xl font-bold mb-4'>My Projects</h1>
          <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
            A collection of my work showcasing web development, 3D modeling, and
            creative digital solutions
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-12'
        >
          {projectStats.map(stat => (
            <div key={stat.label} className='text-center'>
              <div className='text-3xl font-bold text-primary-400 mb-1'>
                {stat.value}
              </div>
              <div className='text-gray-400 text-sm'>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='mb-8'
        >
          <Tabs
            tabs={categories.map(cat => ({
              id: cat.id,
              label: cat.label,
              content: null,
            }))}
            defaultTab={activeCategory}
          />
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ProjectGrid
            category={activeCategory === 'all' ? undefined : activeCategory}
            featuredOnly={false}
          />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className='mt-16'
        >
          <h2 className='text-2xl font-bold mb-6 text-center'>
            Frequently Asked Questions
          </h2>
          <Accordion items={faqItems} allowMultiple={false} />
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
