import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const baseClasses = 'tabs';
  const tabsClasses = `${baseClasses} ${className}`.trim();

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={tabsClasses}>
      <div className='tabs__header'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tabs__tab ${activeTab === tab.id ? 'tabs__tab--active' : ''} ${tab.disabled ? 'tabs__tab--disabled' : ''}`}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className='tabs__content'>{activeTabContent}</div>
    </div>
  );
};

export default Tabs;
