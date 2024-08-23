import React from 'react';
import { Activity, Minus, ChevronUp, ChevronsUp } from 'lucide-react';

const getStatusColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

const getStatusIcon = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return <ChevronsUp className="w-4 h-4" />;
    case 'medium':
      return <ChevronUp className="w-4 h-4" />;
    case 'low':
      return <ChevronUp className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getBorderColor = (severity, type) => {
  if (type === 'protective') {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'border-teal-700';
      case 'medium':
        return 'border-teal-300';
      case 'low':
        return 'border-gray-500';
      default:
        return 'border-gray-500';
    }
  } else {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-orange-500';
      case 'low':
        return 'border-gray-500';
      default:
        return 'border-gray-500';
    }
  }
};

const getProtectiveFactorColor = (effectiveness) => {
  switch (effectiveness?.toLowerCase()) {
    case 'high':
      return 'text-teal-700';
    case 'medium':
      return 'text-teal-300';
    case 'low':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};

const sortByLikelihood = (conditions) => {
  const likelihoodOrder = { high: 1, medium: 2, low: 3 };
  return conditions.sort((a, b) => likelihoodOrder[a.likelihood.toLowerCase()] - likelihoodOrder[b.likelihood.toLowerCase()]);
};

const getPriorityIcon = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return <ChevronsUp className="w-5 h-5 text-gray-500" />;
    case 'medium':
      return <ChevronUp className="w-5 h-5 text-gray-500" />;
    case 'low':
      return <Minus className="w-5 h-5 text-gray-500" />;
    default:
      return <Activity className="w-5 h-5 text-gray-500" />;
  }
};

const getLikelihoodIcon = (likelihood) => {
  switch (likelihood?.toLowerCase()) {
    case 'high':
      return <ChevronsUp className="w-6 h-6 text-red-500" />;
    case 'medium':
      return <ChevronUp className="w-6 h-6 text-orange-500" />;
    case 'low':
      return <Minus className="w-6 h-6 text-gray-500" />;
    default:
      return <Activity className="w-6 h-6 text-gray-500" />;
  }
};

const FactorCard = ({ factor, type }) => {
  const severityOrEffectiveness = type === 'risk' ? factor.severity : factor.effectiveness;
  const colorClass = type === 'risk' ? getStatusColor(severityOrEffectiveness) : getProtectiveFactorColor(severityOrEffectiveness);
  const borderColorClass = getBorderColor(severityOrEffectiveness, type);
  return (
    <div className={`bg-white px-2 py-1 rounded-lg shadow-sm mb-2 flex justify-between items-center border-l-4 ${borderColorClass}`}>
      <div className="flex-grow">
        <div className="font-medium">{factor.factor}</div>
      </div>
      <div className="text-right flex items-center">
        <span className={`${colorClass} mr-1 flex`}>
          {getStatusIcon(severityOrEffectiveness)}
        </span>
        <div className={`font-bold ${colorClass}`}>
          {severityOrEffectiveness}
        </div>
      </div>
    </div>
  );
};

const SymptomCard = ({ symptom }) => {
  const getFrequencyIcon = (frequency) => {
    switch (frequency?.toLowerCase()) {
      case 'frequent':
        return <ChevronsUp className="w-4 h-4" />;
      case 'occasional':
        return <ChevronUp className="w-4 h-4" />;
      case 'rare':
        return <Minus className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white px-2 py-1 rounded-lg shadow-sm mb-2 flex justify-between items-center border-l-4 border-gray-500">
      <div className="flex flex-row items-center justify-center">
      <span className="mr-1 flex">
        {getFrequencyIcon(symptom.frequency)}
        </span>
        <div className="font-medium">{symptom.symptom}</div>
        </div>
      </div>
  );
};

const RecommendationCard = ({ recommendation }) => (
  <div className="bg-white px-2 py-1 rounded-lg shadow-sm mb-2 flex justify-between items-center border-l-4 border-gray-500">
    <div className="flex flex-row items-center justify-center">
      <span className="mr-1 flex">
        {getPriorityIcon(recommendation.priority)}
      </span>
      <div className="font-medium">{recommendation.recommendation}</div>
    </div>
  </div>
);

const ConditionsTab = ({ potentialConditions }) => {
  const sortedConditions = sortByLikelihood(potentialConditions.conditions);

  return (
    <div className="space-y-6">
      {sortedConditions.map((condition, index) => {
        return (
          <div key={index} className={`bg-white p-2 md:p-6 rounded-lg shadow-md mb-4 border-l-4 ${getBorderColor(condition.likelihood, 'risk')}`}>
            <div className="mb-4 flex items-center">
              {getLikelihoodIcon(condition.likelihood)}
              <h2 className="text-2xl font-semibold text-gray-900 ml-2">{condition.condition}</h2>
            </div>
            <p className="mb-4 text-gray-600">{condition.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Risk Factors</h3>
                {condition.risk_factors.map((factor, idx) => (
                  <FactorCard key={idx} factor={factor} type="risk" />
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Protective Factors</h3>
                {condition.protective_factors.map((factor, idx) => (
                  <FactorCard key={idx} factor={factor} type="protective" />
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Symptoms</h3>
                {condition.symptoms.map((symptom, idx) => (
                  <SymptomCard key={idx} symptom={symptom} />
                ))}
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">Recommendations</h3>
            {condition.recommendations.map((rec, idx) => (
              <RecommendationCard key={idx} recommendation={rec} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ConditionsTab;
