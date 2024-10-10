import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Activity } from 'lucide-react';

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

const getBorderColor = (interpretation) => {
  switch (interpretation) {
    case "extremely low":
    case "extremely high": return "border-red-500";
    case "very low":
    case "very high": return "border-orange-500";
    case "low":
    case "high": return "border-yellow-500";
    default: return "border-green-600";
  }
};

const BiomarkerDisplay = ({ biomarker, interpretation }) => {
  const { name, long_name, value, unit, reference_range, info } = biomarker;

  return (
    <div className={`bg-white px-2 py-1 rounded-lg shadow-lg mb-3 flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 ${getBorderColor(interpretation)}`}>
      <div className="flex-grow mb-3 md:mb-0">
        <div className="font-medium text-lg">{name}</div>
        <div className="text-sm text-gray-500">{long_name}</div>
        <div className="text-xs text-gray-400 mt-1">{info}</div>
      </div>
      <div className="text-right flex items-center">
        <span className={`${getStatusColor(interpretation)} mr-2 md:mr-1 flex`}>
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
    <div>
      {biomarkers.map((biomarker, index) => (
        <BiomarkerDisplay 
          key={index} 
          biomarker={biomarker} 
          interpretation={interpretations.find(i => i.name === biomarker.name)?.state || "normal"}
        />
      ))}
    </div>
);

export default BiomarkersTab;
