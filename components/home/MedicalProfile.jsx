import React from 'react';
import Link from 'next/link';
import { Calendar, User, Weight, ChevronsUp, ChevronUp, ChevronDown, Activity } from "lucide-react";

const getStatusColor = (likelihood) => {
  switch (likelihood.toLowerCase()) {
    case "high": return "text-red-500";
    case "medium": return "text-yellow-500";
    case "low": return "text-green-600";
    default: return "text-gray-500";
  }
};

const getStatusIcon = (likelihood) => {
  switch (likelihood.toLowerCase()) {
    case "high": return <ChevronsUp className="w-4 h-4" />;
    case "medium": return <ChevronUp className="w-4 h-4" />;
    case "low": return <ChevronDown className="w-4 h-4" />;
    default: return <Activity className='w-4 h-4'/>;
  }
};

const getBorderColor = (likelihood) => {
  switch (likelihood.toLowerCase()) {
    case "high": return "border-red-500";
    case "medium": return "border-yellow-500";
    case "low": return "border-green-600";
    default: return "border-gray-500";
  }
};

const ConditionDisplay = ({ condition }) => {
  return (
    <div className={`bg-white px-4 py-2 rounded-lg shadow-sm mb-3 grid grid-cols-[1fr,auto] gap-2 items-center border-l-4 ${getBorderColor(condition.likelihood)}`}>
      <div className="overflow-hidden">
        <div className="font-medium text-lg truncate">{condition.condition}</div>
        <div className="text-xs text-gray-400 truncate">
          {condition.description}
        </div>
      </div>
      <div className="flex items-center">
        <span className={`${getStatusColor(condition.likelihood)} mr-1 flex`}>
          {getStatusIcon(condition.likelihood)}
        </span>
        <div className={`font-bold ${getStatusColor(condition.likelihood)}`}>
          {condition.likelihood}
        </div>
      </div>
    </div>
  );
};

const getScoreColor = (score) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
};

const HealthScoreDisplay = ({ healthScore }) => {
  const scoreColor = getScoreColor(healthScore.score);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-24 h-24 rounded-full ${scoreColor} shadow-lg mb-2">
        <div className={`text-4xl font-extrabold ${scoreColor}`}>{healthScore.score}</div>
      </div>
      <div className="text-lg font-semibold text-gray-800 mb-1">{healthScore.category}</div>
      <div className="flex items-center justify-center">
        <Activity className={`w-4 h-4 mr-1 ${scoreColor}`} />
        <span className="text-xs font-medium text-gray-700">Health Score</span>
      </div>
    </div>
  );
};

const MedicalProfile = ({ profileData }) => {
  const { age, gender, bmi } = profileData?.profile || {};
  const potentialConditions = profileData?.potentialConditions?.conditions || [];
  const healthScore = profileData?.healthScore || {};

  return (
    <Link href="/medical-profile" className="tests-card-link w-full lg:w-3/5 h-full lg:h-auto">
        <section className="home-card flex flex-col ">
            <div className="flex flex-col items-start w-full mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Medical Profile</h2>
                <p className="text-sm text-gray-600">Comprehensive overview of your health data</p>
            </div>
            {profileData && (
            <div className="w-full">
                <div className="flex flex-wrap justify-start text-sm text-gray-600 mb-4">
                <div className="flex items-center mr-4 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                    <span>Age: {age?.years_old}</span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                    <User className="w-4 h-4 mr-2 text-teal-500" />
                    <span>Gender: {gender}</span>
                </div>
                <div className="flex items-center mb-2">
                    <Weight className="w-4 h-4 mr-2 text-teal-500" />
                    <span>BMI: {bmi?.toFixed(1)}</span>
                </div>
                </div>
                <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/5 lg:pr-4 lg:mb-0 flex items-center justify-center max-lg:pb-4">
                    <HealthScoreDisplay healthScore={healthScore} />
                </div>
                <div className="lg:w-4/5">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">Potential Conditions:</h3>
                    <div>
                    {potentialConditions.slice(0, 3).map((condition, index) => (
                        <ConditionDisplay key={index} condition={condition} />
                    ))}
                    </div>
                </div>
                </div>
            </div>
            )}
        </section>
    </Link>
);
};

export default MedicalProfile;