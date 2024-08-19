import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ModernTabs = ({ tabs, activeTab: controlledActiveTab, setActiveTab: controlledSetActiveTab }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(0);

  const isControlled = controlledActiveTab !== undefined && controlledSetActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;
  const setActiveTab = isControlled ? controlledSetActiveTab : setInternalActiveTab;

  return (
    <div className="w-full mx-auto">
      <div className="relative py-2 md:py-4">
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-2xl">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`relative flex-1 py-2 text-sm font-medium transition-colors duration-300 ${
                activeTab === index ? 'text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {activeTab === index && (
                <motion.div
                  layoutId="activetab"
                  className="absolute inset-0 bg-teal-500 rounded-2xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tabs[activeTab].content}
        </motion.div>
      </div>
    </div>
  );
};

export default ModernTabs;
