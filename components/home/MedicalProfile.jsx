import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Weight, ChevronsUp, ChevronUp, ChevronDown, Activity, FileText } from "lucide-react";
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

const getScoreColor = (score) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
};


const ConditionDisplay = ({ condition }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-all duration-200 border border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(condition.likelihood)} opacity-80`} />
        <div>
          <div className="font-medium text-sm text-gray-800">{condition.condition}</div>
          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{condition.description}</div>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white shadow-sm ${getStatusColor(condition.likelihood)}`}>
        {getStatusIcon(condition.likelihood)}
        <span className="text-xs font-medium">{condition.likelihood}</span>
      </div>
    </div>
  );
};

const HealthScoreDisplay = ({ healthScore }) => {
  const scoreColor = getScoreColor(healthScore.score);
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full bg-${scoreColor.replace('text-', '')}/10 border-4 ${scoreColor.replace('text-', 'border-')} shadow-lg`}>
        <div className={`text-3xl sm:text-4xl font-bold ${scoreColor}`}>{healthScore.score}</div>
        <div className="absolute -bottom-2 bg-white px-3 py-1 rounded-full shadow-sm">
          <span className="text-sm font-medium text-gray-600">{healthScore.category}</span>
        </div>
      </div>
    </div>
  );
};

const MedicalProfile = ({ profileData }) => {
  const { age, gender, bmi } = profileData?.profile || {};
  const potentialConditions = profileData?.potentialConditions?.conditions || [];
  const healthScore = profileData?.healthScore || {};

  return (
    <Link 
      href="/medical-profile" 
      className="tests-card-link w-full transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-500/20 rounded-xl"
    >
      <section className="home-card relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Health Score */}
          <div className="lg:w-72 xl:w-80 flex flex-col items-center justify-start">
            <div className="text-center mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                Health Score
              </h2>
              <p className="text-xs text-gray-500">Your overall health assessment</p>
            </div>
            <HealthScoreDisplay healthScore={healthScore} />

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                { icon: <Calendar className="w-3.5 h-3.5 text-teal-500" />, label: `${age?.years_old} years` },
                { icon: <User className="w-3.5 h-3.5 text-teal-500" />, label: gender },
                { icon: <Weight className="w-3.5 h-3.5 text-teal-500" />, label: `BMI ${bmi?.toFixed(1)}` }
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-1.5 bg-gray-100/80 px-2.5 py-1 rounded-full text-xs text-gray-600">
                  {stat.icon}
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">Key Health Indicators</div>
              <div className="text-xs text-gray-500">{potentialConditions.length} conditions identified</div>
            </div>
            
            <div className="space-y-2.5 mb-14 sm:mb-12">
              {potentialConditions.slice(0, 3).map((condition, index) => (
                <ConditionDisplay key={index} condition={condition} />
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="absolute bottom-4 right-4 flex items-center px-4 py-2 rounded-full bg-teal-50 hover:bg-teal-100 transition-all duration-300 shadow-sm hover:shadow group text-sm"
          aria-label="View details"
        >
          <FileText className="mr-2 h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
          <span className="text-teal-600 font-medium">View Details</span>
        </button>
      </section>
    </Link>
  );
};

export default MedicalProfile;