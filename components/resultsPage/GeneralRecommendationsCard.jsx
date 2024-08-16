import React from 'react';
import { Clock, AlertCircle, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

const getPriorityIcon = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'medium':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'low':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <Activity className="w-5 h-5 text-blue-500" />;
  }
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'text-green-500';
    case 'moderate':
      return 'text-yellow-500';
    case 'challenging':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const getBorderColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'border-red-500';
    case 'medium':
      return 'border-yellow-500';
    case 'low':
      return 'border-green-500';
    default:
      return 'border-blue-500';
  }
};

const GeneralRecommendationsCard = ({ recommendation }) => {
  const { name, reason, priority, difficulty, timeframe } = recommendation;

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 ${getBorderColor(priority)}`}>
      <div className="flex items-center mb-2">
        <span className="mr-3">
          {getPriorityIcon(priority)}
        </span>
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>
      <p className="text-sm text-gray-700 mb-3">{reason}</p>
      <div className="flex flex-wrap items-center text-sm text-gray-600 mt-2">
        <div className="flex items-center mr-4 mb-2">
          <Clock className="w-4 h-4 mr-1 text-gray-500" />
          <span>{timeframe}</span>
        </div>
        <div className={`flex items-center ${getDifficultyColor(difficulty)}`}>
          <Activity className="w-4 h-4 mr-1" />
          <span className="capitalize">{difficulty} difficulty</span>
        </div>
      </div>
      <div className="text-sm mt-2">
        <strong className={`${getDifficultyColor(priority)}`}>Priority:</strong> <span className="capitalize">{priority}</span>
      </div>
    </div>
  );
};

export default GeneralRecommendationsCard;