// components/RiskFactorsSummary.jsx

import React from 'react';
import { ChevronsUp, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';

const getSeverityColor = (severity) => {
  switch (severity) {
    case "high": return "text-red-500";
    case "medium": return "text-yellow-500";
    case "low": return "text-green-600";
    default: return "text-gray-500";
  }
};

const getSeverityIcon = (severity) => {
  switch (severity) {
    case "high": return <ChevronsUp className="w-4 h-4" />;
    case "medium": return <ChevronUp className="w-4 h-4" />;
    case "low": return <ChevronDown className="w-4 h-4" />;
    default: return <AlertTriangle className="w-4 h-4" />;
  }
};

const getSeverityBorderColor = (severity) => {
  switch (severity) {
    case "high": return "border-red-500";
    case "medium": return "border-yellow-500";
    case "low": return "border-green-600";
    default: return "border-gray-500";
  }
};

const RiskFactorDisplay = ({ riskFactor }) => {
  const { factor, severity, risk_level } = riskFactor;

  return (
    <div className={`w-full bg-white px-2 py-1 rounded-lg shadow-lg mb-3 flex justify-between items-center border-l-4 ${getSeverityBorderColor(severity)}`}>
      <div className="flex-grow">
        <div className="font-medium text-lg">{factor}</div>
        <div className="text-sm text-gray-500">{risk_level}</div>
      </div>
      <div className="text-right flex items-center">
        <span className={`${getSeverityColor(severity)} mr-2 flex`}>
          {getSeverityIcon(severity)}
        </span>
      </div>
    </div>
  );
};

const RiskFactorsSummary = ({ riskFactors }) => (
  <div className="w-full pt-4">
    {riskFactors.map((riskFactor, index) => (
      <RiskFactorDisplay 
        key={index} 
        riskFactor={riskFactor} 
      />
    ))}
  </div>
);

export default RiskFactorsSummary;
