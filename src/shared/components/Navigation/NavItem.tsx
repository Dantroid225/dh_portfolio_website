import React from 'react';

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  children,
  href,
  active = false,
  className = '',
  onClick,
}) => {
  const baseClasses = 'nav-item';
  const activeClasses = active ? 'nav-item--active' : '';

  const navItemClasses = `${baseClasses} ${activeClasses} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={navItemClasses}>
        {children}
      </a>
    );
  }

  return (
    <div className={navItemClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default NavItem;
