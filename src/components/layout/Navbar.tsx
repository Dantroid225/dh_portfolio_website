import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../shared/hooks/useTheme';
import { useAuth } from '@/shared/hooks';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    // { path: '/projects', label: 'Projects' }, // Hidden for soft launch
    { path: '/about', label: 'Experience' },
    { path: '/art', label: 'Art' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-700'>
      <div className='container-custom px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className='text-2xl font-bold gradient-text'
            >
              Daniel Hill
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-primary-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId='activeTab'
                    className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400'
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Admin Link */}
            {isAdmin && (
              <Link
                to='/admin'
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive('/admin')
                    ? 'text-secondary-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Admin
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className='p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors duration-200'
              aria-label='Toggle theme'
            >
              {theme === 'dark' ? (
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
                    clipRule='evenodd'
                  />
                </svg>
              ) : (
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors duration-200'
              aria-label='Toggle menu'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                {isOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className='md:hidden border-t border-dark-700'
            >
              <div className='py-4 space-y-2'>
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-400 bg-dark-800'
                        : 'text-gray-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    to='/admin'
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive('/admin')
                        ? 'text-secondary-400 bg-dark-800'
                        : 'text-gray-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    Admin
                  </Link>
                )}

                {/* Theme Toggle Mobile */}
                <button
                  onClick={toggleTheme}
                  className='w-full text-left px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-800 transition-colors duration-200'
                >
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
