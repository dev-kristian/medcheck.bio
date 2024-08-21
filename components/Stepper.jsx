// components/Stepper.jsx
'use client'

import { usePathname } from 'next/navigation';

const steps = [
  { path: '/welcome',},
  { path: '/welcome/introduction',},
  { path: '/welcome/general_information',},
  { path: '/welcome/medical_history',},
  { path: '/welcome/lifestyle',},
];

export function Stepper() {
  const pathname = usePathname();
  
  const currentStepIndex = steps.findIndex(step => pathname === step.path);

  return (
    <div className="flex w-full">
      {steps.map((step, index) => (
        <div 
          key={step.path} 
          className={`h-2 flex-1 transition-colors duration-300 ${index <= currentStepIndex ? 'bg-teal-500' : 'bg-gray-200'}`}
        >
          <span className="sr-only">{step.label}</span>
        </div>
      ))}
    </div>
  );
}
