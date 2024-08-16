import React from 'react';
import { AlertCircle, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

const getSeverityIcon = (severity) => {
  switch (severity) {
    case "critical": return <AlertTriangle className="text-red-700 w-5 h-5" />;
    case "high": return <AlertCircle className="text-red-500 w-5 h-5" />;
    case "moderate": return <Shield className="text-yellow-500 w-5 h-5" />;
    case "low": return <CheckCircle className="text-green-500 w-5 h-5" />;
    default: return null;
  }
};

const getSeverityTextColor = (severity) => {
  switch (severity) {
    case "critical": return "text-red-700";
    case "high": return "text-red-500";
    case "moderate": return "text-yellow-500";
    case "low": return "text-green-500";
    default: return "text-gray-500";
  }
};

const getBorderColor = (severity) => {
  switch (severity) {
    case "critical": return "border-red-700";
    case "high": return "border-red-500";
    case "moderate": return "border-yellow-500";
    case "low": return "border-green-500";
    default: return "border-gray-300";
  }
};

const ClinicalSignificanceCard = ({ significance }) => {
  const { name, preventive_measures, reason, risk_factors, severity } = significance;

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 ${getBorderColor(severity)}`}>
      <div className="flex items-center mb-2">
        <span className="mr-3">
          {getSeverityIcon(severity)}
        </span>
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>
      <p className="text-sm text-gray-700 mb-2">{reason}</p>
      <div className="text-sm text-gray-600 mb-2">
        <strong>Preventive Measures:</strong>
        <ul className="list-disc pl-5 mt-1">
          {preventive_measures.map((measure, index) => (
            <li key={index}>{measure}</li>
          ))}
        </ul>
      </div>
      {risk_factors && risk_factors.length > 0 && (
        <div className="text-sm text-gray-600 mb-2">
          <strong>Risk Factors:</strong>
          <ul className="list-disc pl-5 mt-1">
            {risk_factors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      )}
      <div className={`text-sm ${getSeverityTextColor(severity)}`}>
        <strong>Severity:</strong> <span className="capitalize">{severity}</span>
      </div>
    </div>
  );
};

export default ClinicalSignificanceCard;
