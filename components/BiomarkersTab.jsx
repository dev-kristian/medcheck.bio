import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Activity } from 'lucide-react';

const BiomarkerDisplay = ({ biomarker, interpretation }) => {
  const { name, long_name, value, unit, reference_range } = biomarker;

  const getStatusColor = (interpretation) => {
    switch (interpretation) {
      case "extremely low":
      case "extremely high": return "text-red-500";
      case "very low":
      case "very high": return "text-orange-500";
      case "low":
      case "high": return "text-yellow-500";
      default: return "text-green-600";
    }
  };

  const getStatusIcon = (interpretation) => {
    switch (interpretation) {
      case "extremely low": return <ChevronsDown className="w-4 h-4" />;
      case "very low": return <ChevronsDown className="w-4 h-4" />;
      case "low": return <ChevronDown className="w-4 h-4" />;
      case "normal": return <Activity className='w-4 h-4'/>;
      case "high": return <ChevronUp className="w-4 h-4" />;
      case "very high": return <ChevronsUp className="w-4 h-4" />;
      case "extremely high": return <ChevronsUp className="w-4 h-4" />;
      default: return null;
    }
  };
  

  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0">
      <div className="flex-grow">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500">{long_name}</div>
      </div>
      <div className="text-right flex items-center">
        <span className={`${getStatusColor(interpretation)} mr-1 flex`}>
          {getStatusIcon(interpretation)}
        </span>
        <div>
          <div className={`font-bold ${getStatusColor(interpretation)}`}>
            {value} {unit}
          </div>
          <div className="text-xs text-gray-500">Range: {reference_range}</div>
        </div>
      </div>
    </div>
  );
};

const BiomarkersTab = ({ biomarkers, interpretations }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="divide-y">
      {biomarkers.map((biomarker, index) => (
        <BiomarkerDisplay 
          key={index} 
          biomarker={biomarker} 
          interpretation={interpretations.find(i => i.name === biomarker.name)?.interpretation || "normal"}
        />
      ))}
    </div>
    </div>
  );

export default BiomarkersTab;
