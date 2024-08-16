import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const getUrgencyIcon = (urgency) => {
  switch (urgency) {
    case "urgent": return <AlertCircle className="text-red-500 w-4 h-4" />;
    case "soon": return <Clock className="text-yellow-500 w-4 h-4" />;
    case "routine": return <CheckCircle className="text-green-500 w-4 h-4" />;
    default: return null;
  }
};

const getBorderColor = (urgency) => {
  switch (urgency) {
    case "urgent": return "border-red-500";
    case "soon": return "border-yellow-500";
    case "routine": return "border-green-500";
    default: return "border-gray-300";
  }
};

const SpecialtyConsultationCard = ({ consultation }) => {
  const { name, reason, urgency } = consultation;

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 ${getBorderColor(urgency)}`}>
      <div className="flex items-center mb-2">
        <span className="mr-2">
          {getUrgencyIcon(urgency)}
        </span>
        <h3 className="font-semibold text-base">{name}</h3>
      </div>
      <p className="text-sm text-gray-700 italic mb-2">{reason}</p>
    </div>
  );
};

export default SpecialtyConsultationCard;
