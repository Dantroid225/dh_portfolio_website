import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Badge, Divider, ProgressBar, Card } from '@/shared/components';

const Home = () => {
  // Professional skills based on resume
  const technicalSkills = [
    { name: 'SQL', level: 95 },
    { name: 'C#', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'PowerShell', level: 85 },
    { name: 'React', level: 80 },
    { name: 'Node.js', level: 75 },
  ];

  const toolsAndEnvironments = [
    'Visual Studio',
    'SSMS',
    'DBeaver',
    'GitHub',
    'MS Copilot',
    'Jira',
    'Bitbucket',
    'Confluence',
    'Postman',
    'SoapUI',
  ];

  const creativeSkills = [
    'Blender',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Adobe Animate',
    'Unity',
    'EbSynth',
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
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='flex justify-center mb-8'
            >
              <div className='relative'>
                <div className='w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary-500 shadow-2xl'>
                  <img
                    src='/src/assets/dh_pic.png'
                    alt='Daniel H. Hill'
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
            <h1 className='text-5xl md:text-7xl font-bold'>
              <span className='gradient-text'>Daniel Hill</span>
            </h1>
            <p className='text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto'>
              Lead Application Engineering Developer with 8+ years of experience
              in SaaS, system administration, and creative problem-solving
            </p>
          </motion.div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className='section-padding bg-dark-800'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <Badge variant='primary' size='lg' className='mb-4'>
              Professional Profile
            </Badge>
            <h2 className='text-4xl font-bold mb-6'>Professional Profile</h2>
            <p className='text-gray-400 text-lg max-w-4xl mx-auto leading-relaxed'>
              Multitalented Application Engineer with in-depth technical
              expertise and 8 years of experience in roles requiring creative
              problem-solving skills. Proven at optimizing processes,
              application development approaches, and technical support
              capabilities to drive operational excellence. Adept team leader
              who absorbs and implements new concepts quickly.
            </p>
          </motion.div>

          {/* Interests & Focus Areas */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
            {[
              {
                category: 'Technology',
                items: [
                  'Web Development',
                  '3D Modeling & Animation',
                  'Creative Coding',
                  'System Architecture',
                  'API Development',
                ],
              },
              {
                category: 'Creative',
                items: [
                  'Digital Art',
                  'Character Design',
                  'Motion Graphics',
                  'Interactive Experiences',
                  'Game Development',
                ],
              },
              {
                category: 'Professional',
                items: [
                  'Team Leadership',
                  'Process Improvement',
                  'Technical Documentation',
                  'Mentoring',
                  'Problem Solving',
                ],
              },
            ].map((interest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className='h-full bg-dark-700 border border-dark-600 hover:border-primary-500 transition-colors duration-300'>
                  <div className='p-6'>
                    <h3 className='text-xl font-bold mb-4 text-primary-400'>
                      {interest.category}
                    </h3>
                    <ul className='space-y-2'>
                      {interest.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className='text-gray-300 flex items-center'
                        >
                          <span className='text-secondary-400 mr-2'>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Skills */}
      <section className='section-padding'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl font-bold mb-4'>Technical Skills</h2>
            <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
              Proficient in modern development technologies and creative tools
            </p>
          </motion.div>

          {/* Programming Skills */}
          <div className='mb-12'>
            <h3 className='text-2xl font-bold mb-6 text-center'>
              Programming & Scripting
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
              {technicalSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className='text-center'
                >
                  <h4 className='font-semibold mb-2'>{skill.name}</h4>
                  <ProgressBar
                    value={skill.level}
                    variant='primary'
                    size='md'
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tools & Environments */}
          <div className='mb-12'>
            <h3 className='text-2xl font-bold mb-6 text-center'>
              Tools & Environments
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {toolsAndEnvironments.map((tool, index) => (
                <motion.div
                  key={tool}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className='h-full bg-dark-800 border border-dark-700 hover:border-secondary-500 transition-colors duration-300'>
                    <div className='p-4 text-center'>
                      <span className='text-sm font-medium text-gray-300'>
                        {tool}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Creative Skills */}
          <div>
            <h3 className='text-2xl font-bold mb-6 text-center'>
              Creative & 3D Skills
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {creativeSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className='h-full bg-dark-800 border border-dark-700 hover:border-primary-500 transition-colors duration-300'>
                    <div className='p-4 text-center'>
                      <span className='text-sm font-medium text-gray-300'>
                        {skill}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='section-padding bg-dark-800'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center'
          >
            <Divider size='lg' />
            <div className='mt-8 p-8 bg-dark-700 rounded-lg border border-dark-600'>
              <h3 className='text-2xl font-bold mb-4'>Ready to Connect?</h3>
              <p className='text-gray-400 mb-6 max-w-2xl mx-auto'>
                I'm always interested in new opportunities and collaborations.
                Whether you need technical expertise, creative solutions, or
                just want to discuss potential projects, I'd love to hear from
                you.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link to='/contact'>
                  <Button variant='primary' size='lg'>
                    Get in Touch
                  </Button>
                </Link>
                <Link to='/about'>
                  <Button variant='outline' size='lg'>
                    View Experience
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
