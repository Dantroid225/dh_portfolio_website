import React, { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const baseClasses = 'accordion';
  const accordionClasses = `${baseClasses} ${className}`.trim();

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setOpenItems(prev => (prev.includes(itemId) ? [] : [itemId]));
    }
  };

  return (
    <div className={accordionClasses}>
      {items.map(item => {
        const isOpen = openItems.includes(item.id);

        return (
          <div key={item.id} className='accordion__item'>
            <button
              className={`accordion__header ${isOpen ? 'accordion__header--open' : ''} ${item.disabled ? 'accordion__header--disabled' : ''}`}
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
            >
              <span className='accordion__title'>{item.title}</span>
              <span className='accordion__icon'>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <div className='accordion__content'>{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
