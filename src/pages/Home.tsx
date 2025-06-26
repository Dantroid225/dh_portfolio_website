import { motion } from 'framer-motion';

const Home = () => {
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='btn-primary text-lg px-8 py-3'
              >
                View Projects
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='btn-outline text-lg px-8 py-3'
              >
                Get in Touch
              </motion.button>
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
            <h2 className='text-4xl font-bold mb-4'>Featured Work</h2>
            <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
              Explore my latest projects showcasing web development, 3D
              modeling, and creative digital solutions
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Placeholder project cards */}
            {[1, 2, 3].map(item => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item * 0.1 }}
                whileHover={{ y: -10 }}
                className='card group cursor-pointer'
              >
                <div className='aspect-video bg-dark-700 rounded-lg mb-4 group-hover:bg-primary-600/20 transition-colors duration-300'></div>
                <h3 className='text-xl font-semibold mb-2'>Project {item}</h3>
                <p className='text-gray-400'>
                  A creative project showcasing modern web development and
                  design principles.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
