import { motion } from 'framer-motion';
import { Badge, Card, Divider } from '@/shared/components';

const About = () => {
  const professionalExperience = [
    {
      company: 'HIGHER LOGIC',
      period: '8/2019 – 4/2025',
      roles: [
        {
          title: 'Lead Application Engineering Developer',
          period: '11/2022 – 4/2025',
          achievements: [
            'Drove application engineering growth by leading/mentoring a dynamic team and championing implementation and integration improvement initiatives',
            'Evolved support capabilities by leading comprehensive digital transformation efforts',
            'Skilled in maintaining and debugging MVC marketing automation web services, ensuring optimal performance of relational SQL databases and middleware solutions',
            'Lead the development and adoption of enhanced processes for documentation, service monitoring, and resolving complex tickets',
            'Designed and implemented scalable solutions for customized API integrations and reports utilizing technologies such as SQL, PowerShell, and .NET',
          ],
        },
        {
          title: 'Senior Application Engineering Developer',
          period: '4/2022 – 11/2022',
          achievements: [
            "Continuously improved core support workflows while transforming the engineering organization's training and onboarding capabilities",
            'Fostered cross-functional collaboration and key process enhancements by developing custom solutions',
            'Accelerated incident detection times and mitigated potential customer impacts by implementing custom dashboards and a tailored DataDog alert system',
            'Improved new engineer ramp-up speed by ~30%, building a structured onboarding program focused on building expertise in the enterprise technology stack',
          ],
        },
        {
          title: 'Junior Application Engineer',
          period: '8/2019 – 10/2020',
          achievements: [
            'Utilized technical expertise and troubleshooting skills to resolve disruptive application engineering business problems',
            'Enabled accurate/efficient response to alerts by developing dashboards and monitoring solutions',
            'Led back-end marketing automation of database processes, structure, and code repositories',
            "Orchestrated escalation-level technical troubleshooting for Higher Logic's marketing automation platforms",
          ],
        },
      ],
    },
    {
      company: 'ZONES INFRASTRUCTURE',
      period: '11/2017 – 7/2019',
      roles: [
        {
          title: 'Team Lead Supervisor / Tier 3 Support Technician',
          period: '11/2017 – 7/2019',
          achievements: [
            'Coached team leads and support technicians on technical troubleshooting and customer service best practices',
            'Drove global technical support for an enterprise-class product',
            'Deep knowledge of Microsoft Office 365, Exchange Online, SharePoint Online, Teams, and OneDrive administration',
            'Responsible for taking escalated tickets from Tier 2 and facilitating interaction with Microsoft Engineering teams',
            'Experience with Office 365 migrations, data migration from legacy systems, and deployment of Microsoft 365 services',
            'Knowledge of implementing security measures, compliance policies, and data loss prevention strategies',
          ],
        },
      ],
    },
  ];

  const interests = [
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
        'Process Optimization',
        'Technical Documentation',
        'Mentoring',
        'Problem Solving',
      ],
    },
  ];

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
          <Badge variant='primary' size='lg' className='mb-4'>
            Experience
          </Badge>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='flex justify-center mb-8'
          >
            <div className='relative'>
              <div className='w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary-500 shadow-xl'>
                <img
                  src='/src/assets/dh_pic.png'
                  alt='Daniel H. Hill'
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </motion.div>

          <h1 className='text-4xl md:text-5xl font-bold mb-6'>
            <span className='gradient-text'>Experience</span>
          </h1>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            Lead Application Engineering Developer with 8+ years of experience
            in SaaS, system administration, and creative problem-solving
          </p>
        </motion.div>

        {/* Professional Experience */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mb-16'
        >
          <h2 className='text-3xl font-bold mb-8 text-center'>
            Professional Experience
          </h2>
          <div className='space-y-8'>
            {professionalExperience.map((job, jobIndex) => (
              <Card
                key={jobIndex}
                className='bg-dark-800 border border-dark-700'
              >
                <div className='p-8'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
                    <h3 className='text-2xl font-bold text-primary-400'>
                      {job.company}
                    </h3>
                    <Badge variant='secondary' size='lg'>
                      {job.period}
                    </Badge>
                  </div>
                  <div className='space-y-6'>
                    {job.roles.map((role, roleIndex) => (
                      <div
                        key={roleIndex}
                        className='border-l-4 border-primary-500 pl-6'
                      >
                        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
                          <h4 className='text-xl font-semibold text-white'>
                            {role.title}
                          </h4>
                          <span className='text-gray-400 text-sm'>
                            {role.period}
                          </span>
                        </div>
                        <ul className='space-y-2'>
                          {role.achievements.map(
                            (achievement, achievementIndex) => (
                              <li
                                key={achievementIndex}
                                className='text-gray-300 flex items-start'
                              >
                                <span className='text-primary-400 mr-2 mt-1'>
                                  ▹
                                </span>
                                {achievement}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mb-16'
        >
          <h2 className='text-3xl font-bold mb-8 text-center'>
            Interests & Focus Areas
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {interests.map((interest, index) => (
              <Card
                key={index}
                className='bg-dark-800 border border-dark-700 hover:border-primary-500 transition-colors duration-300'
              >
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
            ))}
          </div>
        </motion.div>

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
              Interested in Working Together?
            </h3>
            <p className='text-gray-400 mb-6 max-w-2xl mx-auto'>
              I'm passionate about creating innovative solutions and leading
              teams to success. Whether you need technical expertise, creative
              problem-solving, or leadership skills, I'd love to discuss how we
              can work together.
            </p>
            <a
              href='/contact'
              className='inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200'
            >
              Let's Connect
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
