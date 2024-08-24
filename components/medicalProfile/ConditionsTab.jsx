import React from 'react';
import { Activity, Minus, ChevronUp, ChevronsUp } from 'lucide-react';

const severityColorMap = {
  high: { risk: 'text-red-500', protective: 'text-teal-700' },
  medium: { risk: 'text-yellow-500', protective: 'text-teal-300' },
  low: { risk: 'text-green-500', protective: 'text-gray-500' },
  default: 'text-gray-500'
};

const severityIconMap = {
  high: ChevronsUp,
  medium: ChevronUp,
  low: ChevronUp,
  default: Activity
};

const borderColorMap = {
  risk: {
    high: 'border-red-500',
    medium: 'border-orange-500',
    low: 'border-gray-500'
  },
  protective: {
    high: 'border-teal-700',
    medium: 'border-teal-300',
    low: 'border-gray-500'
  },
  default: 'border-gray-500'
};

const getColor = (severity, type) => 
  severityColorMap[severity?.toLowerCase()]?.[type] || severityColorMap.default;

const getIcon = (severity) => {
  const Icon = severityIconMap[severity?.toLowerCase()] || severityIconMap.default;
  return <Icon className="w-4 h-4" />;
};

const getBorderColor = (severity, type) => 
  borderColorMap[type]?.[severity?.toLowerCase()] || borderColorMap.default;

const sortByLikelihood = (conditions) => {
  const likelihoodOrder = { high: 1, medium: 2, low: 3 };
  return conditions.sort((a, b) => 
    likelihoodOrder[a.likelihood.toLowerCase()] - likelihoodOrder[b.likelihood.toLowerCase()]
  );
};

const FactorCard = ({ factor, type }) => {
  const severityOrEffectiveness = type === 'risk' ? factor.severity : factor.effectiveness;
  const colorClass = getColor(severityOrEffectiveness, type);
  const borderColorClass = getBorderColor(severityOrEffectiveness, type);
  
  return (
    <div className={`bg-white px-2 py-1 rounded-lg shadow-sm mb-2 flex justify-between items-center border-l-4 ${borderColorClass}`}>
      <div className="font-medium flex-grow">{factor.factor}</div>
      <div className="text-right flex items-center">
        <span className={`${colorClass} mr-1 flex`}>
          {getIcon(severityOrEffectiveness)}
        </span>
        <div className={`font-bold ${colorClass}`}>
          {severityOrEffectiveness}
        </div>
      </div>
    </div>
  );
};

const IconCard = ({ icon: Icon, text, iconClass }) => (
  <div className="bg-white px-2 py-1 rounded-lg shadow-sm mb-2 flex items-center border-l-4 border-gray-500">
    <span className="mr-1 flex">
      <Icon className={iconClass} />
    </span>
    <div className="font-medium">{text}</div>
  </div>
);

const SymptomCard = ({ symptom }) => {
  const frequencyIconMap = {
    frequent: ChevronsUp,
    occasional: ChevronUp,
    rare: Minus,
    default: Activity
  };
  const Icon = frequencyIconMap[symptom.frequency?.toLowerCase()] || frequencyIconMap.default;
  return <IconCard icon={Icon} text={symptom.symptom} iconClass="w-4 h-4" />;
};

const RecommendationCard = ({ recommendation }) => {
  const priorityIconMap = {
    high: ChevronsUp,
    medium: ChevronUp,
    low: Minus,
    default: Activity
  };
  const Icon = priorityIconMap[recommendation.priority?.toLowerCase()] || priorityIconMap.default;
  return <IconCard icon={Icon} text={recommendation.recommendation} iconClass="w-5 h-5 text-gray-500" />;
};

const ConditionsTab = ({ potentialConditions }) => {
  const sortedConditions = sortByLikelihood(potentialConditions.conditions);

  return (
    <div className="space-y-6">
      {sortedConditions.map((condition, index) => (
        <div key={index} className={`bg-white p-2 md:p-6 rounded-lg shadow-md mb-4 border-l-4 ${getBorderColor(condition.likelihood, 'risk')}`}>
          <div className="mb-4 flex items-center">
            {getIcon(condition.likelihood)}
            <h2 className="text-2xl font-semibold text-gray-900 ml-2">{condition.condition}</h2>
          </div>
          <p className="mb-4 text-gray-600">{condition.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {['risk_factors', 'protective_factors', 'symptoms'].map((section) => (
              <div key={section}>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {section.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h3>
                {condition[section].map((item, idx) => {
                  if (section === 'symptoms') {
                    return <SymptomCard key={idx} symptom={item} />;
                  }
                  return <FactorCard key={idx} factor={item} type={section.includes('risk') ? 'risk' : 'protective'} />;
                })}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-2 text-gray-800">Recommendations</h3>
          {condition.recommendations.map((rec, idx) => (
            <RecommendationCard key={idx} recommendation={rec} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ConditionsTab;
