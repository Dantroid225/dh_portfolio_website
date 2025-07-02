import React from 'react';

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ children, className = '' }) => {
  return <nav className={`navbar ${className}`.trim()}>{children}</nav>;
};

export default Navbar;
