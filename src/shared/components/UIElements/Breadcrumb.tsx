import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className = '',
}) => {
  const baseClasses = 'breadcrumb';
  const breadcrumbClasses = `${baseClasses} ${className}`.trim();

  return (
    <nav className={breadcrumbClasses} aria-label='Breadcrumb'>
      <ol className='breadcrumb__list'>
        {items.map((item, index) => (
          <li key={index} className='breadcrumb__item'>
            {item.href ? (
              <a
                href={item.href}
                className='breadcrumb__link'
                onClick={item.onClick}
              >
                {item.label}
              </a>
            ) : (
              <span className='breadcrumb__text'>{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className='breadcrumb__separator'>{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
