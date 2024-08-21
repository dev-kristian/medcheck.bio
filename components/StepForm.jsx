// components/StepForm.jsx
import React from 'react';
import ModernTabs from './ModernTabs';

export default function StepForm({ title, description, fields, values, handleChange, showFields, handleYesNo, customInput, handleCustomInputChange }) {
    
  function SelectableCard({ children, selected, onClick }) {
    return (
      <div
        className={`
          cursor-pointer p-2 rounded-xl transition-all duration-200 ease-in-out border-l-4 border-gray-300  shadow-md
          ${selected 
            ? 'border-teal-500 text-white bg-teal-500' 
            : 'bg-white text-gray-700 hover:border-teal-500'
          }
        `}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
      
  const tabs = [
    {
      label: "No",
      content: <div className="text-gray-400">No additional information is required.</div>
    },
    {
      label: "Yes",
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
            {fields.map((field) => (
              <SelectableCard
                key={field.name}
                selected={values[field.name]}
                onClick={() => handleChange(field.name)}
              >
                {field.label}
              </SelectableCard>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="custom-input" className="block text-sm font-medium text-gray-700 pb-2">
              Other (please specify):
            </label>
            <textarea
              id="custom-input"
              value={customInput}
              onChange={(e) => handleCustomInputChange(e.target.value)}
              className="auth-input w-full min-h-[100px] resize-y"
              placeholder="Enter any additional information"
              rows="3"
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className='p-0'>
      <h2 className="text-lg font-bold items-start text-teal-800">{title}</h2>
      <p className="items-start text-gray-600">{description}</p>
      <ModernTabs 
        tabs={tabs} 
        activeTab={showFields ? 1 : 0} 
        setActiveTab={(index) => handleYesNo(index === 1)}
      />
    </div>
  );
}
