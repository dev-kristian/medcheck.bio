import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Activity } from 'lucide-react';

const getStatusColor = (state) => {
  switch (state) {
    case "extremely low":
    case "extremely high": return "text-red-500";
    case "very low":
    case "very high": return "text-orange-500";
    case "low":
    case "high": return "text-yellow-500";
    default: return "text-green-600";
  }
};

const getStatusIcon = (state) => {
  switch (state) {
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

const getBorderColor = (state) => {
  switch (state) {
    case "extremely low":
    case "extremely high": return "border-red-500";
    case "very low":
    case "very high": return "border-orange-500";
    case "low":
    case "high": return "border-yellow-500";
    default: return "border-green-600";
  }
};

const InterpretationCard = ({ interpretation }) => {
  const { name, personalized_context, state } = interpretation;

  return (
    <div className={`bg-white p-3 rounded-lg shadow-sm mb-3 flex items-center border-l-4 ${getBorderColor(state)}`}>
      <span className={`${getStatusColor(state)} mr-2`}>
        {getStatusIcon(state)}
      </span>
      <div className="flex items-center">
        <h3 className="font-semibold text-base mr-2">{name}:</h3>
        <p className="text-sm text-gray-600">{personalized_context}</p>
      </div>
    </div>
  );
};

export default InterpretationCard;
